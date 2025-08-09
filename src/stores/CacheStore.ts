import { makeAutoObservable, runInAction } from 'mobx';
import MMKVStorage from '../services/MMKVStorage';

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  key: string;
}

class CacheStore {
  private cache: Map<string, CacheItem> = new Map();
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadCacheFromStorage();
  }

  // Load cache from MMKV storage
  private async loadCacheFromStorage() {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const allKeys = MMKVStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('cache_data_'));

      cacheKeys.forEach(key => {
        const cacheData = MMKVStorage.getCacheData(key.replace('cache_data_', ''));
        if (cacheData) {
          const cacheItem: CacheItem = {
            data: cacheData.data,
            timestamp: cacheData.timestamp,
            expiresAt: cacheData.expiresAt,
            key: key.replace('cache_data_', ''),
          };

          // Check if cache has expired
          if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
            this.removeFromStorage(cacheItem.key);
          } else {
            this.cache.set(cacheItem.key, cacheItem);
          }
        }
      });
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Set cache data
  set<T>(key: string, data: T, expiresInMinutes?: number): void {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: expiresInMinutes 
        ? Date.now() + (expiresInMinutes * 60 * 1000)
        : undefined,
      key,
    };

    this.cache.set(key, cacheItem);
    MMKVStorage.setCacheData(key, data, expiresInMinutes);
  }

  // Get cache data
  get<T>(key: string): T | null {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) {
      return null;
    }

    // Check if cache has expired
    if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
      this.remove(key);
      return null;
    }

    return cacheItem.data as T;
  }

  // Check if cache exists and is valid
  has(key: string): boolean {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) {
      return false;
    }

    // Check if cache has expired
    if (cacheItem.expiresAt && Date.now() > cacheItem.expiresAt) {
      this.remove(key);
      return false;
    }

    return true;
  }

  // Remove cache item
  remove(key: string): void {
    this.cache.delete(key);
    this.removeFromStorage(key);
  }

  // Remove from storage
  private removeFromStorage(key: string): void {
    try {
      const allKeys = MMKVStorage.getAllKeys();
      const cacheKey = allKeys.find(k => k === `cache_data_${key}`);
      if (cacheKey) {
        MMKVStorage.delete(cacheKey as any);
      }
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    MMKVStorage.clearCache();
  }

  // Get cache size
  get size(): number {
    return this.cache.size;
  }

  // Get all cache keys
  get keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Get cache statistics
  get statistics() {
    const now = Date.now();
    const totalItems = this.cache.size;
    const expiredItems = Array.from(this.cache.values()).filter(
      item => item.expiresAt && now > item.expiresAt
    ).length;
    const validItems = totalItems - expiredItems;

    return {
      total: totalItems,
      valid: validItems,
      expired: expiredItems,
      size: MMKVStorage.getStorageSize(),
    };
  }

  // Get cache items with metadata
  get items(): Array<{ key: string; timestamp: number; expiresAt?: number; isExpired: boolean }> {
    const now = Date.now();
    return Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      timestamp: item.timestamp,
      expiresAt: item.expiresAt,
      isExpired: item.expiresAt ? now > item.expiresAt : false,
    }));
  }

  // Clean expired cache items
  cleanExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((item, key) => {
      if (item.expiresAt && now > item.expiresAt) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.remove(key));
  }

  // Set multiple cache items
  setMultiple<T>(items: Array<{ key: string; data: T; expiresInMinutes?: number }>): void {
    items.forEach(item => {
      this.set(item.key, item.data, item.expiresInMinutes);
    });
  }

  // Get multiple cache items
  getMultiple<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  // Remove multiple cache items
  removeMultiple(keys: string[]): void {
    keys.forEach(key => this.remove(key));
  }

  // Check if cache is fresh (not expired and within time limit)
  isFresh(key: string, maxAgeMinutes: number): boolean {
    const cacheItem = this.cache.get(key);
    
    if (!cacheItem) {
      return false;
    }

    const maxAge = maxAgeMinutes * 60 * 1000;
    const age = Date.now() - cacheItem.timestamp;

    return age < maxAge;
  }

  // Update cache timestamp (useful for extending cache life)
  touch(key: string): void {
    const cacheItem = this.cache.get(key);
    
    if (cacheItem) {
      cacheItem.timestamp = Date.now();
      this.cache.set(key, cacheItem);
      
      // Update in storage
      MMKVStorage.setCacheData(key, cacheItem.data, 
        cacheItem.expiresAt ? (cacheItem.expiresAt - Date.now()) / (60 * 1000) : undefined
      );
    }
  }

  // Export cache data (for debugging)
  export(): Record<string, any> {
    const result: Record<string, any> = {};
    this.cache.forEach((item, key) => {
      result[key] = {
        data: item.data,
        timestamp: item.timestamp,
        expiresAt: item.expiresAt,
        isExpired: item.expiresAt ? Date.now() > item.expiresAt : false,
      };
    });
    return result;
  }

  // Initialize store (for testing)
  async initializeForTesting() {
    await this.loadCacheFromStorage();
  }
}

export default new CacheStore(); 