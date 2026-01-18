import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RACE_CONFIG, calculateClassPool, getDaysRemaining, isSeasonActive } from '@/lib/race-config';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';

// Fetch validator commission from chain
async function fetchValidatorCommission(): Promise<{
  pendingCommission: number;
  commissionRate: number;
} | null> {
  try {
    // Fetch validator info to get commission rate
    const validatorResponse = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}`,
      { next: { revalidate: 60 } } // Cache for 1 minute
    );
    
    if (!validatorResponse.ok) return null;
    
    const validatorData = await validatorResponse.json();
    const commissionRate = parseFloat(validatorData.validator?.commission?.commission_rates?.rate || '0');
    
    // Fetch validator rewards/commission
    const rewardsResponse = await fetch(
      `${COREUM_REST}/cosmos/distribution/v1beta1/validators/${COREEZY_VALIDATOR}/commission`,
      { next: { revalidate: 60 } }
    );
    
    if (!rewardsResponse.ok) return null;
    
    const rewardsData = await rewardsResponse.json();
    const commissionCoins = rewardsData.commission?.commission || [];
    
    // Find CORE (ucore) commission
    const coreCommission = commissionCoins.find((c: { denom: string }) => c.denom === 'ucore');
    const pendingCommissionUcore = coreCommission ? parseFloat(coreCommission.amount) : 0;
    const pendingCommission = pendingCommissionUcore / 1_000_000; // Convert to CORE
    
    return {
      pendingCommission,
      commissionRate,
    };
  } catch (error) {
    console.error('Failed to fetch validator commission:', error);
    return null;
  }
}

// GET - Fetch current prize pool data
export async function GET() {
  try {
    // Get accumulated pool from previous commission claims
    const accumulatedConfig = await prisma.systemConfig.findUnique({
      where: { key: 'prize_pool_accumulated' },
    });
    const accumulatedPool = accumulatedConfig ? parseFloat(accumulatedConfig.value) : 0;
    
    // Fetch LIVE validator commission
    const commissionData = await fetchValidatorCommission();
    
    // Calculate prize pool:
    // = Accumulated (from past claims) + 1% of current pending commission
    const pendingCommission = commissionData?.pendingCommission || 0;
    const pendingContribution = (pendingCommission * RACE_CONFIG.commissionToPool) / 100;
    
    // Total prize pool = accumulated + pending contribution
    const totalPool = accumulatedPool + pendingContribution;
    
    // Get class distribution counts
    const [adultCount, teenCount, babyCount] = await Promise.all([
      prisma.slothProfile.count({ where: { class: 'ADULT' } }),
      prisma.slothProfile.count({ where: { class: 'TEEN' } }),
      prisma.slothProfile.count({ where: { class: 'BABY' } }),
    ]);

    const totalParticipants = adultCount + teenCount + babyCount;

    // Calculate pools per class
    const adultPool = calculateClassPool(totalPool, 'adult');
    const teenPool = calculateClassPool(totalPool, 'teen');
    const babyPool = calculateClassPool(totalPool, 'baby');

    // Calculate per-participant estimates
    const adultPerParticipant = adultCount > 0 ? adultPool / adultCount : 0;
    const teenPerParticipant = teenCount > 0 ? teenPool / teenCount : 0;
    const babyPerParticipant = babyCount > 0 ? babyPool / babyCount : 0;

    return NextResponse.json({
      season: RACE_CONFIG.season,
      isActive: isSeasonActive(),
      daysRemaining: getDaysRemaining(),
      
      pool: {
        total: parseFloat(totalPool.toFixed(2)),
        accumulated: parseFloat(accumulatedPool.toFixed(2)),
        pendingContribution: parseFloat(pendingContribution.toFixed(2)),
        distribution: RACE_CONFIG.prizeDistribution,
        commissionPercent: RACE_CONFIG.commissionToPool,
      },
      
      // Include validator commission data for transparency
      validator: commissionData ? {
        pendingCommission: parseFloat(pendingCommission.toFixed(2)),
        commissionRate: (commissionData.commissionRate * 100).toFixed(1) + '%',
        prizePoolContribution: `${RACE_CONFIG.commissionToPool}% = ${pendingContribution.toFixed(2)} CORE`,
      } : null,

      classes: {
        adult: {
          pool: parseFloat(adultPool.toFixed(2)),
          percent: RACE_CONFIG.prizeDistribution.adult,
          participants: adultCount,
          perParticipant: parseFloat(adultPerParticipant.toFixed(2)),
        },
        teen: {
          pool: parseFloat(teenPool.toFixed(2)),
          percent: RACE_CONFIG.prizeDistribution.teen,
          participants: teenCount,
          perParticipant: parseFloat(teenPerParticipant.toFixed(2)),
        },
        baby: {
          pool: parseFloat(babyPool.toFixed(2)),
          percent: RACE_CONFIG.prizeDistribution.baby,
          participants: babyCount,
          perParticipant: parseFloat(babyPerParticipant.toFixed(2)),
        },
      },

      totalParticipants,
    });
  } catch (error) {
    console.error('Failed to fetch prize pool:', error);
    return NextResponse.json({ error: 'Failed to fetch prize pool' }, { status: 500 });
  }
}

// POST - Add to accumulated prize pool (admin only)
// Call this AFTER claiming commission: pass the amount you claimed
// It will add 1% of that to the accumulated pool
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { claimedAmount, setAccumulated, resetPool } = body;

    // Get current accumulated
    const existing = await prisma.systemConfig.findUnique({
      where: { key: 'prize_pool_accumulated' },
    });
    let currentAccumulated = existing ? parseFloat(existing.value) : 0;

    let newAccumulated: number;
    let contribution = 0;

    if (resetPool) {
      // Reset the pool (usually at end of season)
      newAccumulated = 0;
    } else if (setAccumulated !== undefined) {
      // Set exact accumulated amount
      newAccumulated = parseFloat(setAccumulated);
    } else if (claimedAmount !== undefined) {
      // Add 1% of claimed commission to accumulated
      contribution = (parseFloat(claimedAmount) * RACE_CONFIG.commissionToPool) / 100;
      newAccumulated = currentAccumulated + contribution;
    } else {
      return NextResponse.json({ 
        error: 'Provide claimedAmount (CORE you just claimed), setAccumulated, or resetPool: true' 
      }, { status: 400 });
    }

    // Upsert the accumulated pool
    await prisma.systemConfig.upsert({
      where: { key: 'prize_pool_accumulated' },
      create: { key: 'prize_pool_accumulated', value: newAccumulated.toString() },
      update: { value: newAccumulated.toString() },
    });

    // Log the update
    await prisma.systemConfig.upsert({
      where: { key: 'prize_pool_last_updated' },
      create: { key: 'prize_pool_last_updated', value: new Date().toISOString() },
      update: { value: new Date().toISOString() },
    });

    // Also log to JobLog for history
    await prisma.jobLog.create({
      data: {
        jobName: 'prize_pool_update',
        status: 'success',
        completedAt: new Date(),
        metadata: {
          previousAccumulated: currentAccumulated,
          newAccumulated,
          contribution,
          claimedAmount: claimedAmount || null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      accumulated: parseFloat(newAccumulated.toFixed(2)),
      contribution: parseFloat(contribution.toFixed(2)),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update prize pool:', error);
    return NextResponse.json({ error: 'Failed to update prize pool' }, { status: 500 });
  }
}
