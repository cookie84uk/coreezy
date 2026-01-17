// Sloth Race Configuration
// These can be updated each season

export const RACE_CONFIG = {
  // Current Season
  season: {
    name: 'Season 1',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
  },

  // Prize Pool Distribution (must sum to 100)
  // 1% of validator commission goes to prize pool
  prizeDistribution: {
    adult: 60,  // Top 33% get 60% of pool
    teen: 30,   // Middle 33% get 30% of pool
    baby: 10,   // Bottom 33% get 10% of pool
  },

  // Commission percentage that goes to prize pool
  commissionToPool: 1, // 1% of total commission

  // Scoring caps and bonuses
  scoring: {
    delegationCap: 50_000, // 50K CORE cap
    restakeBonus: 10,      // +10%
    siteVisitBonus: 2,     // +2%
  },

  // Social boost multipliers
  boosts: {
    twitter: { multiplier: 5, durationDays: 7 },
    youtube: { multiplier: 10, durationDays: 14 },
    tiktok: { multiplier: 7, durationDays: 7 },
    article: { multiplier: 15, durationDays: 30 },
  },

  // Sleep penalty
  sleepDays: 3,
};

// Helper to calculate prize pool per class
export function calculateClassPool(totalPool: number, className: 'adult' | 'teen' | 'baby'): number {
  return (totalPool * RACE_CONFIG.prizeDistribution[className]) / 100;
}

// Helper to calculate days remaining in season
export function getDaysRemaining(): number {
  const end = new Date(RACE_CONFIG.season.endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Helper to check if season is active
export function isSeasonActive(): boolean {
  const now = new Date();
  const start = new Date(RACE_CONFIG.season.startDate);
  const end = new Date(RACE_CONFIG.season.endDate);
  return now >= start && now <= end;
}
