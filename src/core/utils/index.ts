import { Platform } from 'react-native';
import { DATE_CONSTANTS, GREETING_CONSTANTS, TIMEZONE_CONSTANTS } from '../constants';

// Date & Time Utilities
export const dateUtils = {
  /**
   * Format date to MM/DD format
   */
  formatDateMMDD: (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}`;
  },

  /**
   * Format date to YYYY-MM-DD format
   */
  formatDateISO: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  /**
   * Format time to HH:MM format
   */
  formatTime: (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Check if date is today
   */
  isToday: (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  /**
   * Check if date is in the past
   */
  isPast: (date: Date): boolean => {
    const now = new Date();
    return date < now;
  },

  /**
   * Get day name from date
   */
  getDayName: (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  },

  /**
   * Get formatted date string
   */
  getFormattedDate: (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  },

  /**
   * Generate array of dates for next N days
   */
  generateDateRange: (days: number = DATE_CONSTANTS.DAYS_AHEAD): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  },

  /**
   * Generate time slots for a given date
   */
  generateTimeSlots: (date: Date): string[] => {
    const slots: string[] = [];
    const { START_HOUR, END_HOUR, TIME_SLOT_INTERVAL } = DATE_CONSTANTS;
    
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += TIME_SLOT_INTERVAL) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    
    return slots;
  },
};

// Timezone Utilities
export const timezoneUtils = {
  /**
   * Get current timezone
   */
  getCurrentTimezone: (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },

  /**
   * Get time in specific timezone
   */
  getTimeInTimezone: (date: Date, timezone: string): Date => {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  },

  /**
   * Get NYC time
   */
  getNYCTime: (date: Date = new Date()): Date => {
    return new Date(date.toLocaleString('en-US', { timeZone: TIMEZONE_CONSTANTS.NYC_TIMEZONE }));
  },

  /**
   * Format time for display in specific timezone
   */
  formatTimeInTimezone: (date: Date, timezone: string): string => {
    return date.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  },
};

// Greeting Utilities
export const greetingUtils = {
  /**
   * Get greeting message based on NYC time
   */
  getGreetingMessage: (isNYCTimezone: boolean = false): string => {
    const now = new Date();
    const nycTime = timezoneUtils.getNYCTime(now);
    const hour = nycTime.getHours();
    const city = isNYCTimezone ? 'NYC' : 'your city';

    if (hour >= GREETING_CONSTANTS.MORNING_START && hour < GREETING_CONSTANTS.MORNING_END) {
      return `Good Morning, ${city}!`;
    } else if (hour >= GREETING_CONSTANTS.LATE_MORNING_START && hour < GREETING_CONSTANTS.LATE_MORNING_END) {
      return `Late Morning Vibes! ${city}`;
    } else if (hour >= GREETING_CONSTANTS.AFTERNOON_START && hour < GREETING_CONSTANTS.AFTERNOON_END) {
      return `Good Afternoon, ${city}!`;
    } else if (hour >= GREETING_CONSTANTS.EVENING_START && hour < GREETING_CONSTANTS.EVENING_END) {
      return `Good Evening, ${city}!`;
    } else {
      return `Night Owl in ${city}!`;
    }
  },
};

// Validation Utilities
export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  /**
   * Validate required field
   */
  isRequired: (value: string): boolean => {
    return value.trim().length > 0;
  },

  /**
   * Validate date is not in past
   */
  isNotPastDate: (date: Date): boolean => {
    return !dateUtils.isPast(date);
  },

  /**
   * Validate time slot is available
   */
  isTimeSlotAvailable: (date: Date, timeSlot: string): boolean => {
    if (dateUtils.isToday(date)) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const slotDate = new Date(date);
      slotDate.setHours(hours, minutes, 0, 0);
      return !dateUtils.isPast(slotDate);
    }
    return true;
  },
};

// String Utilities
export const stringUtils = {
  /**
   * Capitalize first letter
   */
  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * Truncate string to specified length
   */
  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str;
    return str.substring(0, length) + '...';
  },

  /**
   * Generate random string
   */
  generateId: (length: number = 8): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Format phone number
   */
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  },
};

// Array Utilities
export const arrayUtils = {
  /**
   * Remove duplicates from array
   */
  removeDuplicates: <T>(array: T[]): T[] => {
    return [...new Set(array)];
  },

  /**
   * Group array by key
   */
  groupBy: <T>(array: T[], key: keyof T): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Sort array by key
   */
  sortBy: <T>(array: T[], key: keyof T, ascending: boolean = true): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
};

// Platform Utilities
export const platformUtils = {
  /**
   * Check if platform is iOS
   */
  isIOS: Platform.OS === 'ios',

  /**
   * Check if platform is Android
   */
  isAndroid: Platform.OS === 'android',

  /**
   * Get platform-specific value
   */
  select: <T>(iosValue: T, androidValue: T): T => {
    return Platform.select({
      ios: iosValue,
      android: androidValue,
    }) || iosValue;
  },
};

// Storage Utilities
export const storageUtils = {
  /**
   * Safe JSON parse
   */
  safeJsonParse: <T>(value: string | null, defaultValue: T): T => {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  },

  /**
   * Safe JSON stringify
   */
  safeJsonStringify: (value: any): string => {
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  },
};

// Error Utilities
export const errorUtils = {
  /**
   * Get user-friendly error message
   */
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'An unexpected error occurred';
  },

  /**
   * Log error with context
   */
  logError: (error: any, context: string = ''): void => {
    console.error(`[${context}] Error:`, error);
  },
};

// Export all utilities
export const utils = {
  date: dateUtils,
  timezone: timezoneUtils,
  greeting: greetingUtils,
  validation: validationUtils,
  string: stringUtils,
  array: arrayUtils,
  platform: platformUtils,
  storage: storageUtils,
  error: errorUtils,
};

export default utils; 