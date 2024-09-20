import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCachedValue(key: string): Promise<string | undefined> {
    return this.cacheManager.get(key);
  }

  async setCachedValue(key: string, value: string, ttl = 60): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async deleteCachedValue(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
