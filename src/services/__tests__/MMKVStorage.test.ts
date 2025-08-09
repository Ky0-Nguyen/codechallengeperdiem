import { MMKV } from 'react-native-mmkv';
import MMKVStorage, { 
  STORAGE_KEYS, 
  UserProfile, 
  AppSettings, 
  NotificationSettings 
} from '../MMKVStorage';

// Mock MMKV
const mockMMKV = {
  set: jest.fn(),
  getString: jest.fn(),
  delete: jest.fn(),
  contains: jest.fn(),
  clearAll: jest.fn(),
  getAllKeys: jest.fn(),
  size: 0,
};

(MMKV as jest.Mock).mockImplementation(() => mockMMKV);

describe('MMKVStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the singleton instance
    (MMKVStorage as any).storage = mockMMKV;
  });

  describe('Basic Operations', () => {
    it('should set and get string values', () => {
      const testData = 'test value';
      mockMMKV.getString.mockReturnValue(JSON.stringify(testData));

      MMKVStorage.set(STORAGE_KEYS.USER_PROFILE, testData);
      const result = MMKVStorage.get<string>(STORAGE_KEYS.USER_PROFILE);

      expect(mockMMKV.set).toHaveBeenCalledWith(STORAGE_KEYS.USER_PROFILE, JSON.stringify(testData));
      expect(mockMMKV.getString).toHaveBeenCalledWith(STORAGE_KEYS.USER_PROFILE);
      expect(result).toBe(testData);
    });

    it('should set and get object values', () => {
      const testData = { name: 'John', age: 30 };
      mockMMKV.getString.mockReturnValue(JSON.stringify(testData));

      MMKVStorage.set(STORAGE_KEYS.APP_SETTINGS, testData);
      const result = MMKVStorage.get<typeof testData>(STORAGE_KEYS.APP_SETTINGS);

      expect(mockMMKV.set).toHaveBeenCalledWith(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(testData));
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = MMKVStorage.get<string>(STORAGE_KEYS.USER_PROFILE);

      expect(result).toBeNull();
    });

    it('should return default value for non-existent keys', () => {
      mockMMKV.getString.mockReturnValue(undefined);
      const defaultValue = 'default';

      const result = MMKVStorage.get<string>(STORAGE_KEYS.USER_PROFILE, defaultValue);

      expect(result).toBe(defaultValue);
    });

    it('should handle JSON parse errors gracefully', () => {
      mockMMKV.getString.mockReturnValue('invalid json');

      const result = MMKVStorage.get<string>(STORAGE_KEYS.USER_PROFILE);

      expect(result).toBeNull();
    });

    it('should delete keys', () => {
      MMKVStorage.delete(STORAGE_KEYS.USER_PROFILE);

      expect(mockMMKV.delete).toHaveBeenCalledWith(STORAGE_KEYS.USER_PROFILE);
    });

    it('should check if key exists', () => {
      mockMMKV.contains.mockReturnValue(true);

      const result = MMKVStorage.exists(STORAGE_KEYS.USER_PROFILE);

      expect(mockMMKV.contains).toHaveBeenCalledWith(STORAGE_KEYS.USER_PROFILE);
      expect(result).toBe(true);
    });

    it('should clear all data', () => {
      MMKVStorage.clear();

      expect(mockMMKV.clearAll).toHaveBeenCalled();
    });

    it('should get all keys', () => {
      const mockKeys = ['key1', 'key2', 'key3'];
      mockMMKV.getAllKeys.mockReturnValue(mockKeys);

      const result = MMKVStorage.getAllKeys();

      expect(mockMMKV.getAllKeys).toHaveBeenCalled();
      expect(result).toEqual(mockKeys);
    });
  });

  describe('User Profile Operations', () => {
    const mockUserProfile: UserProfile = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        notifications: true,
        theme: 'dark',
        language: 'en',
      },
    };

    it('should set user profile', () => {
      MMKVStorage.setUserProfile(mockUserProfile);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(mockUserProfile)
      );
    });

    it('should get user profile', () => {
      mockMMKV.getString.mockReturnValue(JSON.stringify(mockUserProfile));

      const result = MMKVStorage.getUserProfile();

      expect(mockMMKV.getString).toHaveBeenCalledWith(STORAGE_KEYS.USER_PROFILE);
      expect(result).toEqual(mockUserProfile);
    });

    it('should update user profile', () => {
      const existingProfile = { ...mockUserProfile };
      const updates = { name: 'Jane Doe' };
      mockMMKV.getString.mockReturnValue(JSON.stringify(existingProfile));

      MMKVStorage.updateUserProfile(updates);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify({ ...existingProfile, ...updates })
      );
    });

    it('should not update user profile if none exists', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      MMKVStorage.updateUserProfile({ name: 'Jane Doe' });

      expect(mockMMKV.set).not.toHaveBeenCalled();
    });
  });

  describe('App Settings Operations', () => {
    const mockAppSettings: AppSettings = {
      theme: 'dark',
      language: 'en',
      notifications: {
        enabled: true,
        sound: true,
        vibration: true,
      },
      privacy: {
        analytics: true,
        crashReports: true,
      },
    };

    it('should set app settings', () => {
      MMKVStorage.setAppSettings(mockAppSettings);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify(mockAppSettings)
      );
    });

    it('should get app settings', () => {
      mockMMKV.getString.mockReturnValue(JSON.stringify(mockAppSettings));

      const result = MMKVStorage.getAppSettings();

      expect(mockMMKV.getString).toHaveBeenCalledWith(STORAGE_KEYS.APP_SETTINGS);
      expect(result).toEqual(mockAppSettings);
    });

    it('should update app settings', () => {
      const existingSettings = { ...mockAppSettings };
      const updates = { theme: 'light' };
      mockMMKV.getString.mockReturnValue(JSON.stringify(existingSettings));

      MMKVStorage.updateAppSettings(updates);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.APP_SETTINGS,
        JSON.stringify({ ...existingSettings, ...updates })
      );
    });
  });

  describe('Notification Settings Operations', () => {
    const mockNotificationSettings: NotificationSettings = {
      enabled: true,
      sound: true,
      vibration: true,
      categories: {
        general: true,
        reminders: true,
        updates: true,
      },
    };

    it('should set notification settings', () => {
      MMKVStorage.setNotificationSettings(mockNotificationSettings);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        JSON.stringify(mockNotificationSettings)
      );
    });

    it('should get notification settings', () => {
      mockMMKV.getString.mockReturnValue(JSON.stringify(mockNotificationSettings));

      const result = MMKVStorage.getNotificationSettings();

      expect(mockMMKV.getString).toHaveBeenCalledWith(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      expect(result).toEqual(mockNotificationSettings);
    });

    it('should update notification settings', () => {
      const existingSettings = { ...mockNotificationSettings };
      const updates = { sound: false };
      mockMMKV.getString.mockReturnValue(JSON.stringify(existingSettings));

      MMKVStorage.updateNotificationSettings(updates);

      expect(mockMMKV.set).toHaveBeenCalledWith(
        STORAGE_KEYS.NOTIFICATION_SETTINGS,
        JSON.stringify({ ...existingSettings, ...updates })
      );
    });
  });

  describe('Cache Operations', () => {
    it('should set cache data with expiration', () => {
      const testData = { key: 'value' };
      const cacheKey = 'test_cache';
      const expiresInMinutes = 30;

      MMKVStorage.setCacheData(cacheKey, testData, expiresInMinutes);

      // Get the actual call arguments to verify the structure
      const actualCall = mockMMKV.set.mock.calls[0];
      const actualKey = actualCall[0];
      const actualValue = JSON.parse(actualCall[1]);

      expect(actualKey).toBe(`${STORAGE_KEYS.CACHE_DATA}_${cacheKey}`);
      expect(actualValue).toMatchObject({
        timestamp: expect.any(Number),
        data: testData,
        expiresAt: expect.any(Number),
      });
    });

    it('should set cache data without expiration', () => {
      const testData = { key: 'value' };
      const cacheKey = 'test_cache';

      MMKVStorage.setCacheData(cacheKey, testData);

      // Get the actual call arguments to verify the structure
      const actualCall = mockMMKV.set.mock.calls[0];
      const actualKey = actualCall[0];
      const actualValue = JSON.parse(actualCall[1]);

      expect(actualKey).toBe(`${STORAGE_KEYS.CACHE_DATA}_${cacheKey}`);
      expect(actualValue).toMatchObject({
        timestamp: expect.any(Number),
        data: testData,
      });
      expect(actualValue.expiresAt).toBeUndefined();
    });

    it('should get valid cache data', () => {
      const testData = { key: 'value' };
      const cacheKey = 'test_cache';
      const cacheData = {
        timestamp: Date.now(),
        data: testData,
        expiresAt: Date.now() + 60000, // 1 minute from now
      };
      mockMMKV.getString.mockReturnValue(JSON.stringify(cacheData));

      const result = MMKVStorage.getCacheData<typeof testData>(cacheKey);

      expect(result).toEqual(testData);
    });

    it('should return null for expired cache data', () => {
      const cacheKey = 'test_cache';
      const cacheData = {
        timestamp: Date.now() - 120000, // 2 minutes ago
        data: { key: 'value' },
        expiresAt: Date.now() - 60000, // 1 minute ago
      };
      mockMMKV.getString.mockReturnValue(JSON.stringify(cacheData));

      const result = MMKVStorage.getCacheData(cacheKey);

      expect(result).toBeNull();
      expect(mockMMKV.delete).toHaveBeenCalledWith(`${STORAGE_KEYS.CACHE_DATA}_${cacheKey}`);
    });

    it('should return null for non-existent cache data', () => {
      const cacheKey = 'test_cache';
      mockMMKV.getString.mockReturnValue(undefined);

      const result = MMKVStorage.getCacheData(cacheKey);

      expect(result).toBeNull();
    });

    it('should clear cache', () => {
      const allKeys = ['cache_data_key1', 'cache_data_key2', 'other_key'];
      mockMMKV.getAllKeys.mockReturnValue(allKeys);

      MMKVStorage.clearCache();

      expect(mockMMKV.getAllKeys).toHaveBeenCalled();
      expect(mockMMKV.delete).toHaveBeenCalledWith('cache_data_key1');
      expect(mockMMKV.delete).toHaveBeenCalledWith('cache_data_key2');
      expect(mockMMKV.delete).not.toHaveBeenCalledWith('other_key');
    });
  });

  describe('Auth Operations', () => {
    it('should set auth token', () => {
      const token = 'test_token';

      MMKVStorage.setAuthToken(token);

      expect(mockMMKV.set).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(token));
    });

    it('should get auth token', () => {
      const token = 'test_token';
      mockMMKV.getString.mockReturnValue(JSON.stringify(token));

      const result = MMKVStorage.getAuthToken();

      expect(mockMMKV.getString).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
      expect(result).toBe(token);
    });

    it('should clear auth token', () => {
      MMKVStorage.clearAuthToken();

      expect(mockMMKV.delete).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
    });
  });

  describe('Theme and Language Operations', () => {
    it('should set and get theme', () => {
      const theme = 'dark';
      mockMMKV.getString.mockReturnValue(JSON.stringify(theme));

      MMKVStorage.setTheme(theme);
      const result = MMKVStorage.getTheme();

      expect(mockMMKV.set).toHaveBeenCalledWith(STORAGE_KEYS.THEME, JSON.stringify(theme));
      expect(result).toBe(theme);
    });

    it('should return default theme when not set', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = MMKVStorage.getTheme();

      expect(result).toBe('auto');
    });

    it('should set and get language', () => {
      const language = 'es';
      mockMMKV.getString.mockReturnValue(JSON.stringify(language));

      MMKVStorage.setLanguage(language);
      const result = MMKVStorage.getLanguage();

      expect(mockMMKV.set).toHaveBeenCalledWith(STORAGE_KEYS.LANGUAGE, JSON.stringify(language));
      expect(result).toBe(language);
    });

    it('should return default language when not set', () => {
      mockMMKV.getString.mockReturnValue(undefined);

      const result = MMKVStorage.getLanguage();

      expect(result).toBe('en');
    });
  });

  describe('Utility Operations', () => {
    it('should get storage size', () => {
      mockMMKV.size = 1024;

      const result = MMKVStorage.getStorageSize();

      expect(result).toBe(1024);
    });

    it('should migrate data', () => {
      const oldKey = 'old_key';
      const newKey = STORAGE_KEYS.USER_PROFILE;
      const value = 'test_value';
      mockMMKV.contains.mockReturnValue(true);
      mockMMKV.getString.mockReturnValue(value);

      MMKVStorage.migrateData(oldKey, newKey);

      expect(mockMMKV.contains).toHaveBeenCalledWith(oldKey);
      expect(mockMMKV.getString).toHaveBeenCalledWith(oldKey);
      expect(mockMMKV.set).toHaveBeenCalledWith(newKey, value);
      expect(mockMMKV.delete).toHaveBeenCalledWith(oldKey);
    });

    it('should not migrate data if old key does not exist', () => {
      const oldKey = 'old_key';
      const newKey = STORAGE_KEYS.USER_PROFILE;
      mockMMKV.contains.mockReturnValue(false);

      MMKVStorage.migrateData(oldKey, newKey);

      expect(mockMMKV.set).not.toHaveBeenCalled();
      expect(mockMMKV.delete).not.toHaveBeenCalled();
    });

    it('should export data', () => {
      const allKeys = ['key1', 'key2'];
      const data = {
        key1: 'value1',
        key2: JSON.stringify({ nested: 'value2' }),
      };
      mockMMKV.getAllKeys.mockReturnValue(allKeys);
      mockMMKV.getString
        .mockReturnValueOnce('value1')
        .mockReturnValueOnce(JSON.stringify({ nested: 'value2' }));

      const result = MMKVStorage.exportData();

      expect(result).toEqual({
        key1: 'value1',
        key2: { nested: 'value2' },
      });
    });

    it('should import data', () => {
      const data = {
        key1: 'value1',
        key2: { nested: 'value2' },
      };

      MMKVStorage.importData(data);

      expect(mockMMKV.set).toHaveBeenCalledWith('key1', 'value1');
      expect(mockMMKV.set).toHaveBeenCalledWith('key2', JSON.stringify({ nested: 'value2' }));
    });
  });

  describe('Error Handling', () => {
    it('should handle set errors gracefully', () => {
      mockMMKV.set.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        MMKVStorage.set(STORAGE_KEYS.USER_PROFILE, 'test');
      }).not.toThrow();
    });

    it('should handle get errors gracefully', () => {
      mockMMKV.getString.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = MMKVStorage.get<string>(STORAGE_KEYS.USER_PROFILE);

      expect(result).toBeNull();
    });

    it('should handle delete errors gracefully', () => {
      mockMMKV.delete.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        MMKVStorage.delete(STORAGE_KEYS.USER_PROFILE);
      }).not.toThrow();
    });

    it('should handle clear errors gracefully', () => {
      mockMMKV.clearAll.mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        MMKVStorage.clear();
      }).not.toThrow();
    });
  });
}); 