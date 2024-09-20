import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', () => ({
  ttl: process.env.CACHE_TTL as unknown as number,
  disableCache: process.env.CACHE_DISABLE as unknown as boolean,
}));
