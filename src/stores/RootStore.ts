import { makeAutoObservable } from 'mobx';
import AppStore from './AppStore';
import CacheStore from './CacheStore';

class RootStore {
  appStore: AppStore;
  cacheStore: CacheStore;

  constructor() {
    this.appStore = AppStore;
    this.cacheStore = CacheStore;
    makeAutoObservable(this);
  }

  // Initialize all stores
  async initialize(): Promise<void> {
    try {
      // Wait for app store to initialize
      while (!this.appStore.isInitialized) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Clean expired cache on app start
      this.cacheStore.cleanExpired();

      console.log('Root store initialized successfully');
    } catch (error) {
      console.error('Error initializing root store:', error);
    }
  }

  // Reset all stores (for logout or testing)
  reset(): void {
    this.appStore.reset();
    this.cacheStore.clear();
  }

  // Get store statistics
  get statistics() {
    return {
      app: {
        isInitialized: this.appStore.isInitialized,
        isAuthenticated: this.appStore.isAuthenticated,
        userProfile: this.appStore.userProfile ? 'Set' : 'Not set',
        theme: this.appStore.currentTheme,
        language: this.appStore.appSettings.language,
      },
      cache: this.cacheStore.statistics,
    };
  }
}

export default new RootStore(); 