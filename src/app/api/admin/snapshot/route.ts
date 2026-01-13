import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Delegation cap for scoring (50K CORE)
const DELEGATION_CAP = BigInt(50_000_000_000); // 50K * 10^6 (ucore)

// Restake detection threshold (in ucore)
const RESTAKE_THRESHOLD = BigInt(100_000); // 0.1 CORE

export async function POST(request: NextRequest) {
  // Verify admin secret
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('[Snapshot] Starting daily snapshot...');

    // Fetch all delegations from chain
    const delegations = await fetchAllDelegations();
    console.log(`[Snapshot] Found ${delegations.length} delegators`);

    const snapshotDate = new Date();
    // Normalize to date (no time) for uniqueness
    const snapshotDay = new Date(snapshotDate.toISOString().split('T')[0]);

    let processed = 0;
    let newUsers = 0;

    for (const delegation of delegations) {
      const { address, amount } = delegation;

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: { 
          slothProfile: { include: { activeBoosts: { where: { expiresAt: { gt: new Date() } } } } },
          snapshots: { orderBy: { timestamp: 'desc' }, take: 1 },
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            walletAddress: address,
            slothProfile: { create: {} },
          },
          include: { 
            slothProfile: { include: { activeBoosts: { where: { expiresAt: { gt: new Date() } } } } },
            snapshots: { orderBy: { timestamp: 'desc' }, take: 1 },
          },
        });
        newUsers++;
      }

      if (!user.slothProfile) {
        await prisma.slothProfile.create({
          data: { userId: user.id },
        });
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { 
            slothProfile: { include: { activeBoosts: { where: { expiresAt: { gt: new Date() } } } } },
            snapshots: { orderBy: { timestamp: 'desc' }, take: 1 },
          },
        });
      }

      // Calculate scoring
      const amountBigInt = BigInt(amount);
      const cappedAmount = amountBigInt > DELEGATION_CAP ? DELEGATION_CAP : amountBigInt;

      // Check for restake (delegation increase since last snapshot)
      const lastSnapshot = user!.snapshots[0];
      const lastAmount = lastSnapshot ? BigInt(lastSnapshot.delegationAmount) : BigInt(0);
      const netChange = amountBigInt - lastAmount;
      const isRestake = netChange > RESTAKE_THRESHOLD;

      // Check site visit (within last 24 hours)
      const siteVisited = user!.slothProfile?.lastSiteVisit 
        ? new Date(user!.slothProfile.lastSiteVisit).getTime() > Date.now() - 24 * 60 * 60 * 1000
        : false;

      // Get active boosts
      const boosts = user!.slothProfile?.activeBoosts || [];

      // Calculate daily score
      let dailyScore = cappedAmount;

      // Restake bonus (+10%)
      if (isRestake) {
        dailyScore = dailyScore + (dailyScore * BigInt(10)) / BigInt(100);
      }

      // Site visit bonus (+2%)
      if (siteVisited) {
        dailyScore = dailyScore + (dailyScore * BigInt(2)) / BigInt(100);
      }

      // Social boost multipliers
      for (const boost of boosts) {
        dailyScore = dailyScore + (dailyScore * BigInt(boost.multiplier)) / BigInt(100);
      }

      // Create or update snapshot for today
      await prisma.dailySnapshot.upsert({
        where: {
          userId_timestamp: {
            userId: user!.id,
            timestamp: snapshotDay,
          },
        },
        create: {
          userId: user!.id,
          timestamp: snapshotDay,
          delegationAmount: amountBigInt,
          netChange,
          restakeActive: isRestake,
          undelegated: false,
          siteVisited,
          dailyScore,
        },
        update: {
          delegationAmount: amountBigInt,
          netChange,
          restakeActive: isRestake,
          undelegated: false,
          siteVisited,
          dailyScore,
        },
      });

      // Update profile
      const currentStreak = user!.slothProfile!.restakeStreak;
      const newStreak = isRestake ? currentStreak + 1 : 0;
      const currentScore = user!.slothProfile!.totalScore;
      const newTotalScore = currentScore + dailyScore;

      await prisma.slothProfile.update({
        where: { id: user!.slothProfile!.id },
        data: {
          totalScore: newTotalScore,
          delegationScore: cappedAmount,
          restakeStreak: newStreak,
          daysAwake: { increment: 1 },
          isSleeping: false,
          sleepUntil: null,
        },
      });

      processed++;
    }

    // Update sloth classes based on distribution
    await updateSlothClasses();

    // Handle sleeping sloths (undelegated)
    await handleSleepingSloths(delegations.map(d => d.address), snapshotDay);

    console.log(`[Snapshot] Complete. Processed: ${processed}, New: ${newUsers}`);

    return NextResponse.json({
      success: true,
      processed,
      newUsers,
      timestamp: snapshotDate.toISOString(),
    });
  } catch (error) {
    console.error('[Snapshot] Error:', error);
    return NextResponse.json({ error: 'Snapshot failed' }, { status: 500 });
  }
}

async function fetchAllDelegations(): Promise<Array<{ address: string; amount: string }>> {
  const delegations: Array<{ address: string; amount: string }> = [];
  let nextKey: string | null = null;

  do {
    const params = new URLSearchParams();
    params.set('pagination.limit', '100');
    if (nextKey) params.set('pagination.key', nextKey);

    const response = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}/delegations?${params}`
    );

    if (!response.ok) break;

    const data = await response.json();
    for (const d of data.delegation_responses || []) {
      delegations.push({
        address: d.delegation.delegator_address,
        amount: d.balance.amount,
      });
    }

    nextKey = data.pagination?.next_key || null;
  } while (nextKey);

  return delegations;
}

async function updateSlothClasses() {
  // Get all profiles sorted by total score
  const profiles = await prisma.slothProfile.findMany({
    orderBy: { totalScore: 'desc' },
  });

  const total = profiles.length;
  if (total === 0) return;

  const adultThreshold = Math.ceil(total / 3);
  const teenThreshold = Math.ceil((total * 2) / 3);

  for (let i = 0; i < profiles.length; i++) {
    let newClass: 'BABY' | 'TEEN' | 'ADULT';
    if (i < adultThreshold) {
      newClass = 'ADULT';
    } else if (i < teenThreshold) {
      newClass = 'TEEN';
    } else {
      newClass = 'BABY';
    }

    if (profiles[i].class !== newClass) {
      await prisma.slothProfile.update({
        where: { id: profiles[i].id },
        data: { class: newClass },
      });
    }
  }
}

async function handleSleepingSloths(activeDelegators: string[], snapshotDay: Date) {
  // Find users who were active but no longer delegating
  const allProfiles = await prisma.slothProfile.findMany({
    where: { isSleeping: false },
    include: { user: { select: { walletAddress: true, id: true } } },
  });

  const sleepDuration = 3 * 24 * 60 * 60 * 1000; // 3 days

  for (const profile of allProfiles) {
    if (!activeDelegators.includes(profile.user.walletAddress)) {
      // Put sloth to sleep
      await prisma.slothProfile.update({
        where: { id: profile.id },
        data: {
          isSleeping: true,
          sleepUntil: new Date(Date.now() + sleepDuration),
        },
      });

      // Create snapshot showing undelegation
      await prisma.dailySnapshot.upsert({
        where: {
          userId_timestamp: {
            userId: profile.user.id,
            timestamp: snapshotDay,
          },
        },
        create: {
          userId: profile.user.id,
          timestamp: snapshotDay,
          delegationAmount: BigInt(0),
          netChange: BigInt(0) - profile.delegationScore,
          restakeActive: false,
          undelegated: true,
          siteVisited: false,
          dailyScore: BigInt(0),
        },
        update: {
          delegationAmount: BigInt(0),
          undelegated: true,
          dailyScore: BigInt(0),
        },
      });
    }
  }

  // Wake up sloths whose sleep time has passed and they're delegating again
  await prisma.slothProfile.updateMany({
    where: {
      isSleeping: true,
      sleepUntil: { lt: new Date() },
      user: { walletAddress: { in: activeDelegators } },
    },
    data: {
      isSleeping: false,
      sleepUntil: null,
    },
  });
}
