// Core module exports
export * from './constants';
export * from './theme';
export * from './utils';
export * from './hooks';

// Re-export commonly used items
export { default as THEME } from './theme';
export { default as utils } from './utils';
export { default as hooks } from './hooks';

// Export specific constants for easy access
export {
  APP_CONSTANTS,
  API_CONSTANTS,
  DATE_CONSTANTS,
  TIMEZONE_CONSTANTS,
  GREETING_CONSTANTS,
  STORE_CONSTANTS,
  AUTH_CONSTANTS,
  VALIDATION_CONSTANTS,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_CONSTANTS,
  LAYOUT_CONSTANTS,
} from './constants';

// Export theme components
export {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  SCREEN,
  COMMON_STYLES,
} from './theme';

// Export utility functions
export {
  dateUtils,
  timezoneUtils,
  greetingUtils,
  validationUtils,
  stringUtils,
  arrayUtils,
  platformUtils,
  storageUtils,
  errorUtils,
} from './utils';

// Export hooks
export {
  useLoading,
  useForm,
  useApi,
  useAppState,
  useTimezone,
  useDateSelection,
  useAlert,
  useModal,
  useKeyboard,
  useScrollPosition,
  useDebounce,
  usePrevious,
  useMounted,
  useNetworkStatus,
} from './hooks'; 