import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch distribution history from database
    const distributions = await prisma.vaultDistribution.findMany({
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      distributions: distributions.map((d) => ({
        date: d.timestamp,
        totalAmount: (Number(d.totalAmount) / 1_000_000).toFixed(2),
        perNft: (Number(d.nftRewardAmount) / 100 / 1_000_000).toFixed(2), // Divide by 100 NFTs
        reStaked: (Number(d.reinvestAmount) / 1_000_000).toFixed(2),
        toTreasury: (Number(d.marketingAmount) / 1_000_000).toFixed(2),
        txHash: d.txHash,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch distributions:', error);
    // Return empty array if no database connection yet
    return NextResponse.json({ distributions: [] });
  }
}
