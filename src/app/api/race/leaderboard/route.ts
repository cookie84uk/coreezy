import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SlothClass } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const page = parseInt(searchParams.get('page') || '1');
  const classFilter = searchParams.get('class') as SlothClass | null;
  const searchQuery = searchParams.get('search')?.toLowerCase();

  try {
    // If searching, find the specific wallet
    if (searchQuery && searchQuery.length >= 3) {
      // Search by partial wallet address (start, end, or full)
      const matchingUsers = await prisma.user.findMany({
        where: {
          OR: [
            { walletAddress: { startsWith: searchQuery, mode: 'insensitive' } },
            { walletAddress: { endsWith: searchQuery, mode: 'insensitive' } },
            { walletAddress: { contains: searchQuery, mode: 'insensitive' } },
          ],
        },
        include: {
          slothProfile: {
            include: {
              activeBoosts: { where: { expiresAt: { gt: new Date() } } },
            },
          },
        },
        take: 5,
      });

      // Also search by name
      const matchingByName = await prisma.slothProfile.findMany({
        where: {
          name: { contains: searchQuery, mode: 'insensitive' },
        },
        include: {
          user: { select: { walletAddress: true } },
          activeBoosts: { where: { expiresAt: { gt: new Date() } } },
        },
        take: 5,
      });

      // Combine and dedupe results
      const allProfiles = [
        ...matchingUsers.filter(u => u.slothProfile).map(u => ({
          ...u.slothProfile!,
          user: { walletAddress: u.walletAddress },
        })),
        ...matchingByName,
      ];

      // Dedupe by address
      const seen = new Set<string>();
      const uniqueProfiles = allProfiles.filter(p => {
        if (seen.has(p.user.walletAddress)) return false;
        seen.add(p.user.walletAddress);
        return true;
      });

      // Get ranks for found profiles
      const leaderboard = await Promise.all(
        uniqueProfiles.map(async (p) => {
          const rank = await prisma.slothProfile.count({
            where: { totalScore: { gt: p.totalScore } },
          });
          return {
            rank: rank + 1,
            address: p.user.walletAddress,
            shortAddress: `${p.user.walletAddress.slice(0, 8)}...${p.user.walletAddress.slice(-6)}`,
            name: p.name,
            class: p.class,
            score: p.totalScore.toString(),
            restakeStreak: p.restakeStreak,
            daysAwake: p.daysAwake,
            isSleeping: p.isSleeping,
            hasBoosts: p.activeBoosts.length > 0,
            boostCount: p.activeBoosts.length,
          };
        })
      );

      return NextResponse.json({
        leaderboard: leaderboard.sort((a, b) => a.rank - b.rank),
        pagination: { page: 1, limit: 5, total: leaderboard.length, pages: 1 },
        classDistribution: await getClassDistribution(),
        isSearch: true,
      });
    }

    const where = classFilter ? { class: classFilter } : {};

    const [profiles, total] = await Promise.all([
      prisma.slothProfile.findMany({
        where,
        orderBy: { totalScore: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          user: { select: { walletAddress: true } },
          activeBoosts: {
            where: { expiresAt: { gt: new Date() } },
          },
        },
      }),
      prisma.slothProfile.count({ where }),
    ]);

    const leaderboard = profiles.map((p, i) => ({
      rank: (page - 1) * limit + i + 1,
      address: p.user.walletAddress,
      shortAddress: `${p.user.walletAddress.slice(0, 8)}...${p.user.walletAddress.slice(-6)}`,
      name: p.name,
      class: p.class,
      score: p.totalScore.toString(),
      restakeStreak: p.restakeStreak,
      daysAwake: p.daysAwake,
      isSleeping: p.isSleeping,
      hasBoosts: p.activeBoosts.length > 0,
      boostCount: p.activeBoosts.length,
    }));

    return NextResponse.json({
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      classDistribution: await getClassDistribution(),
    });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getClassDistribution() {
  try {
    const [baby, teen, adult] = await Promise.all([
      prisma.slothProfile.count({ where: { class: 'BABY' } }),
      prisma.slothProfile.count({ where: { class: 'TEEN' } }),
      prisma.slothProfile.count({ where: { class: 'ADULT' } }),
    ]);

    return { baby, teen, adult, total: baby + teen + adult };
  } catch {
    return { baby: 0, teen: 0, adult: 0, total: 0 };
  }
}
