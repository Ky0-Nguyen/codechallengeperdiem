import { makeAutoObservable, runInAction } from 'mobx';
import MMKVStorage, { 
  AppSettings, 
  UserProfile, 
  NotificationSettings,
  STORAGE_KEYS 
} from '../services/MMKVStorage';
import FirebaseService from '../services/FirebaseService';
import { SelectedDateTime, TimeSlot, StoreInfo } from '../types';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

class AppStore {
  // App state
  isLoading = false;
  isInitialized = false;
  
  // User data
  userProfile: UserProfile | null = null;
  isAuthenticated = false;
  firebaseUser: FirebaseAuthTypes.User | null = null;
  
  // App settings
  appSettings: AppSettings = {
    theme: 'auto',
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
  
  // Notification settings
  notificationSettings: NotificationSettings = {
    enabled: true,
    sound: true,
    vibration: true,
    categories: {
      general: true,
      reminders: true,
      updates: true,
    },
  };

  // Appointment booking
  selectedDateTime: SelectedDateTime | null = null;
  isNYCTimezone = false;
  
  // Store information
  storeInfo: StoreInfo | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeStore();
    this.initializeFirebaseAuth();
  }

  // Initialize store from MMKV storage
  private async initializeStore() {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      // Load app settings
      const savedAppSettings = MMKVStorage.getAppSettings();
      if (savedAppSettings) {
        runInAction(() => {
          this.appSettings = { ...this.appSettings, ...savedAppSettings };
        });
      }

      // Load notification settings
      const savedNotificationSettings = MMKVStorage.getNotificationSettings();
      if (savedNotificationSettings) {
        runInAction(() => {
          this.notificationSettings = { ...this.notificationSettings, ...savedNotificationSettings };
        });
      }

      // Load user profile
      const savedUserProfile = MMKVStorage.getUserProfile();
      if (savedUserProfile) {
        runInAction(() => {
          this.userProfile = savedUserProfile;
          this.isAuthenticated = true;
        });
      }

      runInAction(() => {
        this.isInitialized = true;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error initializing app store:', error);
      runInAction(() => {
        this.isLoading = false;
        this.isInitialized = true;
      });
    }
  }

  // Initialize Firebase Authentication
  private initializeFirebaseAuth() {
    const unsubscribe = FirebaseService.onAuthStateChanged((user) => {
      runInAction(() => {
        this.firebaseUser = user;
        if (user) {
          // User is signed in
          this.isAuthenticated = true;
          this.userProfile = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'User',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            photoURL: user.photoURL || null,
            provider: user.providerData[0]?.providerId || 'email',
          };
          // Save to persistent storage
          MMKVStorage.setUserProfile(this.userProfile);
        } else {
          // User is signed out
          this.isAuthenticated = false;
          this.userProfile = null;
          MMKVStorage.delete(STORAGE_KEYS.USER_PROFILE);
        }
      });
    });

    // Return unsubscribe function for cleanup
    return unsubscribe;
  }

  // User actions
  setUserProfile(profile: UserProfile) {
    this.userProfile = profile;
    this.isAuthenticated = true;
    MMKVStorage.setUserProfile(profile);
  }

  // Firebase Authentication methods
  async signInWithEmail(email: string, password: string): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      await FirebaseService.signInWithEmail(email, password);
      // User profile will be set automatically by the auth state listener
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      await FirebaseService.signUpWithEmail(email, password);
      // User profile will be set automatically by the auth state listener
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async signInWithGoogle(): Promise<void> {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      await FirebaseService.signInWithGoogle();
      // User profile will be set automatically by the auth state listener
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  updateUserProfile(updates: Partial<UserProfile>) {
    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates };
      MMKVStorage.setUserProfile(this.userProfile);
    }
  }

  logout() {
    this.userProfile = null;
    this.isAuthenticated = false;
    this.firebaseUser = null;
    MMKVStorage.clearAuthToken();
    MMKVStorage.delete(STORAGE_KEYS.USER_PROFILE);
    // Sign out from Firebase
    FirebaseService.signOut();
  }

  // App settings actions
  updateAppSettings(updates: Partial<AppSettings>) {
    this.appSettings = { ...this.appSettings, ...updates };
    MMKVStorage.setAppSettings(this.appSettings);
  }

  setTheme(theme: 'light' | 'dark' | 'auto') {
    this.appSettings.theme = theme;
    MMKVStorage.setAppSettings(this.appSettings);
    MMKVStorage.setTheme(theme);
  }

  setLanguage(language: string) {
    this.appSettings.language = language;
    MMKVStorage.setAppSettings(this.appSettings);
    MMKVStorage.setLanguage(language);
  }

  toggleNotifications(enabled: boolean) {
    this.appSettings.notifications.enabled = enabled;
    this.notificationSettings.enabled = enabled;
    MMKVStorage.setAppSettings(this.appSettings);
    MMKVStorage.setNotificationSettings(this.notificationSettings);
  }

  // Notification settings actions
  updateNotificationSettings(updates: Partial<NotificationSettings>) {
    this.notificationSettings = { ...this.notificationSettings, ...updates };
    MMKVStorage.setNotificationSettings(this.notificationSettings);
  }

  toggleNotificationCategory(category: keyof NotificationSettings['categories']) {
    this.notificationSettings.categories[category] = !this.notificationSettings.categories[category];
    MMKVStorage.setNotificationSettings(this.notificationSettings);
  }

  // Privacy settings actions
  toggleAnalytics(enabled: boolean) {
    this.appSettings.privacy.analytics = enabled;
    MMKVStorage.setAppSettings(this.appSettings);
  }

  toggleCrashReports(enabled: boolean) {
    this.appSettings.privacy.crashReports = enabled;
    MMKVStorage.setAppSettings(this.appSettings);
  }

  // Appointment booking actions
  setSelectedDateTime(dateTime: SelectedDateTime) {
    this.selectedDateTime = dateTime;
  }

  clearSelectedDateTime() {
    this.selectedDateTime = null;
  }

  setNYCTimezone(isNYC: boolean) {
    this.isNYCTimezone = isNYC;
  }

  // Store information actions
  setStoreInfo(storeInfo: StoreInfo) {
    this.storeInfo = storeInfo;
  }

  // Check if store is open for a specific date and time
  isStoreOpen(date: Date, timeSlot: TimeSlot): boolean {
    if (!this.storeInfo) return true; // Default to open if no store info

    const dayOfWeek = date.getDay();
    const timeString = timeSlot.time;
    
    // Check store overrides first
    const dateString = date.toISOString().split('T')[0];
    const override = this.storeInfo.storeOverrides.find(o => o.date === dateString);
    
    if (override) {
      if (!override.isOpen) return false;
      if (override.openTime && override.closeTime) {
        return timeString >= override.openTime && timeString <= override.closeTime;
      }
    }

    // Check regular store hours
    const storeHours = this.storeInfo.storeHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!storeHours || !storeHours.isOpen) return false;
    
    return timeString >= storeHours.openTime && timeString <= storeHours.closeTime;
  }

  // Loading state actions
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // Computed properties
  get currentTheme(): 'light' | 'dark' {
    if (this.appSettings.theme === 'auto') {
      // You can implement system theme detection here
      return 'light';
    }
    return this.appSettings.theme;
  }

  get isNotificationsEnabled(): boolean {
    return this.appSettings.notifications.enabled && this.notificationSettings.enabled;
  }

  get userDisplayName(): string {
    return this.userProfile?.name || 'Guest';
  }

  get userEmail(): string {
    return this.userProfile?.email || '';
  }

  get currentTimezone(): string {
    return this.isNYCTimezone ? 'America/New_York' : Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  get greetingMessage(): string {
    const now = new Date();
    const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hour = nycTime.getHours();
    const city = this.isNYCTimezone ? 'NYC' : 'your city';

    if (hour >= 5 && hour < 10) {
      return `Good Morning, ${city}!`;
    } else if (hour >= 10 && hour < 12) {
      return `Late Morning Vibes! ${city}`;
    } else if (hour >= 12 && hour < 17) {
      return `Good Afternoon, ${city}!`;
    } else if (hour >= 17 && hour < 21) {
      return `Good Evening, ${city}!`;
    } else {
      return `Night Owl in ${city}!`;
    }
  }

  // Reset store (for testing or logout)
  reset() {
    this.userProfile = null;
    this.isAuthenticated = false;
    this.isLoading = false;
    this.isInitialized = false;
    this.selectedDateTime = null;
    this.isNYCTimezone = false;
    this.storeInfo = null;
    
    // Reset to default settings
    this.appSettings = {
      theme: 'auto',
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

    this.notificationSettings = {
      enabled: true,
      sound: true,
      vibration: true,
      categories: {
        general: true,
        reminders: true,
        updates: true,
      },
    };
  }

  // Initialize store (for testing)
  async initializeForTesting() {
    await this.initializeStore();
  }
}

export default new AppStore(); 