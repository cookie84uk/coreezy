import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  client.on('connect', () => {
    console.log('Redis connected');
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// Cache helpers
export const CACHE_KEYS = {
  LEADERBOARD: 'leaderboard',
  CLASS_THRESHOLDS: 'class_thresholds',
  VAULT_STATE: 'vault_state',
  VALIDATOR_STATS: 'validator_stats',
  SITE_VISIT: (userId: string, date: string) => `site_visit:${userId}:${date}`,
  PROFILE: (address: string) => `profile:${address}`,
} as const;

export const CACHE_TTL = {
  LEADERBOARD: 300, // 5 minutes
  CLASS_THRESHOLDS: 3600, // 1 hour
  VAULT_STATE: 600, // 10 minutes
  VALIDATOR_STATS: 300, // 5 minutes
  SITE_VISIT: 86400, // 24 hours
  PROFILE: 60, // 1 minute
} as const;

// Generic cache get/set
export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
