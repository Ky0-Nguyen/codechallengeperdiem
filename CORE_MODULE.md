# Core Module Documentation

This document describes the core module structure and how to use the centralized constants, theme, utilities, and hooks.

## Overview

The core module (`src/core/`) provides a centralized location for:
- **Constants**: App-wide constants and configuration
- **Theme**: Colors, typography, spacing, and common styles
- **Utils**: Reusable utility functions
- **Hooks**: Custom React hooks for common functionality

## Structure

```
src/core/
├── index.ts          # Main exports
├── constants/        # App constants
│   └── index.ts
├── theme/           # Theme and styling
│   └── index.ts
├── utils/           # Utility functions
│   └── index.ts
└── hooks/           # Custom hooks
    └── index.ts
```

## Usage

### Import from Core Module

```typescript
// Import everything
import { COLORS, utils, hooks } from '../core';

// Import specific items
import { 
  COLORS, 
  SPACING, 
  dateUtils, 
  useForm, 
  useLoading 
} from '../core';

// Import theme
import { THEME } from '../core';
```

## Constants (`src/core/constants/`)

### Available Constants

#### App Constants
```typescript
APP_CONSTANTS = {
  APP_NAME: 'CodeChallenge',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
}
```

#### API Constants
```typescript
API_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

#### Date & Time Constants
```typescript
DATE_CONSTANTS = {
  DAYS_AHEAD: 30,
  TIME_SLOT_INTERVAL: 15,
  START_HOUR: 8,
  END_HOUR: 20,
  DATE_FORMAT: 'MM/DD',
  ISO_DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
}
```

#### Timezone Constants
```typescript
TIMEZONE_CONSTANTS = {
  NYC_TIMEZONE: 'America/New_York',
  DEFAULT_TIMEZONE: 'UTC',
}
```

#### Greeting Constants
```typescript
GREETING_CONSTANTS = {
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
}
```

#### Error & Success Messages
```typescript
ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Invalid credentials. Please try again.',
  // ... more error messages
}

SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  APPOINTMENT_CONFIRMED: 'Appointment confirmed successfully!',
  // ... more success messages
}
```

## Theme (`src/core/theme/`)

### Color Palette

```typescript
COLORS = {
  // Primary Colors
  PRIMARY: '#007AFF',
  PRIMARY_DARK: '#0056CC',
  PRIMARY_LIGHT: '#4DA3FF',
  
  // Secondary Colors
  SECONDARY: '#4CAF50',
  SECONDARY_DARK: '#388E3C',
  SECONDARY_LIGHT: '#81C784',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#FAFAFA',
  GRAY_100: '#F5F5F5',
  // ... more gray shades
  
  // Status Colors
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  
  // Text Colors
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  TEXT_DISABLED: '#BDBDBD',
  TEXT_INVERSE: '#FFFFFF',
}
```

### Typography

```typescript
TYPOGRAPHY = {
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
  FONT_WEIGHT: {
    LIGHT: '300',
    REGULAR: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
  },
}
```

### Spacing & Layout

```typescript
SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
}

BORDER_RADIUS = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
  CIRCLE: 9999,
}
```

### Common Styles

```typescript
COMMON_STYLES = {
  // Container styles
  CONTAINER: { flex: 1, backgroundColor: COLORS.BACKGROUND },
  CENTERED: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  ROW: { flexDirection: 'row', alignItems: 'center' },
  
  // Button styles
  BUTTON_PRIMARY: { backgroundColor: COLORS.PRIMARY, ... },
  BUTTON_SECONDARY: { backgroundColor: COLORS.SECONDARY, ... },
  BUTTON_OUTLINE: { backgroundColor: 'transparent', borderWidth: 1, ... },
  
  // Input styles
  INPUT: { backgroundColor: COLORS.WHITE, borderWidth: 1, ... },
  
  // Text styles
  TEXT_PRIMARY: { fontSize: TYPOGRAPHY.FONT_SIZE.MD, color: COLORS.TEXT_PRIMARY, ... },
  TEXT_TITLE: { fontSize: TYPOGRAPHY.FONT_SIZE.TITLE, fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD, ... },
}
```

## Utils (`src/core/utils/`)

### Date & Time Utils

```typescript
// Format dates
const formattedDate = dateUtils.formatDateMMDD(new Date()); // "12/25"
const isoDate = dateUtils.formatDateISO(new Date()); // "2024-12-25"
const time = dateUtils.formatTime(new Date()); // "14:30"

// Check dates
const isToday = dateUtils.isToday(date);
const isPast = dateUtils.isPast(date);

// Generate date ranges
const dates = dateUtils.generateDateRange(30); // Next 30 days
const timeSlots = dateUtils.generateTimeSlots(date); // Time slots for date
```

### Timezone Utils

```typescript
// Get timezone info
const currentTimezone = timezoneUtils.getCurrentTimezone();
const nycTime = timezoneUtils.getNYCTime();
const timeInZone = timezoneUtils.getTimeInTimezone(date, 'America/New_York');

// Format time in timezone
const formattedTime = timezoneUtils.formatTimeInTimezone(date, 'America/New_York');
```

### Greeting Utils

```typescript
// Get greeting message
const greeting = greetingUtils.getGreetingMessage(isNYCTimezone);
// Returns: "Good Morning, NYC!" or "Good Afternoon, your city!"
```

### Validation Utils

```typescript
// Validate inputs
const isValidEmail = validationUtils.isValidEmail(email);
const isValidPassword = validationUtils.isValidPassword(password);
const isRequired = validationUtils.isRequired(value);
const isNotPastDate = validationUtils.isNotPastDate(date);
const isTimeSlotAvailable = validationUtils.isTimeSlotAvailable(date, timeSlot);
```

### String Utils

```typescript
// String manipulation
const capitalized = stringUtils.capitalize('hello'); // "Hello"
const truncated = stringUtils.truncate('long text', 10); // "long text..."
const id = stringUtils.generateId(8); // Random 8-character string
const phone = stringUtils.formatPhoneNumber('1234567890'); // "(123) 456-7890"
```

### Array Utils

```typescript
// Array operations
const unique = arrayUtils.removeDuplicates(array);
const grouped = arrayUtils.groupBy(array, 'category');
const sorted = arrayUtils.sortBy(array, 'name', true);
const chunks = arrayUtils.chunk(array, 3);
```

### Platform Utils

```typescript
// Platform checks
const isIOS = platformUtils.isIOS;
const isAndroid = platformUtils.isAndroid;
const value = platformUtils.select(iosValue, androidValue);
```

### Error Utils

```typescript
// Error handling
const message = errorUtils.getErrorMessage(error);
errorUtils.logError(error, 'ComponentName');
```

## Hooks (`src/core/hooks/`)

### useLoading

```typescript
const { isLoading, startLoading, stopLoading, setLoading } = useLoading();

// Usage
startLoading();
try {
  await apiCall();
} finally {
  stopLoading();
}
```

### useForm

```typescript
const { 
  formData, 
  errors, 
  updateField, 
  updateForm, 
  resetForm, 
  validateForm 
} = useForm({
  email: '',
  password: '',
});

// Usage
updateField('email', 'user@example.com');
const isValid = validateForm({
  email: (value) => !value ? 'Email is required' : null,
  password: (value) => value.length < 6 ? 'Password too short' : null,
});
```

### useApi

```typescript
const { data, error, isLoading, execute, reset } = useApi();

// Usage
const result = await execute(() => apiService.getData());
```

### useTimezone

```typescript
const { 
  isNYCTimezone, 
  toggleTimezone, 
  getCurrentTime, 
  getGreetingMessage 
} = useTimezone();

// Usage
const time = getCurrentTime();
const greeting = getGreetingMessage();
```

### useDateSelection

```typescript
const { 
  selectedDate, 
  selectedTimeSlot, 
  selectDate, 
  selectTimeSlot, 
  clearSelection, 
  isSelectionComplete 
} = useDateSelection();

// Usage
selectDate(new Date());
selectTimeSlot('14:30');
const complete = isSelectionComplete();
```

### useAlert

```typescript
const { showAlert, showError, showSuccess, showConfirmation } = useAlert();

// Usage
showError('Something went wrong');
showSuccess('Operation completed');
showConfirmation('Delete item?', 'Are you sure?', onConfirm);
```

### useModal

```typescript
const { isVisible, show, hide, toggle } = useModal();

// Usage
show(); // Show modal
hide(); // Hide modal
toggle(); // Toggle modal
```

### useDebounce

```typescript
const debouncedValue = useDebounce(value, 500);

// Usage
const debouncedSearch = useDebounce(searchTerm, 300);
```

## Migration Guide

### Before (Old Way)
```typescript
// Hardcoded values everywhere
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
});

// Manual date formatting
const formattedDate = date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
});

// Manual validation
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
```

### After (New Way)
```typescript
import { COLORS, SPACING, BORDER_RADIUS, dateUtils, validationUtils } from '../core';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
  },
});

// Using utils
const formattedDate = dateUtils.getFormattedDate(date);
const isValidEmail = validationUtils.isValidEmail(email);
```

## Benefits

1. **Consistency**: All colors, spacing, and styles are centralized
2. **Maintainability**: Easy to update values across the entire app
3. **Reusability**: Common functions and hooks can be reused
4. **Type Safety**: Full TypeScript support with proper types
5. **Performance**: Optimized hooks and utilities
6. **Testing**: Easier to test with centralized logic

## Best Practices

1. **Always import from core**: Use `import { COLORS } from '../core'` instead of hardcoding values
2. **Use theme styles**: Leverage `COMMON_STYLES` for consistent styling
3. **Use utility functions**: Don't reinvent the wheel, use existing utils
4. **Use custom hooks**: For common state management patterns
5. **Keep constants updated**: When adding new features, update relevant constants
6. **Document new additions**: Add documentation for new utilities or hooks

## Future Enhancements

- **Dark Mode Support**: Theme switching capabilities
- **Internationalization**: Multi-language support
- **Accessibility**: Enhanced accessibility utilities
- **Performance Monitoring**: Built-in performance tracking
- **Analytics**: Centralized analytics utilities 