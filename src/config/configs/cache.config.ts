import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', () => ({
  ttl: process.env.CACHE_TTL,
  disableCache: process.env.DISABLE_CACHE,
}));
