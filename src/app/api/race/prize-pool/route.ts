import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RACE_CONFIG, calculateClassPool, getDaysRemaining, isSeasonActive } from '@/lib/race-config';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

// GET - Fetch current prize pool data
export async function GET() {
  try {
    // Get prize pool from system config (or default to 0)
    const poolConfig = await prisma.systemConfig.findUnique({
      where: { key: 'prize_pool_core' },
    });

    const totalPool = poolConfig ? parseFloat(poolConfig.value) : 0;

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

    // Calculate per-participant estimates (if everyone in class gets equal share)
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
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { totalPool, addAmount } = await request.json();

    let newTotal: number;

    if (addAmount !== undefined) {
      // Add to existing pool
      const existing = await prisma.systemConfig.findUnique({
        where: { key: 'prize_pool_core' },
      });
      const currentPool = existing ? parseFloat(existing.value) : 0;
      newTotal = currentPool + parseFloat(addAmount);
    } else if (totalPool !== undefined) {
      // Set exact total
      newTotal = parseFloat(totalPool);
    } else {
      return NextResponse.json({ error: 'Provide totalPool or addAmount' }, { status: 400 });
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
