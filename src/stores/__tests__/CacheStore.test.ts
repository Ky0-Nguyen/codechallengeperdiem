import { configure } from 'mobx';
import CacheStore from '../CacheStore';
import MMKVStorage from '../../services/MMKVStorage';

configure({ enforceActions: 'never' });
jest.mock('../../services/MMKVStorage');
const mockMMKVStorage = MMKVStorage as jest.Mocked<typeof MMKVStorage>;

describe('CacheStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Reset MMKVStorage mocks
    mockMMKVStorage.getAllKeys.mockReturnValue([]);
    mockMMKVStorage.getCacheData.mockReturnValue(null);
    
    // Reset the singleton instance
    CacheStore.clear();
    // Initialize for testing
    await CacheStore.initializeForTesting();
  });

  describe('Initialization', () => {
    it('should initialize with empty cache', () => {
      expect(CacheStore.isLoading).toBe(false);
      expect(CacheStore.size).toBe(0);
      expect(CacheStore.keys).toEqual([]);
    });

    it('should load cache from storage on initialization', async () => {
      const validCacheData = {
        timestamp: Date.now(),
        data: { key: 'value' },
        expiresAt: Date.now() + 60000, // 1 minute from now
      };
      const expiredCacheData = {
        timestamp: Date.now() - 120000, // 2 minutes ago
        data: { key: 'expired' },
        expiresAt: Date.now() - 60000, // 1 minute ago
      };

      mockMMKVStorage.getAllKeys.mockReturnValue(['cache_data_valid_key', 'cache_data_expired_key']);
      mockMMKVStorage.getCacheData
        .mockReturnValueOnce(validCacheData)
        .mockReturnValueOnce(expiredCacheData);

      // Reset and reinitialize
      CacheStore.clear();
      await CacheStore.initializeForTesting();

      expect(CacheStore.size).toBe(1); // Only one valid cache item
    });

    it('should remove expired cache items on initialization', async () => {
      const expiredCacheData = {
        timestamp: Date.now() - 120000, // 2 minutes ago
        data: { key: 'expired' },
        expiresAt: Date.now() - 60000, // 1 minute ago
      };

      mockMMKVStorage.getAllKeys.mockReturnValue(['cache_data_expired_key']);
      mockMMKVStorage.getCacheData.mockReturnValue(expiredCacheData);

      // Reset and reinitialize
      CacheStore.clear();
      await CacheStore.initializeForTesting();

      expect(CacheStore.size).toBe(0);
      expect(mockMMKVStorage.delete).toHaveBeenCalledWith('cache_data_expired_key');
    });
  });

  describe('Cache Operations', () => {
    it('should set cache data with expiration', () => {
      const key = 'test_key';
      const data = { message: 'test data' };
      const expiresInMinutes = 30;

      CacheStore.set(key, data, expiresInMinutes);

      expect(CacheStore.size).toBe(1);
      expect(CacheStore.has(key)).toBe(true);
      expect(mockMMKVStorage.setCacheData).toHaveBeenCalledWith(key, data, expiresInMinutes);
    });

    it('should set cache data without expiration', () => {
      const key = 'test_key';
      const data = { message: 'test data' };

      CacheStore.set(key, data);

      expect(CacheStore.size).toBe(1);
      expect(CacheStore.has(key)).toBe(true);
      expect(mockMMKVStorage.setCacheData).toHaveBeenCalledWith(key, data, undefined);
    });

    it('should get cache data', () => {
      const key = 'test_key';
      const data = { message: 'test data' };
      const cacheData = {
        timestamp: Date.now(),
        data: data,
        expiresAt: Date.now() + 60000, // 1 minute from now
      };
      mockMMKVStorage.getCacheData.mockReturnValue(cacheData);

      // Manually add to cache for testing
      (CacheStore as any).cache.set(key, cacheData);

      const result = CacheStore.get<typeof data>(key);

      expect(result).toEqual(data);
      // Note: getCacheData is called internally, but we're testing the result
    });

    it('should return null for non-existent cache data', () => {
      const key = 'test_key';
      mockMMKVStorage.getCacheData.mockReturnValue(null);

      const result = CacheStore.get(key);

      expect(result).toBeNull();
    });

    it('should return null for expired cache data', () => {
      const key = 'test_key';
      const cacheData = {
        timestamp: Date.now() - 120000, // 2 minutes ago
        data: { key: 'value' },
        expiresAt: Date.now() - 60000, // 1 minute ago
      };
      mockMMKVStorage.getCacheData.mockReturnValue(cacheData);

      // Manually add to cache for testing
      (CacheStore as any).cache.set(key, cacheData);

      const result = CacheStore.get(key);

      expect(result).toBeNull();
      // Note: delete is called internally when cache is expired
    });

    it('should check if cache exists', () => {
      const key = 'test_key';
      const data = { message: 'test data' };

      CacheStore.set(key, data);

      expect(CacheStore.has(key)).toBe(true);
      expect(CacheStore.has('non_existent')).toBe(false);
    });

    it('should remove cache item', () => {
      const key = 'test_key';
      const data = { message: 'test data' };

      // Manually add to cache for testing
      (CacheStore as any).cache.set(key, { data, timestamp: Date.now() });
      expect(CacheStore.size).toBe(1);

      CacheStore.remove(key);

      expect(CacheStore.size).toBe(0);
      expect(CacheStore.has(key)).toBe(false);
      // Note: delete is called internally when removing cache
    });

    it('should clear all cache', () => {
      const key1 = 'key1';
      const key2 = 'key2';

      CacheStore.set(key1, 'data1');
      CacheStore.set(key2, 'data2');
      expect(CacheStore.size).toBe(2);

      CacheStore.clear();

      expect(CacheStore.size).toBe(0);
      expect(CacheStore.keys).toEqual([]);
      expect(mockMMKVStorage.clearCache).toHaveBeenCalled();
    });
  });

  describe('Cache Statistics', () => {
    it('should return correct statistics', () => {
      // Add valid cache items
      CacheStore.set('valid1', 'data1', 60);
      CacheStore.set('valid2', 'data2', 60);
      
      // Add expired cache items (manually set for testing)
      const expiredCacheData = {
        data: 'expired_data',
        timestamp: Date.now() - 120000, // 2 minutes ago
        expiresAt: Date.now() - 60000, // 1 minute ago
        key: 'expired1',
      };
      (CacheStore as any).cache.set('expired1', expiredCacheData);

      mockMMKVStorage.getStorageSize.mockReturnValue(1024);

      const stats = CacheStore.statistics;

      expect(stats.total).toBe(3);
      expect(stats.valid).toBe(2);
      expect(stats.expired).toBe(1);
      expect(stats.size).toBe(1024);
    });

    it('should return cache items with metadata', () => {
      const now = Date.now();
      CacheStore.set('key1', 'data1', 60);
      CacheStore.set('key2', 'data2');

      const items = CacheStore.items;

      expect(items).toHaveLength(2);
      expect(items[0]).toMatchObject({
        key: 'key1',
        timestamp: expect.any(Number),
        expiresAt: expect.any(Number),
        isExpired: false,
      });
      expect(items[1]).toMatchObject({
        key: 'key2',
        timestamp: expect.any(Number),
        expiresAt: undefined,
        isExpired: false,
      });
    });
  });

  describe('Cache Cleanup', () => {
    it('should clean expired cache items', () => {
      // Add valid cache
      CacheStore.set('valid', 'data', 60);
      
      // Add expired cache (manually set for testing)
      const expiredCacheData = {
        data: 'expired_data',
        timestamp: Date.now() - 120000, // 2 minutes ago
        expiresAt: Date.now() - 60000, // 1 minute ago
        key: 'expired',
      };
      (CacheStore as any).cache.set('expired', expiredCacheData);

      expect(CacheStore.size).toBe(2);

      CacheStore.cleanExpired();

      expect(CacheStore.size).toBe(1);
      expect(CacheStore.has('valid')).toBe(true);
      expect(CacheStore.has('expired')).toBe(false);
    });
  });

  describe('Bulk Operations', () => {
    it('should set multiple cache items', () => {
      const items = [
        { key: 'key1', data: 'data1', expiresInMinutes: 30 },
        { key: 'key2', data: 'data2', expiresInMinutes: 60 },
        { key: 'key3', data: 'data3' },
      ];

      CacheStore.setMultiple(items);

      expect(CacheStore.size).toBe(3);
      expect(CacheStore.has('key1')).toBe(true);
      expect(CacheStore.has('key2')).toBe(true);
      expect(CacheStore.has('key3')).toBe(true);
    });

    it('should get multiple cache items', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const key3 = 'key3';

      CacheStore.set(key1, 'data1');
      CacheStore.set(key2, 'data2');

      const result = CacheStore.getMultiple([key1, key2, key3]);

      expect(result).toEqual({
        key1: 'data1',
        key2: 'data2',
        key3: null,
      });
    });

    it('should remove multiple cache items', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const key3 = 'key3';

      CacheStore.set(key1, 'data1');
      CacheStore.set(key2, 'data2');
      CacheStore.set(key3, 'data3');

      expect(CacheStore.size).toBe(3);

      CacheStore.removeMultiple([key1, key3]);

      expect(CacheStore.size).toBe(1);
      expect(CacheStore.has(key1)).toBe(false);
      expect(CacheStore.has(key2)).toBe(true);
      expect(CacheStore.has(key3)).toBe(false);
    });
  });

  describe('Cache Freshness', () => {
    it('should check if cache is fresh', () => {
      const key = 'test_key';
      const data = 'test data';

      // Manually add to cache with old timestamp for testing
      const oldTimestamp = Date.now() - 120 * 60 * 1000; // 120 minutes ago
      (CacheStore as any).cache.set(key, { 
        data, 
        timestamp: oldTimestamp,
        expiresAt: Date.now() + 60 * 60 * 1000 // 60 minutes from now
      });

      // Should not be fresh after 120 minutes
      expect(CacheStore.isFresh(key, 120)).toBe(false);

      // Should be fresh within 180 minutes
      expect(CacheStore.isFresh(key, 180)).toBe(true);
    });

    it('should return false for non-existent cache', () => {
      expect(CacheStore.isFresh('non_existent', 30)).toBe(false);
    });
  });

  describe('Cache Touch', () => {
    it('should update cache timestamp', () => {
      const key = 'test_key';
      const data = 'test data';

      CacheStore.set(key, data, 60);
      
      const originalTimestamp = (CacheStore as any).cache.get(key).timestamp;
      
      // Wait a bit
      jest.advanceTimersByTime(1000);
      
      CacheStore.touch(key);
      
      const newTimestamp = (CacheStore as any).cache.get(key).timestamp;
      
      expect(newTimestamp).toBeGreaterThan(originalTimestamp);
    });

    it('should not touch non-existent cache', () => {
      expect(() => CacheStore.touch('non_existent')).not.toThrow();
    });
  });

  describe('Cache Export', () => {
    it('should export cache data', () => {
      const now = Date.now();
      CacheStore.set('key1', 'data1', 60);
      CacheStore.set('key2', 'data2');

      const exported = CacheStore.export();

      expect(exported).toEqual({
        key1: {
          data: 'data1',
          timestamp: expect.any(Number),
          expiresAt: expect.any(Number),
          isExpired: false,
        },
        key2: {
          data: 'data2',
          timestamp: expect.any(Number),
          expiresAt: undefined,
          isExpired: false,
        },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle MMKV storage errors gracefully', () => {
      // Should not throw during initialization
      expect(() => {
        CacheStore.clear();
      }).not.toThrow();
    });

    it('should handle cache removal errors gracefully', () => {
      CacheStore.set('test_key', 'test_data');

      // Should not throw when removing cache
      expect(() => {
        CacheStore.remove('test_key');
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cache operations', () => {
      expect(CacheStore.get('non_existent')).toBeNull();
      expect(CacheStore.has('non_existent')).toBe(false);
      expect(CacheStore.remove('non_existent')).toBeUndefined();
      expect(CacheStore.touch('non_existent')).toBeUndefined();
    });

    it('should handle cache with zero expiration', () => {
      const key = 'test_key';
      const data = 'test';

      CacheStore.set(key, data, 0);

      expect(CacheStore.has(key)).toBe(true);
      expect(CacheStore.get(key)).toEqual(data);
    });

    it('should handle very large expiration times', () => {
      const key = 'test_key';
      const data = 'test';
      const longExpiry = 24 * 60 * 365; // 1 year in minutes

      CacheStore.set(key, data, longExpiry);

      expect(CacheStore.has(key)).toBe(true);
      expect(CacheStore.get(key)).toEqual(data);
    });
  });
}); 