import type { CacheEntry } from '../../interfaces/interfaces';

const cache = new Map<string, CacheEntry<any>>();

export const queryCache = {
  get<T>(key: string): CacheEntry<T> | undefined {
    return cache.get(key);
  },

  set<T>(key: string, data: T) {
    cache.set(key, {
      data,
      updatedAt: Date.now(),
    });
  },  

  invalidate(key: string) {
    cache.delete(key);
  },

  clear() {
    cache.clear();
  },
};
