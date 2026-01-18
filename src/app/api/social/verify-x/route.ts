import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  verifyWalletMatch, 
  RAPIDAPI_CONFIG,
  ENGAGEMENT_THRESHOLDS,
  BOOST_DURATIONS,
  BOOST_MULTIPLIERS 
} from '@/lib/social-verification';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/**
 * POST /api/social/verify-x
 * 
 * Verify X account ownership and optionally check for boost-eligible posts
 * 
 * Body:
 * - address: wallet address
 * - xHandle: X/Twitter username (without @)
 * - action: 'link' | 'check-boost'
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, xHandle, action = 'link' } = body;

    if (!address || !xHandle) {
      return NextResponse.json(
        { error: 'Missing address or xHandle' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { slothProfile: true },
    });

    if (!user || !user.slothProfile) {
      return NextResponse.json(
        { error: 'User not found. Connect wallet first.' },
        { status: 404 }
      );
    }

    // Check if RapidAPI key is configured
    if (!RAPIDAPI_KEY) {
      // Fallback to manual verification
      return NextResponse.json({
        success: false,
        manual: true,
        message: 'Auto-verification not available. Submit your post link for manual review.',
        verificationUrl: generateVerificationUrl(address),
      });
    }

    if (action === 'link') {
      // Verify X account ownership
      return await verifyAccountOwnership(user.id, user.slothProfile.id, address, xHandle);
    } else if (action === 'check-boost') {
      // Check for boost-eligible posts
      return await checkForBoostPosts(user.slothProfile.id, xHandle);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[Social] Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// Verify X account ownership by checking for verification tweet
async function verifyAccountOwnership(
  userId: string,
  profileId: string,
  walletAddress: string,
  xHandle: string
) {
  try {
    // Fetch recent tweets from the user
    const response = await fetch(
      `https://${RAPIDAPI_CONFIG.host}${RAPIDAPI_CONFIG.endpoints.userTweets}?screenname=${xHandle}&count=20`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY!,
          'X-RapidAPI-Host': RAPIDAPI_CONFIG.host,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const data = await response.json();
    const tweets = data.timeline || [];

    // Look for verification tweet
    for (const tweet of tweets) {
      const text = tweet.text || '';
      
      // Check if it's a verification tweet
      if (text.includes('#CoreezyVerify') && text.includes('@CoreezyVibes')) {
        // Extract and verify wallet snippet
        const walletSnippet = `${walletAddress.slice(0, 12)}...${walletAddress.slice(-6)}`;
        
        if (text.includes(walletSnippet)) {
          // Verified! Update profile with X handle
          await prisma.slothProfile.update({
            where: { id: profileId },
            data: { name: `@${xHandle}` }, // Use X handle as display name
          });

          // Store X handle in system config for this user
          await prisma.systemConfig.upsert({
            where: { key: `x_handle_${userId}` },
            create: { key: `x_handle_${userId}`, value: xHandle },
            update: { value: xHandle },
          });

          return NextResponse.json({
            success: true,
            verified: true,
            xHandle,
            message: 'X account verified and linked!',
          });
        }
      }
    }

    // Verification tweet not found
    return NextResponse.json({
      success: false,
      verified: false,
      message: 'Verification tweet not found. Please post the verification tweet and try again.',
      verificationUrl: generateVerificationUrl(walletAddress),
    });
  } catch (error) {
    console.error('[Social] X verification error:', error);
    return NextResponse.json({
      success: false,
      manual: true,
      message: 'Auto-verification failed. Submit for manual review.',
      verificationUrl: generateVerificationUrl(walletAddress),
    });
  }
}

// Check for Coreezy mentions that qualify for boosts
async function checkForBoostPosts(profileId: string, xHandle: string) {
  try {
    // Fetch recent tweets
    const response = await fetch(
      `https://${RAPIDAPI_CONFIG.host}${RAPIDAPI_CONFIG.endpoints.userTweets}?screenname=${xHandle}&count=50`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY!,
          'X-RapidAPI-Host': RAPIDAPI_CONFIG.host,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tweets');
    }

    const data = await response.json();
    const tweets = data.timeline || [];

    const eligiblePosts: Array<{
      id: string;
      text: string;
      engagement: number;
      url: string;
    }> = [];

    // Check each tweet for Coreezy mentions
    for (const tweet of tweets) {
      const text = (tweet.text || '').toLowerCase();
      
      // Skip verification tweets
      if (text.includes('#coreezyverify')) continue;
      
      // Check for Coreezy mentions
      if (
        text.includes('@coreezyvibes') ||
        text.includes('#coreezy') ||
        text.includes('coreezy')
      ) {
        const engagement = 
          (tweet.favorite_count || 0) + 
          (tweet.retweet_count || 0) + 
          (tweet.reply_count || 0);

        if (engagement >= ENGAGEMENT_THRESHOLDS.twitter) {
          eligiblePosts.push({
            id: tweet.tweet_id || tweet.id_str,
            text: tweet.text,
            engagement,
            url: `https://twitter.com/${xHandle}/status/${tweet.tweet_id || tweet.id_str}`,
          });
        }
      }
    }

    // Check if any eligible posts haven't been used for a boost yet
    const existingBoosts = await prisma.boost.findMany({
      where: { profileId },
      select: { proofUrl: true },
    });

    const usedUrls = new Set(existingBoosts.map(b => b.proofUrl));
    const newEligible = eligiblePosts.filter(p => !usedUrls.has(p.url));

    if (newEligible.length > 0) {
      // Auto-create boost for the best post
      const bestPost = newEligible.sort((a, b) => b.engagement - a.engagement)[0];
      
      const boost = await prisma.boost.create({
        data: {
          profileId,
          platform: 'X',
          multiplier: BOOST_MULTIPLIERS.twitter,
          expiresAt: new Date(Date.now() + BOOST_DURATIONS.twitter * 24 * 60 * 60 * 1000),
          proofUrl: bestPost.url,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        boostCreated: true,
        boost: {
          platform: 'X',
          multiplier: BOOST_MULTIPLIERS.twitter,
          expiresAt: boost.expiresAt,
          tweet: bestPost,
        },
        otherEligible: newEligible.length - 1,
      });
    }

    return NextResponse.json({
      success: true,
      boostCreated: false,
      message: eligiblePosts.length > 0 
        ? 'All eligible posts have already been used for boosts'
        : 'No posts with enough engagement found. Keep posting about Coreezy!',
      requirements: {
        minEngagement: ENGAGEMENT_THRESHOLDS.twitter,
        mustInclude: ['@CoreezyVibes', '#Coreezy', or 'Coreezy'],
      },
    });
  } catch (error) {
    console.error('[Social] Boost check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check for boosts. Try again later.',
    });
  }
}

// Generate verification tweet URL
function generateVerificationUrl(address: string): string {
  const text = `Verifying my @CoreezyVibes Sloth Race profile 🦥

Wallet: ${address.slice(0, 12)}...${address.slice(-6)}

#CoreezyVerify`;
  
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
