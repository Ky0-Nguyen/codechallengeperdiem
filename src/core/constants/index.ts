// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'CodeChallenge',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
};

// API Constants
export const API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Date & Time Constants
export const DATE_CONSTANTS = {
  DAYS_AHEAD: 30,
  TIME_SLOT_INTERVAL: 15, // minutes
  START_HOUR: 8, // 8 AM
  END_HOUR: 20, // 8 PM
  DATE_FORMAT: 'MM/DD',
  ISO_DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
  DISPLAY_TIME_FORMAT: 'HH:mm',
};

// Timezone Constants
export const TIMEZONE_CONSTANTS = {
  NYC_TIMEZONE: 'America/New_York',
  DEFAULT_TIMEZONE: 'UTC',
};

// Greeting Time Constants
export const GREETING_CONSTANTS = {
  MORNING_START: 5,
  MORNING_END: 10,
  LATE_MORNING_START: 10,
  LATE_MORNING_END: 12,
  AFTERNOON_START: 12,
  AFTERNOON_END: 17,
  EVENING_START: 17,
  EVENING_END: 21,
  NIGHT_START: 21,
  NIGHT_END: 5,
};

// Store Constants
export const STORE_CONSTANTS = {
  DEFAULT_STORE_ID: 'store-1',
  DEFAULT_STORE_NAME: 'Perdiem Store',
  DEFAULT_TIMEZONE: 'America/New_York',
};

// Authentication Constants
export const AUTH_CONSTANTS = {
  DEMO_EMAIL: 'user@tryperdiem.com',
  DEMO_PASSWORD: 'password',
  API_USERNAME: 'perdiem',
  API_PASSWORD: 'perdiem',
};

// Validation Constants
export const VALIDATION_CONSTANTS = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  AUTH_TOKEN: 'auth_token',
  APP_SETTINGS: 'app_settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  SELECTED_DATETIME: 'selected_datetime',
  TIMEZONE_PREFERENCE: 'timezone_preference',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Invalid credentials. Please try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 6 characters.',
  NO_DATE_SELECTED: 'Please select a date.',
  NO_TIME_SELECTED: 'Please select a time slot.',
  STORE_CLOSED: 'Store is currently closed.',
  PAST_TIME_SLOT: 'This time slot is in the past.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Animation Constants
export const ANIMATION_CONSTANTS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};

// Layout Constants
export const LAYOUT_CONSTANTS = {
  PADDING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  MARGIN: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  BORDER_RADIUS: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 24,
  },
  FONT_SIZE: {
    XS: 10,
    SM: 12,
    MD: 14,
    LG: 16,
    XL: 18,
    XXL: 20,
    TITLE: 24,
    HEADER: 28,
  },
}; 