import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';

// Fetch the first delegation date from blockchain
async function getFirstDelegationDate(delegatorAddress: string): Promise<Date | null> {
  try {
    // Query for delegation transactions from this address to our validator
    const query = encodeURIComponent(
      `message.sender='${delegatorAddress}' AND delegate.validator='${COREEZY_VALIDATOR}'`
    );
    
    const response = await fetch(
      `${COREUM_REST}/cosmos/tx/v1beta1/txs?query=${query}&order_by=ORDER_BY_ASC&pagination.limit=1`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      // Try alternative query format
      const altQuery = encodeURIComponent(`message.sender='${delegatorAddress}'`);
      const altResponse = await fetch(
        `${COREUM_REST}/cosmos/tx/v1beta1/txs?query=${altQuery}&order_by=ORDER_BY_ASC&pagination.limit=50`,
        { next: { revalidate: 3600 } }
      );
      
      if (!altResponse.ok) return null;
      
      const altData = await altResponse.json();
      const txs = altData.tx_responses || [];
      
      // Find first delegation to our validator
      for (const tx of txs) {
        const messages = tx.tx?.body?.messages || [];
        for (const msg of messages) {
          if (
            msg['@type'] === '/cosmos.staking.v1beta1.MsgDelegate' &&
            msg.validator_address === COREEZY_VALIDATOR
          ) {
            return new Date(tx.timestamp);
          }
        }
      }
      return null;
    }

    const data = await response.json();
    const txs = data.tx_responses || [];
    
    if (txs.length > 0 && txs[0].timestamp) {
      return new Date(txs[0].timestamp);
    }

    return null;
  } catch (error) {
    console.error('Failed to fetch first delegation date:', error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  const { address } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: {
        slothProfile: {
          include: {
            activeBoosts: {
              where: { expiresAt: { gt: new Date() } },
            },
          },
        },
        snapshots: {
          orderBy: { timestamp: 'desc' },
          take: 30, // Last 30 days
        },
      },
    });

    if (!user || !user.slothProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get the first delegation date from blockchain
    const firstDelegationDate = await getFirstDelegationDate(address);

    // Calculate rank
    const rank = await prisma.slothProfile.count({
      where: {
        totalScore: { gt: user.slothProfile.totalScore },
      },
    });

    // Get total participants for percentile
    const totalParticipants = await prisma.slothProfile.count();
    const percentile = totalParticipants > 0 
      ? ((totalParticipants - rank) / totalParticipants) * 100 
      : 0;

    return NextResponse.json({
      profile: {
        address: user.walletAddress,
        name: user.slothProfile.name,
        class: user.slothProfile.class,
        rank: rank + 1,
        percentile: percentile.toFixed(1),
        score: user.slothProfile.totalScore.toString(),
        delegationScore: user.slothProfile.delegationScore.toString(),
        restakeStreak: user.slothProfile.restakeStreak,
        daysAwake: user.slothProfile.daysAwake,
        isSleeping: user.slothProfile.isSleeping,
        sleepUntil: user.slothProfile.sleepUntil,
        lastSiteVisit: user.slothProfile.lastSiteVisit,
        // First delegation date from blockchain, fallback to joinedAt
        stakingSince: firstDelegationDate?.toISOString() || user.slothProfile.joinedAt,
        joinedAt: user.slothProfile.joinedAt,
        activeBoosts: user.slothProfile.activeBoosts.map((b) => ({
          platform: b.platform,
          multiplier: b.multiplier,
          expiresAt: b.expiresAt,
        })),
      },
      history: user.snapshots.map((s) => ({
        date: s.timestamp,
        delegationAmount: s.delegationAmount.toString(),
        dailyScore: s.dailyScore.toString(),
        restakeActive: s.restakeActive,
        siteVisited: s.siteVisited,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
