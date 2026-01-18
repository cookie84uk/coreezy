import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RACE_CONFIG, calculateClassPool, getDaysRemaining, isSeasonActive } from '@/lib/race-config';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const COREEZY_VALIDATOR = process.env.COREEZY_VALIDATOR || 'corevaloper1uxengudkvpu5feqfqs4ant2hvukvf9ahxk63gh';
const COREUM_REST = process.env.COREUM_REST || 'https://full-node.mainnet-1.coreum.dev:1317';

// Fetch validator commission from chain
async function fetchValidatorCommission(): Promise<{
  totalCommission: number;
  commissionRate: number;
} | null> {
  try {
    // Fetch validator info to get commission rate
    const validatorResponse = await fetch(
      `${COREUM_REST}/cosmos/staking/v1beta1/validators/${COREEZY_VALIDATOR}`
    );
    
    if (!validatorResponse.ok) return null;
    
    const validatorData = await validatorResponse.json();
    const commissionRate = parseFloat(validatorData.validator?.commission?.commission_rates?.rate || '0');
    
    // Fetch validator rewards/commission
    const rewardsResponse = await fetch(
      `${COREUM_REST}/cosmos/distribution/v1beta1/validators/${COREEZY_VALIDATOR}/commission`
    );
    
    if (!rewardsResponse.ok) return null;
    
    const rewardsData = await rewardsResponse.json();
    const commissionCoins = rewardsData.commission?.commission || [];
    
    // Find CORE (ucore) commission
    const coreCommission = commissionCoins.find((c: { denom: string }) => c.denom === 'ucore');
    const totalCommissionUcore = coreCommission ? parseFloat(coreCommission.amount) : 0;
    const totalCommission = totalCommissionUcore / 1_000_000; // Convert to CORE
    
    return {
      totalCommission,
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
    // Try to get manually set pool first
    const poolConfig = await prisma.systemConfig.findUnique({
      where: { key: 'prize_pool_core' },
    });
    
    // Fetch live validator commission
    const commissionData = await fetchValidatorCommission();
    
    // Calculate prize pool:
    // - If manually set, use that
    // - Otherwise, calculate as 1% of accumulated commission this quarter
    let totalPool = poolConfig ? parseFloat(poolConfig.value) : 0;
    
    // Get quarter start date
    const now = new Date();
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
    
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
        total: totalPool,
        distribution: RACE_CONFIG.prizeDistribution,
        commissionPercent: RACE_CONFIG.commissionToPool,
      },
      
      // Include validator commission data for transparency
      validator: commissionData ? {
        currentCommission: commissionData.totalCommission,
        commissionRate: (commissionData.commissionRate * 100).toFixed(1) + '%',
        prizePoolContribution: RACE_CONFIG.commissionToPool + '% of commission',
      } : null,

      classes: {
        adult: {
          pool: adultPool,
          percent: RACE_CONFIG.prizeDistribution.adult,
          participants: adultCount,
          perParticipant: adultPerParticipant,
        },
        teen: {
          pool: teenPool,
          percent: RACE_CONFIG.prizeDistribution.teen,
          participants: teenCount,
          perParticipant: teenPerParticipant,
        },
        baby: {
          pool: babyPool,
          percent: RACE_CONFIG.prizeDistribution.baby,
          participants: babyCount,
          perParticipant: babyPerParticipant,
        },
      },

      totalParticipants,
    });
  } catch (error) {
    console.error('Failed to fetch prize pool:', error);
    return NextResponse.json({ error: 'Failed to fetch prize pool' }, { status: 500 });
  }
}

// POST - Update prize pool (admin only)
// Can be called after each commission claim to add 1% to the pool
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { totalPool, addAmount, addFromCommission } = body;

    let newTotal: number;

    if (addFromCommission) {
      // Fetch current commission and add 1% of it
      const commissionData = await fetchValidatorCommission();
      if (!commissionData) {
        return NextResponse.json({ error: 'Could not fetch commission data' }, { status: 500 });
      }
      
      const contribution = (commissionData.totalCommission * RACE_CONFIG.commissionToPool) / 100;
      
      const existing = await prisma.systemConfig.findUnique({
        where: { key: 'prize_pool_core' },
      });
      const currentPool = existing ? parseFloat(existing.value) : 0;
      newTotal = currentPool + contribution;
      
      // Log this contribution
      console.log(`[Prize Pool] Added ${contribution.toFixed(2)} CORE (1% of ${commissionData.totalCommission.toFixed(2)} commission)`);
    } else if (addAmount !== undefined) {
      // Add specific amount to existing pool
      const existing = await prisma.systemConfig.findUnique({
        where: { key: 'prize_pool_core' },
      });
      const currentPool = existing ? parseFloat(existing.value) : 0;
      newTotal = currentPool + parseFloat(addAmount);
    } else if (totalPool !== undefined) {
      // Set exact total
      newTotal = parseFloat(totalPool);
    } else {
      return NextResponse.json({ 
        error: 'Provide totalPool, addAmount, or addFromCommission: true' 
      }, { status: 400 });
    }

    // Upsert the prize pool
    await prisma.systemConfig.upsert({
      where: { key: 'prize_pool_core' },
      create: { key: 'prize_pool_core', value: newTotal.toString() },
      update: { value: newTotal.toString() },
    });

    // Log the update
    await prisma.systemConfig.upsert({
      where: { key: 'prize_pool_last_updated' },
      create: { key: 'prize_pool_last_updated', value: new Date().toISOString() },
      update: { value: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      newTotal,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update prize pool:', error);
    return NextResponse.json({ error: 'Failed to update prize pool' }, { status: 500 });
  }
}
