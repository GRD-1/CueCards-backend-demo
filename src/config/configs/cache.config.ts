import { registerAs } from '@nestjs/config';

export const cacheConfig = registerAs('cache', () => ({
  ttl: process.env.CACHE_TTL as unknown as number,
  disableCache: process.env.DISABLE_CACHE as unknown as boolean,
}));
