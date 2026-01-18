import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSlothName, sanitizeName } from '@/lib/profanity-filter';

/**
 * POST /api/race/profile/name
 * 
 * Update sloth profile name
 * 
 * Body:
 * - address: wallet address
 * - name: new sloth name
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, name } = body;

    if (!address || !name) {
      return NextResponse.json(
        { error: 'Missing address or name' },
        { status: 400 }
      );
    }

    // Validate name
    const validation = validateSlothName(name);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitized = sanitizeName(name);

    // Check for uniqueness (case-insensitive)
    const existing = await prisma.slothProfile.findFirst({
      where: {
        name: {
          equals: sanitized,
          mode: 'insensitive',
        },
        user: {
          walletAddress: {
            not: address,
          },
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This name is already taken' },
        { status: 409 }
      );
    }

    // Find user's profile
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { slothProfile: true },
    });

    if (!user || !user.slothProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update name
    const updated = await prisma.slothProfile.update({
      where: { id: user.slothProfile.id },
      data: { name: sanitized },
    });

    return NextResponse.json({
      success: true,
      name: updated.name,
    });
  } catch (error) {
    console.error('[Profile] Name update error:', error);
    return NextResponse.json(
      { error: 'Failed to update name' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/race/profile/name?check=SomeName
 * 
 * Check if a name is available
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('check');

  if (!name) {
    return NextResponse.json(
      { error: 'Missing name parameter' },
      { status: 400 }
    );
  }

  // Validate
  const validation = validateSlothName(name);
  if (!validation.valid) {
    return NextResponse.json({
      available: false,
      error: validation.error,
    });
  }

  // Check uniqueness
  const sanitized = sanitizeName(name);
  const existing = await prisma.slothProfile.findFirst({
    where: {
      name: {
        equals: sanitized,
        mode: 'insensitive',
      },
    },
  });

  return NextResponse.json({
    available: !existing,
    error: existing ? 'This name is already taken' : undefined,
  });
}
