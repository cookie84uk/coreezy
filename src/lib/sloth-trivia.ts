/**
 * Sloth Distance Trivia System
 * 
 * Real-world distances and sloth speed calculations
 * Average sloth speed: 0.15 mph = 241 meters/hour = 5,784 meters/day
 */

// Sloth travel speed (meters per day, moving 24 hours)
export const SLOTH_SPEED_METERS_PER_DAY = 5784; // 0.15 mph × 24 hours

// Famous routes with real distances (in meters)
export const FAMOUS_ROUTES = [
  // Short distances (< 10 km)
  { from: 'Big Ben', to: 'Buckingham Palace', distance: 1200, emoji: '🏛️' },
  { from: 'Statue of Liberty', to: 'Empire State Building', distance: 8500, emoji: '🗽' },
  { from: 'Eiffel Tower', to: 'Arc de Triomphe', distance: 2800, emoji: '🗼' },
  { from: 'Sydney Opera House', to: 'Harbour Bridge', distance: 800, emoji: '🎭' },
  { from: 'Colosseum', to: 'Vatican City', distance: 4500, emoji: '🏛️' },
  
  // Medium distances (10-100 km)
  { from: 'London', to: 'Brighton', distance: 85_000, emoji: '🏖️' },
  { from: 'San Francisco', to: 'San Jose', distance: 77_000, emoji: '🌉' },
  { from: 'Tokyo', to: 'Yokohama', distance: 30_000, emoji: '🗾' },
  { from: 'Amsterdam', to: 'Rotterdam', distance: 78_000, emoji: '🌷' },
  { from: 'Munich', to: 'Salzburg', distance: 145_000, emoji: '🏔️' },
  
  // Long distances (100-500 km)
  { from: 'London', to: 'Paris', distance: 344_000, emoji: '🇫🇷' },
  { from: 'New York', to: 'Washington DC', distance: 363_000, emoji: '🇺🇸' },
  { from: 'Los Angeles', to: 'Las Vegas', distance: 435_000, emoji: '🎰' },
  { from: 'Berlin', to: 'Prague', distance: 350_000, emoji: '🏰' },
  { from: 'Rome', to: 'Florence', distance: 274_000, emoji: '🇮🇹' },
  { from: 'Madrid', to: 'Barcelona', distance: 621_000, emoji: '🇪🇸' },
  
  // Very long distances (500+ km)
  { from: 'London', to: 'Edinburgh', distance: 660_000, emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { from: 'Sydney', to: 'Melbourne', distance: 878_000, emoji: '🦘' },
  { from: 'New York', to: 'Miami', distance: 2_045_000, emoji: '🌴' },
  { from: 'London', to: 'Rome', distance: 1_873_000, emoji: '✈️' },
  { from: 'Tokyo', to: 'Osaka', distance: 515_000, emoji: '🚄' },
  
  // Epic distances
  { from: 'London', to: 'New York', distance: 5_567_000, emoji: '🌍' },
  { from: 'London', to: 'Sydney', distance: 16_983_000, emoji: '🌏' },
  { from: 'North Pole', to: 'South Pole', distance: 20_004_000, emoji: '🧭' },
  { from: 'Earth', to: 'the Moon', distance: 384_400_000, emoji: '🌙' },
] as const;

// Fun sloth facts based on distance achievements
export const SLOTH_ACHIEVEMENTS = [
  { minMeters: 0, maxMeters: 100, title: 'Sleepy Starter', description: 'Just woke up from a nap!' },
  { minMeters: 100, maxMeters: 500, title: 'Branch Hopper', description: 'Moving between trees' },
  { minMeters: 500, maxMeters: 1000, title: 'Neighborhood Explorer', description: 'Checking out the local area' },
  { minMeters: 1000, maxMeters: 5000, title: 'Park Ranger', description: 'Patrolling the territory' },
  { minMeters: 5000, maxMeters: 10000, title: 'City Wanderer', description: 'Urban adventurer' },
  { minMeters: 10000, maxMeters: 50000, title: 'Road Tripper', description: 'Enjoying the scenic route' },
  { minMeters: 50000, maxMeters: 100000, title: 'Marathon Sloth', description: 'Slow and steady wins!' },
  { minMeters: 100000, maxMeters: 500000, title: 'Cross-Country Crawler', description: 'Seeing the sights' },
  { minMeters: 500000, maxMeters: 1000000, title: 'Continental Drifter', description: 'One country at a time' },
  { minMeters: 1000000, maxMeters: 10000000, title: 'World Traveler', description: 'Globetrotting sloth!' },
  { minMeters: 10000000, maxMeters: Infinity, title: 'Legendary Explorer', description: 'Beyond imagination!' },
] as const;

export interface DistanceTrivia {
  // The journey comparison
  journey: {
    from: string;
    to: string;
    totalDistance: number;
    percentComplete: number;
    emoji: string;
  } | null;
  
  // Time to complete this journey
  daysToComplete: number;
  
  // Current achievement
  achievement: {
    title: string;
    description: string;
  };
  
  // Fun fact
  funFact: string;
}

/**
 * Generate trivia for a given distance traveled
 */
export function generateDistanceTrivia(metersTotal: number, daysTraveling: number): DistanceTrivia {
  // Find a journey that's close to or slightly beyond the distance
  const sortedRoutes = [...FAMOUS_ROUTES].sort((a, b) => a.distance - b.distance);
  
  // Find the best matching journey (one they're working towards or just completed)
  let journey: DistanceTrivia['journey'] = null;
  
  for (const route of sortedRoutes) {
    if (metersTotal <= route.distance * 1.2) { // Within 120% of route distance
      const percentComplete = Math.min(100, (metersTotal / route.distance) * 100);
      journey = {
        from: route.from,
        to: route.to,
        totalDistance: route.distance,
        percentComplete,
        emoji: route.emoji,
      };
      break;
    }
  }
  
  // If they've gone further than all routes, use the longest one
  if (!journey) {
    const longest = sortedRoutes[sortedRoutes.length - 1];
    journey = {
      from: longest.from,
      to: longest.to,
      totalDistance: longest.distance,
      percentComplete: (metersTotal / longest.distance) * 100,
      emoji: longest.emoji,
    };
  }
  
  // Calculate days to complete this journey
  const daysToComplete = Math.ceil(journey.totalDistance / SLOTH_SPEED_METERS_PER_DAY);
  
  // Find achievement
  const achievement = SLOTH_ACHIEVEMENTS.find(
    a => metersTotal >= a.minMeters && metersTotal < a.maxMeters
  ) || SLOTH_ACHIEVEMENTS[SLOTH_ACHIEVEMENTS.length - 1];
  
  // Generate fun fact
  const funFact = generateFunFact(metersTotal, daysTraveling);
  
  return {
    journey,
    daysToComplete,
    achievement: {
      title: achievement.title,
      description: achievement.description,
    },
    funFact,
  };
}

/**
 * Generate a fun fact based on distance
 */
function generateFunFact(meters: number, days: number): string {
  const km = meters / 1000;
  const avgPerDay = days > 0 ? meters / days : 0;
  
  const facts = [
    `At this pace, you'd circle the Earth in ${Math.ceil(40_075_000 / (avgPerDay || 1))} days!`,
    `Real sloths sleep 15-20 hours a day. You're doing great staying awake!`,
    `A sloth's top speed is 1.5 mph - but only when escaping danger!`,
    `Sloths can hold their breath for 40 minutes. Useful for slow swimming!`,
    `You've traveled ${km.toFixed(2)} km - that's ${(km / 0.0254).toFixed(0)} sloth body lengths!`,
    `At 0.15 mph average, sloths are slower than a garden snail's top speed!`,
    `Sloths only come down from trees once a week. You're more active!`,
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Format a journey comparison string
 */
export function formatJourneyComparison(trivia: DistanceTrivia): string {
  if (!trivia.journey) return '';
  
  const { from, to, percentComplete, emoji } = trivia.journey;
  
  if (percentComplete >= 100) {
    return `${emoji} Completed the journey from ${from} to ${to}!`;
  }
  
  return `${emoji} ${percentComplete.toFixed(1)}% of the way from ${from} to ${to}`;
}

/**
 * Get the next milestone journey
 */
export function getNextMilestone(metersTotal: number): { from: string; to: string; distance: number; remaining: number } | null {
  const sortedRoutes = [...FAMOUS_ROUTES].sort((a, b) => a.distance - b.distance);
  
  for (const route of sortedRoutes) {
    if (metersTotal < route.distance) {
      return {
        from: route.from,
        to: route.to,
        distance: route.distance,
        remaining: route.distance - metersTotal,
      };
    }
  }
  
  return null;
}
