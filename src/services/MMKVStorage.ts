import { MMKV } from 'react-native-mmkv';

// Define storage keys as constants to avoid typos
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  APP_SETTINGS: 'app_settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  CACHE_DATA: 'cache_data',
  USER_PREFERENCES: 'user_preferences',
  AUTH_TOKEN: 'auth_token',
  THEME: 'theme',
  LANGUAGE: 'language',
  TIMEZONE_PREFERENCE: 'timezone_preference',
} as const;

// Type for storage keys
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Define types for stored data
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  timezone?: string;
  photoURL?: string;
  provider?: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  categories: {
    general: boolean;
    reminders: boolean;
    updates: boolean;
  };
}

export interface CacheData {
  timestamp: number;
  data: any;
  expiresAt?: number;
}

class MMKVStorage {
  private storage: MMKV;

  constructor() {
    // Initialize MMKV with encryption
    this.storage = new MMKV({
      id: 'app-storage',
      encryptionKey: 'your-encryption-key-here', // Change this in production
    });
  }

  // Generic methods for any data type
  set<T>(key: StorageKey, value: T): void {
    try {
      this.storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting value for key ${key}:`, error);
    }
  }

  get<T>(key: StorageKey, defaultValue?: T): T | null {
    try {
      const value = this.storage.getString(key);
      if (value === undefined) {
        return defaultValue || null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting value for key ${key}:`, error);
      return defaultValue || null;
    }
  }

  delete(key: StorageKey): void {
    try {
      this.storage.delete(key);
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
    }
  }

  exists(key: StorageKey): boolean {
    return this.storage.contains(key);
  }

  // Clear all data
  clear(): void {
    try {
      this.storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Get all keys
  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  // User Profile methods
  setUserProfile(profile: UserProfile): void {
    this.set(STORAGE_KEYS.USER_PROFILE, profile);
  }

  getUserProfile(): UserProfile | null {
    return this.get<UserProfile>(STORAGE_KEYS.USER_PROFILE);
  }

  updateUserProfile(updates: Partial<UserProfile>): void {
    const currentProfile = this.getUserProfile();
    if (currentProfile) {
      this.setUserProfile({ ...currentProfile, ...updates });
    }
  }

  // App Settings methods
  setAppSettings(settings: AppSettings): void {
    this.set(STORAGE_KEYS.APP_SETTINGS, settings);
  }

  getAppSettings(): AppSettings | null {
    return this.get<AppSettings>(STORAGE_KEYS.APP_SETTINGS);
  }

  updateAppSettings(updates: Partial<AppSettings>): void {
    const currentSettings = this.getAppSettings();
    if (currentSettings) {
      this.setAppSettings({ ...currentSettings, ...updates });
    }
  }

  // Notification Settings methods
  setNotificationSettings(settings: NotificationSettings): void {
    this.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  getNotificationSettings(): NotificationSettings | null {
    return this.get<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  }

  updateNotificationSettings(updates: Partial<NotificationSettings>): void {
    const currentSettings = this.getNotificationSettings();
    if (currentSettings) {
      this.setNotificationSettings({ ...currentSettings, ...updates });
    }
  }

  // Cache methods
  setCacheData(key: string, data: any, expiresInMinutes?: number): void {
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
      expiresAt: expiresInMinutes 
        ? Date.now() + (expiresInMinutes * 60 * 1000)
        : undefined,
    };
    
    this.set(`${STORAGE_KEYS.CACHE_DATA}_${key}` as StorageKey, cacheData);
  }

  getCacheData<T>(key: string): T | null {
    const cacheData = this.get<CacheData>(`${STORAGE_KEYS.CACHE_DATA}_${key}` as StorageKey);
    
    if (!cacheData) {
      return null;
    }

    // Check if cache has expired
    if (cacheData.expiresAt && Date.now() > cacheData.expiresAt) {
      this.delete(`${STORAGE_KEYS.CACHE_DATA}_${key}` as StorageKey);
      return null;
    }

    return cacheData.data as T;
  }

  clearCache(): void {
    const allKeys = this.getAllKeys();
    const cacheKeys = allKeys.filter(key => key.startsWith(STORAGE_KEYS.CACHE_DATA));
    cacheKeys.forEach(key => this.delete(key as StorageKey));
  }

  // Auth methods
  setAuthToken(token: string): void {
    this.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return this.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  }

  clearAuthToken(): void {
    this.delete(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Theme methods
  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.set(STORAGE_KEYS.THEME, theme);
  }

  getTheme(): 'light' | 'dark' | 'auto' {
    return this.get<'light' | 'dark' | 'auto'>(STORAGE_KEYS.THEME) || 'auto';
  }

  // Language methods
  setLanguage(language: string): void {
    this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  getLanguage(): string {
    return this.get<string>(STORAGE_KEYS.LANGUAGE) || 'en';
  }

  // Utility methods
  getStorageSize(): number {
    return this.storage.size;
  }

  // Migration helper
  migrateData(oldKey: string, newKey: StorageKey): void {
    if (this.storage.contains(oldKey)) {
      const value = this.storage.getString(oldKey);
      if (value) {
        this.storage.set(newKey, value);
        this.storage.delete(oldKey);
      }
    }
  }

  // Backup and restore (for development/debugging)
  exportData(): Record<string, any> {
    const allKeys = this.getAllKeys();
    const data: Record<string, any> = {};
    
    allKeys.forEach(key => {
      const value = this.storage.getString(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });
    
    return data;
  }

  importData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'string') {
        this.storage.set(key, value);
      } else {
        this.storage.set(key, JSON.stringify(value));
      }
    });
  }
}

// Export singleton instance
export default new MMKVStorage(); 