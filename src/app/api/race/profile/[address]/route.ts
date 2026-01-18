import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const COREUM_REST = 'https://full-node.mainnet-1.coreum.dev:1317';
const VALIDATOR_ADDRESS = 'corevaloper1xf3leu4yz62zy5ts8d5s0qmc93436mchl3fh49';

// Fetch the first delegation date from on-chain
async function getFirstDelegationDate(delegatorAddress: string): Promise<Date | null> {
  try {
    // Query delegation transactions for this delegator to our validator
    const query = encodeURIComponent(
      `delegate.delegator='${delegatorAddress}' AND delegate.validator='${VALIDATOR_ADDRESS}'`
    );
    
    const response = await fetch(
      `${COREUM_REST}/cosmos/tx/v1beta1/txs?query=${query}&order_by=ORDER_BY_ASC&pagination.limit=1`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (data.tx_responses && data.tx_responses.length > 0) {
      const firstTx = data.tx_responses[0];
      if (firstTx.timestamp) {
        return new Date(firstTx.timestamp);
      }
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

    // Get the REAL first delegation date from blockchain
    const firstDelegationDate = await getFirstDelegationDate(address);
    
    // Fallback to first snapshot if chain query fails
    const firstSnapshot = await prisma.dailySnapshot.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: 'asc' },
      select: { timestamp: true },
    });

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
        // Priority: stored stakingSince > on-chain date > first snapshot > joinedAt
        stakingSince: user.slothProfile.stakingSince || firstDelegationDate || firstSnapshot?.timestamp || user.slothProfile.joinedAt,
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
