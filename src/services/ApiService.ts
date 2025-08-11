import axios from 'axios';
import { getApiConfig } from '../config/api';

// Get API configuration
const API_CONFIG = getApiConfig();

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Add request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    // Add basic auth headers
    config.auth = API_CONFIG.CREDENTIALS;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Types
export interface StoreTime {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // HH:MM format
  closeTime: string; // HH:MM format
  isOpen: boolean;
}

export interface StoreOverride {
  date: string; // MM/DD format
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
  isOpen: boolean;
  reason?: string;
}

// Mock API Response Types
interface MockStoreTimeResponse {
  id: string;
  day_of_week: number; // 1-7 (Monday-Sunday)
  is_open: boolean;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
}

interface MockStoreOverrideResponse {
  id: string;
  day: number;
  month: number;
  is_open: boolean;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
}

interface MockAuthResponse {
  token: string;
  success?: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface StoreTimesResponse {
  success: boolean;
  data: StoreTime[];
  message?: string;
}

export interface StoreOverridesResponse {
  success: boolean;
  data: StoreOverride[];
  message?: string;
}

// API Service Class
class ApiService {
  // Helper method to convert mock API day_of_week (1-7) to our format (0-6)
  private convertDayOfWeek(mockDayOfWeek: number): number {
    // Mock API: 1=Monday, 2=Tuesday, ..., 7=Sunday
    // Our format: 0=Sunday, 1=Monday, ..., 6=Saturday
    return mockDayOfWeek === 7 ? 0 : mockDayOfWeek;
  }

  // Helper method to convert mock API response to our StoreTime format
  private mapMockStoreTime(mockTime: MockStoreTimeResponse): StoreTime {
    return {
      dayOfWeek: this.convertDayOfWeek(mockTime.day_of_week),
      openTime: mockTime.start_time,
      closeTime: mockTime.end_time,
      isOpen: mockTime.is_open,
    };
  }

  // Helper method to convert mock API response to our StoreOverride format
  private mapMockStoreOverride(mockOverride: MockStoreOverrideResponse): StoreOverride {
    const dateString = `${mockOverride.month.toString().padStart(2, '0')}/${mockOverride.day.toString().padStart(2, '0')}`;
    
    return {
      date: dateString,
      openTime: mockOverride.start_time,
      closeTime: mockOverride.end_time,
      isOpen: mockOverride.is_open,
      reason: `Override for ${dateString}`,
    };
  }

  // Get store times (opening and closing hours by day of week)
  async getStoreTimes(): Promise<StoreTime[]> {
    try {
      const response = await apiClient.get<MockStoreTimeResponse[]>(API_CONFIG.ENDPOINTS.STORE_TIMES);
      
      // Map the mock API response to our format
      const storeTimes = response.data.map(mockTime => this.mapMockStoreTime(mockTime));
      
      // Filter out any invalid entries and sort by day of week
      return storeTimes
        .filter(time => time.openTime && time.closeTime) // Only include entries with valid times
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    } catch (error) {
      console.error('Error fetching store times:', error);
      // Return mock data as fallback
      return this.getMockStoreTimes();
    }
  }

  // Get store overrides (overrides for specific dates)
  async getStoreOverrides(): Promise<StoreOverride[]> {
    try {
      const response = await apiClient.get<MockStoreOverrideResponse[]>(API_CONFIG.ENDPOINTS.STORE_OVERRIDES);
      
      // Map the mock API response to our format
      const storeOverrides = response.data.map(mockOverride => this.mapMockStoreOverride(mockOverride));
      
      // Filter out any invalid entries
      return storeOverrides.filter(override => override.date);
    } catch (error) {
      console.error('Error fetching store overrides:', error);
      // Return mock data as fallback
      return this.getMockStoreOverrides();
    }
  }

  // Mock data for development/testing (fallback)
  private getMockStoreTimes(): StoreTime[] {
    return [
      { dayOfWeek: 0, openTime: '10:00', closeTime: '18:00', isOpen: true }, // Sunday
      { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Monday
      { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Tuesday
      { dayOfWeek: 3, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Wednesday
      { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Thursday
      { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00', isOpen: true }, // Friday
      { dayOfWeek: 6, openTime: '10:00', closeTime: '18:00', isOpen: true }, // Saturday
    ];
  }

  private getMockStoreOverrides(): StoreOverride[] {
    const currentYear = new Date().getFullYear();
    return [
      {
        date: '12/25',
        isOpen: false,
        reason: 'Christmas Day',
      },
      {
        date: '12/24',
        openTime: '09:00',
        closeTime: '16:00',
        isOpen: true,
        reason: 'Christmas Eve - Early Closing',
      },
      {
        date: '01/01',
        isOpen: false,
        reason: 'New Year\'s Day',
      },
      {
        date: '07/04',
        isOpen: false,
        reason: 'Independence Day',
      },
      {
        date: '11/28',
        openTime: '10:00',
        closeTime: '16:00',
        isOpen: true,
        reason: 'Black Friday - Special Hours',
      },
    ];
  }

  // Helper method to check if a specific date has an override
  async getStoreOverrideForDate(date: Date): Promise<StoreOverride | null> {
    try {
      const overrides = await this.getStoreOverrides();
      const dateString = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
      
      return overrides.find(override => override.date === dateString) || null;
    } catch (error) {
      console.error('Error checking store override for date:', error);
      return null;
    }
  }

  // Helper method to get store hours for a specific day
  async getStoreHoursForDay(dayOfWeek: number): Promise<StoreTime | null> {
    try {
      const storeTimes = await this.getStoreTimes();
      return storeTimes.find(time => time.dayOfWeek === dayOfWeek) || null;
    } catch (error) {
      console.error('Error getting store hours for day:', error);
      return null;
    }
  }

  // Authentication method using mock API
  async authenticate(email: string, password: string): Promise<MockAuthResponse> {
    try {
      const response = await apiClient.post<MockAuthResponse>(API_CONFIG.ENDPOINTS.AUTH, {
        email,
        password,
      });
      
      // Create a user profile from the email since the API only returns a token
      const userProfile = {
        success: true,
        token: response.data.token,
        user: {
          id: `user-${Date.now()}`,
          email: email,
          name: email.split('@')[0],
        },
      };
      
      return userProfile;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
}

export default new ApiService(); 