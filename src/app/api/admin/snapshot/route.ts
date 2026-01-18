import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  calculateDailyDistance, 
  ucoreToCore, 
  isRestake as checkIsRestake,
  SCORING 
} from '@/lib/sloth-scoring';

const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: NextRequest) {
  // Verify admin secret
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if this is a season start (class recalculation) request
  const url = new URL(request.url);
  const recalculateClasses = url.searchParams.get('recalculate_classes') === 'true';

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
    let restakeCount = 0;

    for (const delegation of delegations) {
      const { address, amount } = delegation;
      const delegationCore = ucoreToCore(amount);

      // Find or create user
      let user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: { 
          slothProfile: { include: { activeBoosts: { where: { expiresAt: { gt: new Date() } } } } },
          snapshots: { orderBy: { timestamp: 'desc' }, take: 1 },
        },
      });

      const isNewUser = !user;

      if (!user) {
        // New delegator - set stakingSince to today
        user = await prisma.user.create({
          data: {
            walletAddress: address,
            slothProfile: { create: { 
              restakeStreak: 0,
              stakingSince: snapshotDay, // Real staking start date for new users
            } },
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
          data: { 
            userId: user.id, 
            restakeStreak: 0,
            stakingSince: snapshotDay, // Real staking start date
          },
        });
        user = await prisma.user.findUnique({
          where: { id: user.id },
          include: { 
            slothProfile: { include: { activeBoosts: { where: { expiresAt: { gt: new Date() } } } } },
            snapshots: { orderBy: { timestamp: 'desc' }, take: 1 },
          },
        });
      }

      // Get previous delegation amount
      const lastSnapshot = user!.snapshots[0];
      const previousDelegationCore = lastSnapshot 
        ? ucoreToCore(lastSnapshot.delegationAmount) 
        : 0;
      
      const netChangeCore = delegationCore - previousDelegationCore;
      
      // Check for restake (delegation increased above threshold)
      const didRestake = checkIsRestake(delegationCore, previousDelegationCore);
      if (didRestake) restakeCount++;

      // Check site visit (within last 24 hours)
      const siteVisited = user!.slothProfile?.lastSiteVisit 
        ? new Date(user!.slothProfile.lastSiteVisit).getTime() > Date.now() - 24 * 60 * 60 * 1000
        : false;

      // Get active boosts
      const boosts = user!.slothProfile?.activeBoosts || [];
      const boostMultipliers = boosts.map(b => b.multiplier);

      // Calculate current streak
      const currentStreak = user!.slothProfile!.restakeStreak;
      const newStreak = didRestake ? currentStreak + 1 : 0;

      // Calculate daily distance (score)
      const dailyDistance = calculateDailyDistance(
        delegationCore,
        didRestake,
        siteVisited,
        boostMultipliers,
        currentStreak
      );

      // Convert to BigInt for storage (store as meters * 1000 for precision)
      const dailyScoreBigInt = BigInt(Math.round(dailyDistance * 1000));
      const netChangeBigInt = BigInt(Math.round(netChangeCore * 1_000_000));
      const delegationAmountBigInt = BigInt(amount);

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
          delegationAmount: delegationAmountBigInt,
          netChange: netChangeBigInt,
          restakeActive: didRestake,
          undelegated: false,
          siteVisited,
          dailyScore: dailyScoreBigInt,
        },
        update: {
          delegationAmount: delegationAmountBigInt,
          netChange: netChangeBigInt,
          restakeActive: didRestake,
          undelegated: false,
          siteVisited,
          dailyScore: dailyScoreBigInt,
        },
      });

      // Update profile
      const currentScore = user!.slothProfile!.totalScore;
      const newTotalScore = currentScore + dailyScoreBigInt;

      // Store delegation score as meters (not ucore)
      const delegationScoreBigInt = BigInt(
        Math.round(Math.min(delegationCore, SCORING.DELEGATION_CAP) * 1000)
      );

      await prisma.slothProfile.update({
        where: { id: user!.slothProfile!.id },
        data: {
          totalScore: newTotalScore,
          delegationScore: delegationScoreBigInt,
          restakeStreak: newStreak,
          daysAwake: { increment: 1 },
          isSleeping: false,
          sleepUntil: null,
        },
      });

      // Assign class to NEW users only (mid-season joiners)
      if (isNewUser) {
        await assignClassToNewUser(user!.slothProfile!.id, newTotalScore);
      }

      processed++;
    }

    // Only recalculate ALL classes at season start (when explicitly requested)
    if (recalculateClasses) {
      console.log('[Snapshot] Recalculating all classes (season start)...');
      await updateSlothClasses();
    }

    // Handle sleeping sloths (undelegated)
    await handleSleepingSloths(delegations.map(d => d.address), snapshotDay);

    console.log(`[Snapshot] Complete. Processed: ${processed}, New: ${newUsers}, Restakes: ${restakeCount}`);

    return NextResponse.json({
      success: true,
      processed,
      newUsers,
      restakeCount,
      classesRecalculated: recalculateClasses,
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

// Assign class to a new user joining mid-season based on their score vs existing participants
async function assignClassToNewUser(profileId: string, totalScore: bigint) {
  // Count how many profiles have higher scores
  const higherCount = await prisma.slothProfile.count({
    where: { totalScore: { gt: totalScore } },
  });
  
  const totalCount = await prisma.slothProfile.count();
  
  if (totalCount === 0) {
    return;
  }
  
  // Calculate percentile position
  const percentile = (higherCount / totalCount) * 100;
  
  // Assign class based on where they fall
  let newClass: 'BABY' | 'TEEN' | 'ADULT';
  if (percentile < 33.33) {
    newClass = 'ADULT'; // Top 33%
  } else if (percentile < 66.66) {
    newClass = 'TEEN'; // Middle 33%
  } else {
    newClass = 'BABY'; // Bottom 33%
  }
  
  await prisma.slothProfile.update({
    where: { id: profileId },
    data: { class: newClass },
  });
}

// Recalculate ALL classes - only run at season start
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
      // Put sloth to sleep - reset streak
      await prisma.slothProfile.update({
        where: { id: profile.id },
        data: {
          isSleeping: true,
          sleepUntil: new Date(Date.now() + sleepDuration),
          restakeStreak: 0, // Reset streak when going to sleep
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
          restakeActive: false,
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
