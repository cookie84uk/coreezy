import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

/**
 * POST /api/admin/set-staking-date
 * 
 * Set the staking start date for a user's profile
 * 
 * Body:
 * - address: wallet address
 * - stakingSince: ISO date string (e.g. "2024-06-15")
 * 
 * OR for bulk update:
 * - updates: [{ address, stakingSince }, ...]
 */
export async function POST(request: NextRequest) {
  // Check admin auth
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Handle bulk updates
    if (body.updates && Array.isArray(body.updates)) {
      const results: Record<string, string> = {};
      
      for (const update of body.updates) {
        const { address, stakingSince } = update;
        if (!address || !stakingSince) continue;
        
        const user = await prisma.user.findUnique({
          where: { walletAddress: address },
          include: { slothProfile: true },
        });
        
        if (user?.slothProfile) {
          await prisma.slothProfile.update({
            where: { id: user.slothProfile.id },
            data: { stakingSince: new Date(stakingSince) },
          });
          results[address] = 'updated';
        } else {
          results[address] = 'not found';
        }
      }
      
      return NextResponse.json({ success: true, results });
    }
    
    // Handle single update
    const { address, stakingSince } = body;
    
    if (!address || !stakingSince) {
      return NextResponse.json(
        { error: 'Missing address or stakingSince' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { slothProfile: true },
    });

    if (!user || !user.slothProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    await prisma.slothProfile.update({
      where: { id: user.slothProfile.id },
      data: { stakingSince: new Date(stakingSince) },
    });

    return NextResponse.json({
      success: true,
      address,
      stakingSince: new Date(stakingSince).toISOString(),
    });
  } catch (error) {
    console.error('[Admin] Set staking date error:', error);
    return NextResponse.json(
      { error: 'Failed to set staking date' },
      { status: 500 }
    );
  }
}
