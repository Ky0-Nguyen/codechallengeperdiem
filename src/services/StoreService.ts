import { StoreInfo, StoreHours, StoreOverride, TimeSlot } from '../types';
import ApiService, { StoreTime as ApiStoreTime, StoreOverride as ApiStoreOverride } from './ApiService';

class StoreService {
  private storeInfo: StoreInfo | null = null;
  private storeTimes: ApiStoreTime[] = [];
  private storeOverrides: ApiStoreOverride[] = [];
  private isInitialized = false;

  // Initialize store information from API
  async initializeStoreInfo() {
    try {
      // Fetch store times and overrides from API
      const [storeTimes, storeOverrides] = await Promise.all([
        ApiService.getStoreTimes(),
        ApiService.getStoreOverrides(),
      ]);

      this.storeTimes = storeTimes;
      this.storeOverrides = storeOverrides;

      // Convert API data to StoreInfo format
      this.storeInfo = {
        id: 'store-1',
        name: 'Perdiem Store',
        timezone: 'America/New_York',
        storeHours: this.convertApiStoreTimesToStoreHours(storeTimes),
        storeOverrides: this.convertApiStoreOverridesToStoreOverrides(storeOverrides),
      };

      this.isInitialized = true;
      console.log('Store service initialized with API data');
    } catch (error) {
      console.error('Error initializing store service:', error);
      // Fallback to mock data
      this.initializeWithMockData();
    }
  }

  // Initialize with mock data (fallback)
  private initializeWithMockData() {
    this.storeInfo = this.getMockStoreInfo();
    this.isInitialized = true;
    console.log('Store service initialized with mock data');
  }

  // Convert API store times to internal format
  private convertApiStoreTimesToStoreHours(apiStoreTimes: ApiStoreTime[]): StoreHours[] {
    return apiStoreTimes.map(apiTime => ({
      dayOfWeek: apiTime.dayOfWeek,
      openTime: apiTime.openTime,
      closeTime: apiTime.closeTime,
      isOpen: apiTime.isOpen,
    }));
  }

  // Convert API store overrides to internal format
  private convertApiStoreOverridesToStoreOverrides(apiOverrides: ApiStoreOverride[]): StoreOverride[] {
    return apiOverrides.map(apiOverride => ({
      date: this.convertDateToISOFormat(apiOverride.date),
      openTime: apiOverride.openTime,
      closeTime: apiOverride.closeTime,
      isOpen: apiOverride.isOpen,
      reason: apiOverride.reason,
    }));
  }

  // Convert MM/DD format to YYYY-MM-DD format
  private convertDateToISOFormat(dateString: string): string {
    const [month, day] = dateString.split('/');
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Initialize store information (legacy method for backward compatibility)
  initializeStoreInfo(storeInfo: StoreInfo) {
    this.storeInfo = storeInfo;
    this.isInitialized = true;
  }

  // Get store information
  getStoreInfo(): StoreInfo | null {
    return this.storeInfo;
  }

  // Check if service is initialized
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  // Refresh store data from API
  async refreshStoreData() {
    await this.initializeStoreInfo();
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

  // Get available time slots for a specific date
  getAvailableTimeSlots(date: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotDate = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        slotDate.setHours(hours, minutes, 0, 0);
        
        // Check if time slot is in the past for today
        const now = new Date();
        const isPast = date.toDateString() === now.toDateString() && slotDate < now;
        
        // Check if store is open for this time slot
        const isStoreOpen = this.isStoreOpen(date, { id: '', time, isAvailable: true, isSelected: false });
        
        slots.push({
          id: `${date.toISOString()}-${time}`,
          time,
          isAvailable: !isPast && isStoreOpen,
          isSelected: false,
        });
      }
    }
    
    return slots;
  }

  // Get store status for a specific date
  getStoreStatus(date: Date): { isOpen: boolean; message: string } {
    if (!this.storeInfo) {
      return { isOpen: true, message: 'Store is Open' };
    }

    const dayOfWeek = date.getDay();
    const dateString = date.toISOString().split('T')[0];
    
    // Check store overrides first
    const override = this.storeInfo.storeOverrides.find(o => o.date === dateString);
    
    if (override) {
      if (!override.isOpen) {
        return { 
          isOpen: false, 
          message: override.reason || 'Store is Closed' 
        };
      }
      return { isOpen: true, message: 'Store is Open' };
    }

    // Check regular store hours
    const storeHours = this.storeInfo.storeHours.find(h => h.dayOfWeek === dayOfWeek);
    if (!storeHours || !storeHours.isOpen) {
      return { isOpen: false, message: 'Store is Closed' };
    }
    
    return { isOpen: true, message: 'Store is Open' };
  }

  // Get store hours for a specific day
  getStoreHours(dayOfWeek: number): StoreHours | null {
    if (!this.storeInfo) return null;
    return this.storeInfo.storeHours.find(h => h.dayOfWeek === dayOfWeek) || null;
  }

  // Get store override for a specific date
  getStoreOverride(date: string): StoreOverride | null {
    if (!this.storeInfo) return null;
    return this.storeInfo.storeOverrides.find(o => o.date === date) || null;
  }

  // Mock data for testing
  getMockStoreInfo(): StoreInfo {
    return {
      id: 'store-1',
      name: 'Sample Store',
      timezone: 'America/New_York',
      storeHours: [
        { dayOfWeek: 0, openTime: '10:00', closeTime: '18:00', isOpen: true }, // Sunday
        { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Monday
        { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Tuesday
        { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Wednesday
        { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Thursday
        { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Friday
        { dayOfWeek: 6, openTime: '10:00', closeTime: '18:00', isOpen: true }, // Saturday
      ],
      storeOverrides: [
        {
          date: '2024-12-25',
          isOpen: false,
          reason: 'Christmas Day',
        },
        {
          date: '2024-12-24',
          openTime: '09:00',
          closeTime: '16:00',
          isOpen: true,
          reason: 'Christmas Eve - Early Closing',
        },
        {
          date: '2024-01-01',
          isOpen: false,
          reason: 'New Year\'s Day',
        },
      ],
    };
  }
}

export default new StoreService(); 