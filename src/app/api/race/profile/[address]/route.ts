import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Get the first snapshot to determine when they started staking
    const firstSnapshot = await prisma.dailySnapshot.findFirst({
      where: { userId: user.id },
      orderBy: { timestamp: 'asc' },
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
        // Use first snapshot date as "staking since", fallback to joinedAt
        stakingSince: firstSnapshot?.timestamp || user.slothProfile.joinedAt,
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
