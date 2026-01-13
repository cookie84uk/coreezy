import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { slothProfile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address,
          slothProfile: { create: {} },
        },
        include: { slothProfile: true },
      });
    }

    // Update last site visit
    if (user.slothProfile) {
      await prisma.slothProfile.update({
        where: { id: user.slothProfile.id },
        data: { lastSiteVisit: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record site visit:', error);
    // Don't fail silently - still return success to not block wallet connection
    return NextResponse.json({ success: true });
  }
}
