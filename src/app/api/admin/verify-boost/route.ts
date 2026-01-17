import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'twitter-api45.p.rapidapi.com';

// Boost requirements per platform
const BOOST_CONFIG: Record<string, { multiplier: number; durationDays: number; minEngagements: number }> = {
  'X': { multiplier: 5, durationDays: 7, minEngagements: 10 },
  'Twitter': { multiplier: 5, durationDays: 7, minEngagements: 10 },
  'YouTube': { multiplier: 10, durationDays: 14, minEngagements: 100 },
  'TikTok': { multiplier: 7, durationDays: 7, minEngagements: 500 },
  'Article': { multiplier: 15, durationDays: 30, minEngagements: 0 }, // Manual review
  'Blog': { multiplier: 15, durationDays: 30, minEngagements: 0 },
};

// Extract tweet ID from various URL formats
function extractTweetId(url: string): string | null {
  const patterns = [
    /twitter\.com\/\w+\/status\/(\d+)/,
    /x\.com\/\w+\/status\/(\d+)/,
    /\/status\/(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch tweet engagement from RapidAPI
async function fetchTweetEngagement(tweetId: string): Promise<{
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  text: string;
} | null> {
  if (!RAPIDAPI_KEY) {
    console.error('RAPIDAPI_KEY not configured');
    return null;
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/tweet.php?id=${tweetId}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST,
        },
      }
    );

    if (!response.ok) {
      console.error('RapidAPI error:', response.status);
      return null;
    }

    const data = await response.json();
    
    return {
      likes: data.favorites || data.favorite_count || 0,
      retweets: data.retweets || data.retweet_count || 0,
      replies: data.replies || data.reply_count || 0,
      views: data.views || data.view_count || 0,
      text: data.text || '',
    };
  } catch (error) {
    console.error('Failed to fetch tweet:', error);
    return null;
  }
}

// Check if tweet mentions @CoreezyVibes and has #Coreezy
function validateTweetContent(text: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (!text.toLowerCase().includes('@coreezyvibes')) {
    issues.push('Missing @CoreezyVibes mention');
  }
  
  if (!text.toLowerCase().includes('#coreezy')) {
    issues.push('Missing #Coreezy hashtag');
  }
  
  return { valid: issues.length === 0, issues };
}

export async function POST(request: NextRequest) {
  // Verify admin secret
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { boostRequestId } = await request.json();

    if (!boostRequestId) {
      return NextResponse.json({ error: 'boostRequestId required' }, { status: 400 });
    }

    // Fetch the boost request
    const boostRequest = await prisma.boostRequest.findUnique({
      where: { id: boostRequestId },
      include: { user: { include: { slothProfile: true } } },
    });

    if (!boostRequest) {
      return NextResponse.json({ error: 'Boost request not found' }, { status: 404 });
    }

    if (boostRequest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Boost request already processed' }, { status: 400 });
    }

    const platform = boostRequest.platform.toUpperCase();
    const config = BOOST_CONFIG[platform] || BOOST_CONFIG['X'];

    // For Twitter/X, auto-verify
    if (platform === 'X' || platform === 'TWITTER') {
      const tweetId = extractTweetId(boostRequest.proofUrl);
      
      if (!tweetId) {
        await prisma.boostRequest.update({
          where: { id: boostRequestId },
          data: {
            status: 'REJECTED',
            reviewedAt: new Date(),
            rejectReason: 'Invalid tweet URL',
          },
        });
        return NextResponse.json({ success: false, reason: 'Invalid tweet URL' });
      }

      const engagement = await fetchTweetEngagement(tweetId);
      
      if (!engagement) {
        return NextResponse.json({ 
          success: false, 
          reason: 'Could not fetch tweet data. Will retry later.',
          needsManualReview: true,
        });
      }

      // Validate content
      const contentCheck = validateTweetContent(engagement.text);
      if (!contentCheck.valid) {
        await prisma.boostRequest.update({
          where: { id: boostRequestId },
          data: {
            status: 'REJECTED',
            reviewedAt: new Date(),
            rejectReason: contentCheck.issues.join(', '),
          },
        });
        return NextResponse.json({ success: false, reason: contentCheck.issues.join(', ') });
      }

      // Check engagement threshold
      const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
      
      if (totalEngagement < config.minEngagements) {
        return NextResponse.json({ 
          success: false, 
          reason: `Not enough engagement yet (${totalEngagement}/${config.minEngagements}). Will check again later.`,
          currentEngagement: totalEngagement,
          required: config.minEngagements,
          needsMoreTime: true,
        });
      }

      // All checks passed - approve!
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + config.durationDays);

      // Create the boost
      if (boostRequest.user.slothProfile) {
        await prisma.boost.create({
          data: {
            profileId: boostRequest.user.slothProfile.id,
            platform: boostRequest.platform,
            multiplier: config.multiplier,
            expiresAt,
            proofUrl: boostRequest.proofUrl,
            approvedAt: new Date(),
          },
        });
      }

      // Update request status
      await prisma.boostRequest.update({
        where: { id: boostRequestId },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          reviewedBy: 'auto-verification',
        },
      });

      return NextResponse.json({
        success: true,
        boost: {
          multiplier: config.multiplier,
          duration: config.durationDays,
          expiresAt,
        },
        engagement: {
          likes: engagement.likes,
          retweets: engagement.retweets,
          replies: engagement.replies,
          total: totalEngagement,
        },
      });
    }

    // For other platforms, mark for manual review
    return NextResponse.json({
      success: false,
      reason: 'Platform requires manual review',
      needsManualReview: true,
    });
  } catch (error) {
    console.error('Boost verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}

// GET endpoint to check pending boosts and auto-verify
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all pending Twitter/X boost requests
    const pendingRequests = await prisma.boostRequest.findMany({
      where: {
        status: 'PENDING',
        platform: { in: ['X', 'Twitter', 'x', 'twitter'] },
      },
      include: { user: { include: { slothProfile: true } } },
      take: 10, // Process 10 at a time to limit API calls
    });

    const results = [];

    for (const req of pendingRequests) {
      const tweetId = extractTweetId(req.proofUrl);
      if (!tweetId) continue;

      const engagement = await fetchTweetEngagement(tweetId);
      if (!engagement) continue;

      const config = BOOST_CONFIG['X'];
      const totalEngagement = engagement.likes + engagement.retweets + engagement.replies;
      const contentCheck = validateTweetContent(engagement.text);

      results.push({
        id: req.id,
        url: req.proofUrl,
        engagement: totalEngagement,
        meetsThreshold: totalEngagement >= config.minEngagements,
        contentValid: contentCheck.valid,
        issues: contentCheck.issues,
      });
    }

    return NextResponse.json({
      pending: pendingRequests.length,
      checked: results.length,
      results,
    });
  } catch (error) {
    console.error('Batch verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
