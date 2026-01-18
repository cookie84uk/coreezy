/**
 * Social Media Verification & Tracking System
 * 
 * Flow:
 * 1. User clicks "Link X Account"
 * 2. They post a verification tweet with their wallet address
 * 3. We verify ownership via RapidAPI
 * 4. X handle is linked to their profile
 * 5. Future posts are auto-tracked for boosts
 */

// Verification tweet format
export const VERIFICATION_TWEET_TEMPLATE = (address: string) => 
  `Verifying my @CoreezyVibes Sloth Race profile 🦥

Wallet: ${address.slice(0, 12)}...${address.slice(-6)}

#CoreezyVerify`;

// Generate verification intent URL
export function generateVerificationIntent(address: string): string {
  const text = VERIFICATION_TWEET_TEMPLATE(address);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

// Extract wallet snippet from tweet for verification
export function extractWalletFromTweet(tweetText: string): string | null {
  // Match pattern: core1xxx...xxxxxx
  const match = tweetText.match(/core1[a-z0-9]{6}\.{3}[a-z0-9]{6}/i);
  return match ? match[0] : null;
}

// Check if wallet snippet matches full address
export function verifyWalletMatch(snippet: string, fullAddress: string): boolean {
  const prefix = snippet.split('...')[0];
  const suffix = snippet.split('...')[1];
  return fullAddress.startsWith(prefix) && fullAddress.endsWith(suffix);
}

// RapidAPI Twitter endpoints config
export const RAPIDAPI_CONFIG = {
  host: 'twitter-api45.p.rapidapi.com',
  endpoints: {
    userTweets: '/user-tweets.php',
    searchTweets: '/search.php',
    userInfo: '/screenname.php',
  },
};

// Search for Coreezy mentions by a user
export interface TwitterSearchResult {
  tweets: Array<{
    id: string;
    text: string;
    created_at: string;
    metrics: {
      likes: number;
      retweets: number;
      replies: number;
    };
  }>;
}

// Boost eligibility check result
export interface BoostEligibility {
  eligible: boolean;
  reason?: string;
  tweet?: {
    id: string;
    text: string;
    engagement: number;
  };
}

// Minimum engagement thresholds
export const ENGAGEMENT_THRESHOLDS = {
  twitter: 10, // 10 total engagements (likes + retweets + replies)
  youtube: 100, // 100 views
  tiktok: 500, // 500 views
};

// Boost durations in days
export const BOOST_DURATIONS = {
  twitter: 7,
  youtube: 14,
  tiktok: 7,
  article: 30,
};

// Boost multipliers (percentage)
export const BOOST_MULTIPLIERS = {
  twitter: 5,
  youtube: 10,
  tiktok: 7,
  article: 15,
};
