import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RACE_CONFIG, getDaysRemaining, isSeasonActive } from '@/lib/race-config';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';

// Verify admin auth
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return !!(ADMIN_SECRET && authHeader === `Bearer ${ADMIN_SECRET}`);
}

// GET - Fetch admin dashboard data
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch various stats in parallel
    const [
      userCount,
      profileCount,
      classDistribution,
      recentSnapshots,
      systemConfigs,
      recentJobs,
      pendingBoostRequests,
      validatorInfo,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.slothProfile.count(),
      prisma.slothProfile.groupBy({
        by: ['class'],
        _count: true,
      }),
      prisma.dailySnapshot.findMany({
        orderBy: { timestamp: 'desc' },
        take: 5,
        distinct: ['timestamp'],
        select: { timestamp: true, userId: true },
      }),
      prisma.systemConfig.findMany(),
      prisma.jobLog.findMany({
        orderBy: { startedAt: 'desc' },
        take: 10,
      }),
      prisma.boostRequest.count({ where: { status: 'PENDING' } }),
      fetchValidatorInfo(),
    ]);

    // Parse system configs into object
    const configs: Record<string, string> = {};
    systemConfigs.forEach((c) => {
      configs[c.key] = c.value;
    });

    // Get unique snapshot dates
    const snapshotDates = Array.from(new Set(recentSnapshots.map((s) => s.timestamp.toISOString().split('T')[0])));

    // Parse class distribution
    const classes = {
      ADULT: 0,
      TEEN: 0,
      BABY: 0,
    };
    classDistribution.forEach((c) => {
      classes[c.class] = c._count;
    });

    return NextResponse.json({
      overview: {
        totalUsers: userCount,
        totalProfiles: profileCount,
        pendingBoostRequests,
        seasonActive: isSeasonActive(),
        daysRemaining: getDaysRemaining(),
        season: RACE_CONFIG.season,
      },
      
      classes,
      
      prizePool: {
        accumulated: parseFloat(configs.prize_pool_accumulated || '0'),
        bonus: parseFloat(configs.prize_pool_bonus || '0'),
        lastUpdated: configs.prize_pool_last_updated || null,
        distribution: RACE_CONFIG.prizeDistribution,
        commissionPercent: RACE_CONFIG.commissionToPool,
      },
      
      validator: validatorInfo,
      
      snapshots: {
        recentDates: snapshotDates,
        lastRun: configs.last_snapshot_run || null,
      },
      
      recentJobs: recentJobs.map((j) => ({
        id: j.id,
        name: j.jobName,
        status: j.status,
        startedAt: j.startedAt,
        completedAt: j.completedAt,
        error: j.error,
      })),
      
      config: {
        seasonStartDate: RACE_CONFIG.season.startDate,
        seasonEndDate: RACE_CONFIG.season.endDate,
        prizeDistribution: RACE_CONFIG.prizeDistribution,
        commissionToPool: RACE_CONFIG.commissionToPool,
      },
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}

async function fetchValidatorInfo() {
  try {
    const [validatorRes, commissionRes] = await Promise.all([
      fetch(`${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}`),
      fetch(`${COREUM_REST}/cosmos/distribution/v1beta1/validators/${COREEZY_VALIDATOR}/commission`),
    ]);

    if (!validatorRes.ok || !commissionRes.ok) return null;

    const [validatorData, commissionData] = await Promise.all([
      validatorRes.json(),
      commissionRes.json(),
    ]);

    const validator = validatorData.validator;
    const commissionCoins = commissionData.commission?.commission || [];
    const coreCommission = commissionCoins.find((c: { denom: string }) => c.denom === 'ucore');
    const pendingCommission = coreCommission ? parseFloat(coreCommission.amount) / 1_000_000 : 0;

    return {
      moniker: validator?.description?.moniker || 'Unknown',
      tokens: (parseFloat(validator?.tokens || '0') / 1_000_000).toFixed(0),
      commissionRate: (parseFloat(validator?.commission?.commission_rates?.rate || '0') * 100).toFixed(1),
      pendingCommission: pendingCommission.toFixed(2),
      jailed: validator?.jailed || false,
      status: validator?.status || 'UNKNOWN',
    };
  } catch {
    return null;
  }
}
