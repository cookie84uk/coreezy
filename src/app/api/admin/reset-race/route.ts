import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

/**
 * Reset the Sloth Race data
 * - Zeros out all streaks
 * - Resets prize pool
 * - Optionally resets all scores
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      resetStreaks = true, 
      resetScores = false, 
      resetPrizePool = true,
      resetSnapshots = false 
    } = body;

    const results: Record<string, unknown> = {};

    // Reset all streaks to 0
    if (resetStreaks) {
      const streakResult = await prisma.slothProfile.updateMany({
        data: {
          restakeStreak: 0,
        },
      });
      results.streaksReset = streakResult.count;
    }

    // Reset all scores to 0 (only for full season reset)
    if (resetScores) {
      const scoreResult = await prisma.slothProfile.updateMany({
        data: {
          totalScore: BigInt(0),
          delegationScore: BigInt(0),
          daysAwake: 0,
        },
      });
      results.scoresReset = scoreResult.count;
    }

    // Reset prize pool
    if (resetPrizePool) {
      // Delete old prize pool keys
      await prisma.systemConfig.deleteMany({
        where: { 
          key: { 
            in: ['prize_pool_core', 'prize_pool_accumulated', 'prize_pool_manual'] 
          } 
        },
      });
      results.prizePoolReset = true;
    }

    // Delete all snapshots (only for complete reset)
    if (resetSnapshots) {
      const snapshotResult = await prisma.dailySnapshot.deleteMany({});
      results.snapshotsDeleted = snapshotResult.count;
    }

    // Log the reset
    await prisma.jobLog.create({
      data: {
        jobName: 'race_reset',
        status: 'success',
        completedAt: new Date(),
        metadata: {
          resetStreaks,
          resetScores,
          resetPrizePool,
          resetSnapshots,
          results,
        },
      },
    });

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Reset] Error:', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
