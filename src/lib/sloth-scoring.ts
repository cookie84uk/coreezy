/**
 * Sloth Race Scoring System
 * 
 * Scores are calculated as "distance traveled" using sloth speed metaphors:
 * - Base speed: 0.15 mph (average sloth crawl)
 * - Burst speed: 1.5 mph (escape danger)
 * 
 * Distance is measured in METERS for precision.
 * 
 * Daily distance = (delegation_weight) × (speed_multiplier) × (24 hours)
 */

// Sloth speeds in meters per hour
export const SLOTH_SPEEDS = {
  // Normal crawl: 0.15 mph = 241 meters per hour
  CRAWL: 241,
  // Active movement: 0.5 mph = 805 meters per hour  
  ACTIVE: 805,
  // Burst speed (restaking bonus): 1.5 mph = 2414 meters per hour
  BURST: 2414,
} as const;

// Scoring multipliers
export const SCORING = {
  // Base: 1 CORE staked = 1 meter traveled per day at crawl speed
  // At 241m/hr for 24hr = 5784m/day max
  // So 1 CORE = roughly 0.1 meter per day (scaled for readability)
  METERS_PER_CORE_PER_DAY: 0.1,
  
  // Delegation cap (50K CORE)
  DELEGATION_CAP: 50_000,
  
  // Multipliers
  RESTAKE_MULTIPLIER: 1.5, // 50% bonus for restaking (burst speed!)
  SITE_VISIT_MULTIPLIER: 1.05, // 5% bonus for visiting site
  
  // Social boost multipliers (applied additively)
  SOCIAL_BOOST: {
    TWITTER: 0.10, // +10%
    YOUTUBE: 0.10,
    TIKTOK: 0.05,
    ARTICLE: 0.15,
  },
  
  // Streak bonuses (compounding)
  STREAK_BONUS_PER_DAY: 0.02, // +2% per day of streak
  MAX_STREAK_BONUS: 0.20, // Cap at +20%
  
  // Restake threshold - must be > 0.5 CORE to count as restake
  RESTAKE_THRESHOLD_CORE: 0.5,
} as const;

/**
 * Calculate daily distance traveled
 * @param delegationCore - Delegation amount in CORE (not ucore)
 * @param isRestaking - Whether user restaked today
 * @param visitedSite - Whether user visited site
 * @param activeBoosts - Array of active boost multipliers
 * @param currentStreak - Current restake streak
 * @returns Distance in meters
 */
export function calculateDailyDistance(
  delegationCore: number,
  isRestaking: boolean,
  visitedSite: boolean,
  activeBoosts: number[],
  currentStreak: number
): number {
  // Cap delegation
  const cappedDelegation = Math.min(delegationCore, SCORING.DELEGATION_CAP);
  
  // Base distance
  let distance = cappedDelegation * SCORING.METERS_PER_CORE_PER_DAY;
  
  // Restake bonus (burst speed!)
  if (isRestaking) {
    distance *= SCORING.RESTAKE_MULTIPLIER;
  }
  
  // Site visit bonus
  if (visitedSite) {
    distance *= SCORING.SITE_VISIT_MULTIPLIER;
  }
  
  // Streak bonus (capped)
  const streakBonus = Math.min(
    currentStreak * SCORING.STREAK_BONUS_PER_DAY,
    SCORING.MAX_STREAK_BONUS
  );
  distance *= (1 + streakBonus);
  
  // Social boosts
  for (const boost of activeBoosts) {
    distance *= (1 + boost / 100);
  }
  
  return distance;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    const km = meters / 1000;
    if (km >= 100) {
      return `${km.toFixed(0)} km`;
    }
    return `${km.toFixed(2)} km`;
  }
  return `${meters.toFixed(1)} m`;
}

/**
 * Convert ucore to CORE
 */
export function ucoreToCore(ucore: bigint | string | number): number {
  const amount = typeof ucore === 'bigint' ? ucore : BigInt(ucore);
  return Number(amount) / 1_000_000;
}

/**
 * Check if this qualifies as a restake
 * A restake is when delegation increased by more than threshold
 * AND the increase came from claimed rewards (not new deposits)
 * 
 * Since we can't easily distinguish on-chain, we use heuristics:
 * - Increase must be > 0.5 CORE
 * - Increase should be roughly proportional to staking rewards
 *   (typical 10-15% APY = ~0.03% daily)
 */
export function isRestake(
  currentDelegationCore: number,
  previousDelegationCore: number
): boolean {
  const increase = currentDelegationCore - previousDelegationCore;
  
  // Must be positive and above threshold
  if (increase < SCORING.RESTAKE_THRESHOLD_CORE) {
    return false;
  }
  
  // For now, any increase above threshold counts
  // In future, could add more sophisticated checks
  return true;
}

/**
 * Calculate expected daily reward from delegation
 * Assumes ~12% APY on Coreum
 */
export function estimateDailyReward(delegationCore: number): number {
  const APY = 0.12; // 12%
  const dailyRate = APY / 365;
  return delegationCore * dailyRate;
}
