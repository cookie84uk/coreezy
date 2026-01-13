import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const boostRequestSchema = z.object({
  address: z.string().min(1),
  platform: z.enum(['twitter', 'youtube', 'tiktok', 'article', 'other']),
  proofUrl: z.string().url('Invalid URL'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = boostRequestSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: data.address },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Wallet not registered. Please connect and delegate first.' },
        { status: 400 }
      );
    }

    // Check for existing pending request on same platform
    const existingRequest = await prisma.boostRequest.findFirst({
      where: {
        userId: user.id,
        platform: data.platform,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending request for this platform.' },
        { status: 400 }
      );
    }

    // Check for recent approved boost on same platform (within 30 days)
    const recentBoost = await prisma.boostRequest.findFirst({
      where: {
        userId: user.id,
        platform: data.platform,
        status: 'APPROVED',
        reviewedAt: {
          gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (recentBoost) {
      return NextResponse.json(
        { error: 'You can only submit one boost per platform per month.' },
        { status: 400 }
      );
    }

    // Create boost request
    const boostRequest = await prisma.boostRequest.create({
      data: {
        userId: user.id,
        platform: data.platform,
        proofUrl: data.proofUrl,
      },
    });

    return NextResponse.json({
      success: true,
      id: boostRequest.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Failed to create boost request:', error);
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    );
  }
}
