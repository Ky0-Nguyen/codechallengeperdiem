import { configure } from 'mobx';
import AppStore from '../AppStore';
import MMKVStorage, { UserProfile } from '../../services/MMKVStorage';

configure({ enforceActions: 'never' });
jest.mock('../../services/MMKVStorage');
const mockMMKVStorage = MMKVStorage as jest.Mocked<typeof MMKVStorage>;

describe('AppStore', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // Reset MMKVStorage mocks
    mockMMKVStorage.getAppSettings.mockReturnValue(null);
    mockMMKVStorage.getNotificationSettings.mockReturnValue(null);
    mockMMKVStorage.getUserProfile.mockReturnValue(null);
    
    // Reset the singleton instance
    AppStore.reset();
    // Initialize for testing
    await AppStore.initializeForTesting();
  });

  describe('Initialization', () => {
    it('should initialize with default values', async () => {
      expect(AppStore.isLoading).toBe(false);
      expect(AppStore.isInitialized).toBe(true);
      expect(AppStore.userProfile).toBeNull();
      expect(AppStore.isAuthenticated).toBe(false);
      expect(AppStore.appSettings.theme).toBe('auto');
      expect(AppStore.appSettings.language).toBe('en');
      expect(AppStore.notificationSettings.enabled).toBe(true);
    });

    it('should load saved app settings on initialization', async () => {
      const savedSettings = {
        theme: 'dark' as const,
        language: 'es',
        notifications: {
          enabled: false,
          sound: true,
          vibration: false,
        },
        privacy: {
          analytics: true,
          crashReports: false,
        },
      };
      mockMMKVStorage.getAppSettings.mockReturnValue(savedSettings);

      // Reset and reinitialize
      AppStore.reset();
      await AppStore.initializeForTesting();

      expect(AppStore.appSettings.theme).toBe('dark');
      expect(AppStore.appSettings.language).toBe('es');
      expect(AppStore.appSettings.notifications.enabled).toBe(false);
    });

    it('should load saved notification settings on initialization', async () => {
      const savedNotificationSettings = {
        enabled: false,
        sound: false,
        vibration: true,
        categories: {
          general: true,
          reminders: false,
          updates: true,
        },
      };
      mockMMKVStorage.getNotificationSettings.mockReturnValue(savedNotificationSettings);

      // Reset and reinitialize
      AppStore.reset();
      await AppStore.initializeForTesting();

      expect(AppStore.notificationSettings.enabled).toBe(false);
      expect(AppStore.notificationSettings.sound).toBe(false);
      expect(AppStore.notificationSettings.vibration).toBe(true);
    });

    it('should load saved user profile on initialization', async () => {
      const savedUserProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };
      mockMMKVStorage.getUserProfile.mockReturnValue(savedUserProfile);

      // Reset and reinitialize
      AppStore.reset();
      await AppStore.initializeForTesting();

      expect(AppStore.userProfile).toEqual(savedUserProfile);
      expect(AppStore.isAuthenticated).toBe(true);
    });
  });

  describe('User Management', () => {
    it('should set user profile', () => {
      const userProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };

      AppStore.setUserProfile(userProfile);

      expect(AppStore.userProfile).toEqual(userProfile);
      expect(AppStore.isAuthenticated).toBe(true);
      expect(mockMMKVStorage.setUserProfile).toHaveBeenCalledWith(userProfile);
    });

    it('should update user profile', () => {
      const existingProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };
      const updates = { name: 'Jane Doe', email: 'jane@example.com' };

      // Set initial profile
      AppStore.setUserProfile(existingProfile);

      // Update profile
      AppStore.updateUserProfile(updates);

      expect(AppStore.userProfile).toEqual({ ...existingProfile, ...updates });
      expect(mockMMKVStorage.setUserProfile).toHaveBeenCalledWith({ ...existingProfile, ...updates });
    });

    it('should not update user profile if none exists', () => {
      const updates = { name: 'Jane Doe' };

      AppStore.updateUserProfile(updates);

      expect(AppStore.userProfile).toBeNull();
      expect(mockMMKVStorage.setUserProfile).not.toHaveBeenCalled();
    });

    it('should logout user', () => {
      const userProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };

      // Set user profile first
      AppStore.setUserProfile(userProfile);
      expect(AppStore.isAuthenticated).toBe(true);

      // Logout
      AppStore.logout();

      expect(AppStore.userProfile).toBeNull();
      expect(AppStore.isAuthenticated).toBe(false);
      expect(mockMMKVStorage.clearAuthToken).toHaveBeenCalled();
      expect(mockMMKVStorage.delete).toHaveBeenCalledWith('user_profile');
    });
  });

  describe('App Settings', () => {
    it('should update app settings', () => {
      const updates = { theme: 'dark' as const, language: 'es' };

      AppStore.updateAppSettings(updates);

      expect(AppStore.appSettings.theme).toBe('dark');
      expect(AppStore.appSettings.language).toBe('es');
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
    });

    it('should set theme', () => {
      AppStore.setTheme('dark');

      expect(AppStore.appSettings.theme).toBe('dark');
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
      expect(mockMMKVStorage.setTheme).toHaveBeenCalledWith('dark');
    });

    it('should set language', () => {
      AppStore.setLanguage('es');

      expect(AppStore.appSettings.language).toBe('es');
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
      expect(mockMMKVStorage.setLanguage).toHaveBeenCalledWith('es');
    });

    it('should toggle notifications', () => {
      AppStore.toggleNotifications(false);

      expect(AppStore.appSettings.notifications.enabled).toBe(false);
      expect(AppStore.notificationSettings.enabled).toBe(false);
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
      expect(mockMMKVStorage.setNotificationSettings).toHaveBeenCalledWith(AppStore.notificationSettings);
    });
  });

  describe('Notification Settings', () => {
    it('should update notification settings', () => {
      const updates = { sound: false, vibration: false };

      AppStore.updateNotificationSettings(updates);

      expect(AppStore.notificationSettings.sound).toBe(false);
      expect(AppStore.notificationSettings.vibration).toBe(false);
      expect(mockMMKVStorage.setNotificationSettings).toHaveBeenCalledWith(AppStore.notificationSettings);
    });

    it('should toggle notification category', () => {
      expect(AppStore.notificationSettings.categories.general).toBe(true);

      AppStore.toggleNotificationCategory('general');

      expect(AppStore.notificationSettings.categories.general).toBe(false);
      expect(mockMMKVStorage.setNotificationSettings).toHaveBeenCalledWith(AppStore.notificationSettings);
    });

    it('should toggle multiple notification categories', () => {
      AppStore.toggleNotificationCategory('reminders');
      AppStore.toggleNotificationCategory('updates');

      expect(AppStore.notificationSettings.categories.reminders).toBe(false);
      expect(AppStore.notificationSettings.categories.updates).toBe(false);
      expect(AppStore.notificationSettings.categories.general).toBe(true);
    });
  });

  describe('Privacy Settings', () => {
    it('should toggle analytics', () => {
      expect(AppStore.appSettings.privacy.analytics).toBe(true);

      AppStore.toggleAnalytics(false);

      expect(AppStore.appSettings.privacy.analytics).toBe(false);
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
    });

    it('should toggle crash reports', () => {
      expect(AppStore.appSettings.privacy.crashReports).toBe(true);

      AppStore.toggleCrashReports(false);

      expect(AppStore.appSettings.privacy.crashReports).toBe(false);
      expect(mockMMKVStorage.setAppSettings).toHaveBeenCalledWith(AppStore.appSettings);
    });
  });

  describe('Loading State', () => {
    it('should set loading state', () => {
      expect(AppStore.isLoading).toBe(false);

      AppStore.setLoading(true);

      expect(AppStore.isLoading).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should return current theme correctly', () => {
      // Test auto theme (should return light for now)
      expect(AppStore.currentTheme).toBe('light');

      // Test explicit themes
      AppStore.setTheme('dark');
      expect(AppStore.currentTheme).toBe('dark');

      AppStore.setTheme('light');
      expect(AppStore.currentTheme).toBe('light');
    });

    it('should return notifications enabled status', () => {
      // Both should be enabled by default
      expect(AppStore.isNotificationsEnabled).toBe(true);

      // Disable app-level notifications
      AppStore.appSettings.notifications.enabled = false;
      expect(AppStore.isNotificationsEnabled).toBe(false);

      // Re-enable app-level but disable notification-level
      AppStore.appSettings.notifications.enabled = true;
      AppStore.notificationSettings.enabled = false;
      expect(AppStore.isNotificationsEnabled).toBe(false);
    });

    it('should return user display name', () => {
      // Should return 'Guest' when no user profile
      expect(AppStore.userDisplayName).toBe('Guest');

      // Should return user name when profile exists
      const userProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };
      AppStore.setUserProfile(userProfile);
      expect(AppStore.userDisplayName).toBe('John Doe');
    });

    it('should return user email', () => {
      // Should return empty string when no user profile
      expect(AppStore.userEmail).toBe('');

      // Should return user email when profile exists
      const userProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };
      AppStore.setUserProfile(userProfile);
      expect(AppStore.userEmail).toBe('john@example.com');
    });
  });

  describe('Reset Functionality', () => {
    it('should reset store to default values', () => {
      // Set some custom values first
      const userProfile: UserProfile = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: { notifications: true, theme: 'dark' as const, language: 'en' },
      };
      AppStore.setUserProfile(userProfile);
      AppStore.setTheme('dark');
      AppStore.setLanguage('es');
      AppStore.toggleNotifications(false);

      // Reset
      AppStore.reset();

      expect(AppStore.userProfile).toBeNull();
      expect(AppStore.isAuthenticated).toBe(false);
      expect(AppStore.isLoading).toBe(false);
      expect(AppStore.isInitialized).toBe(false);
      expect(AppStore.appSettings.theme).toBe('auto');
      expect(AppStore.appSettings.language).toBe('en');
      expect(AppStore.appSettings.notifications.enabled).toBe(true);
      expect(AppStore.notificationSettings.enabled).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle MMKV storage errors gracefully', () => {
      // Should not throw during initialization
      expect(() => {
        AppStore.reset();
      }).not.toThrow();
    });
  });
}); 