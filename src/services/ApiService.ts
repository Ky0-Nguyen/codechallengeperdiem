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
  // Get store times (opening and closing hours by day of week)
  async getStoreTimes(): Promise<StoreTime[]> {
    try {
      const response = await apiClient.get<StoreTimesResponse>(API_CONFIG.ENDPOINTS.STORE_TIMES);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching store times:', error);
      // Return mock data as fallback
      return this.getMockStoreTimes();
    }
  }

  // Get store overrides (overrides for specific dates)
  async getStoreOverrides(): Promise<StoreOverride[]> {
    try {
      const response = await apiClient.get<StoreOverridesResponse>(API_CONFIG.ENDPOINTS.STORE_OVERRIDES);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching store overrides:', error);
      // Return mock data as fallback
      return this.getMockStoreOverrides();
    }
  }

  // Mock data for development/testing
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
}

export default new ApiService(); 