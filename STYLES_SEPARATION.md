# Styles Separation Documentation

This document describes the separation of styles from components into dedicated style files.

## Overview

Styles have been separated from components to improve:
- **Maintainability**: Easier to manage and update styles
- **Reusability**: Styles can be shared between components
- **Readability**: Components focus on logic, styles focus on appearance
- **Consistency**: Centralized styling using core theme constants

## Structure

```
src/styles/
├── index.ts                    # Main exports
├── screens/                    # Screen-specific styles
│   ├── LoginScreen.styles.ts
│   └── HomeScreen.styles.ts
└── components/                 # Component-specific styles
    └── DateTimePicker.styles.ts
```

## Style Files Created

### 1. **LoginScreen.styles.ts**
- Container and layout styles
- Form input styles
- Button styles (Google, Sign In, Demo)
- Divider and spacing styles
- Typography styles

### 2. **HomeScreen.styles.ts**
- Header and navigation styles
- Store status indicator styles
- Date selection styles
- Time slot styles
- Quick booking button styles
- Appointment display styles

### 3. **DateTimePicker.styles.ts**
- Modal overlay styles
- Bottom sheet styles
- Date picker styles
- Time slot styles
- Summary and confirmation styles

## Usage

### Import Styles
```typescript
// Import specific styles
import { loginScreenStyles } from '../styles';

// Or import all styles
import { loginScreenStyles, homeScreenStyles } from '../styles';
```

### Apply Styles
```typescript
// Before (inline styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

// After (separated styles)
import { loginScreenStyles } from '../styles';

<View style={loginScreenStyles.container}>
```

## Benefits

### 1. **Separation of Concerns**
- Components focus on logic and behavior
- Style files focus on appearance and layout
- Easier to maintain and debug

### 2. **Theme Integration**
- All styles use core theme constants
- Consistent colors, spacing, and typography
- Easy to update theme globally

### 3. **Reusability**
- Common styles can be shared
- Consistent styling across components
- Reduced code duplication

### 4. **Maintainability**
- Centralized style management
- Easy to update specific components
- Better organization

## Style Naming Convention

### Component Styles
```typescript
export const componentNameStyles = StyleSheet.create({
  // Styles here
});
```

### Style Categories
- **Layout**: container, wrapper, content
- **Typography**: title, subtitle, text, label
- **Interactive**: button, input, touchable
- **Status**: active, disabled, selected, error
- **Spacing**: margin, padding, gap

## Theme Integration

All styles use the core theme constants:

```typescript
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../core';

export const componentStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.CARD,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
});
```

## Migration Guide

### Before (Inline Styles)
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Component = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

### After (Separated Styles)
```typescript
// Component file
import React from 'react';
import { View, Text } from 'react-native';
import { componentStyles } from '../styles';

const Component = () => {
  return (
    <View style={componentStyles.container}>
      <Text style={componentStyles.title}>Hello World</Text>
    </View>
  );
};

// Style file (Component.styles.ts)
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../core';

export const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
});
```

## Best Practices

### 1. **Use Theme Constants**
- Always use `COLORS`, `SPACING`, `TYPOGRAPHY` from core
- Avoid hardcoded values
- Maintain consistency across the app

### 2. **Organize Styles Logically**
- Group related styles together
- Use descriptive names
- Follow naming conventions

### 3. **Keep Components Clean**
- Remove StyleSheet imports from components
- Focus on logic and behavior
- Import styles from dedicated files

### 4. **Use Conditional Styles**
```typescript
// Good
style={[
  componentStyles.button,
  isActive && componentStyles.buttonActive,
  isDisabled && componentStyles.buttonDisabled,
]}

// Avoid
style={{
  ...ComponentStyles.button,
  backgroundColor: isActive ? 'green' : 'blue',
}}
```

### 5. **Document Complex Styles**
```typescript
// Add comments for complex styles
export const componentStyles = StyleSheet.create({
  // Complex layout with multiple flex properties
  complexLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // ... more properties
  },
});
```

## Future Enhancements

### Planned Features
- **Style Components**: Reusable styled components
- **Dynamic Themes**: Theme switching capabilities
- **Style Validation**: TypeScript validation for styles
- **Style Testing**: Unit tests for styles
- **Style Documentation**: Auto-generated style documentation

### Technical Improvements
- **Style Optimization**: Performance optimizations
- **Style Caching**: Cached style calculations
- **Style Analytics**: Usage analytics for styles
- **Style Migration**: Automated migration tools

## File Structure

```
src/
├── styles/
│   ├── index.ts
│   ├── screens/
│   │   ├── LoginScreen.styles.ts
│   │   ├── HomeScreen.styles.ts
│   │   └── [OtherScreen].styles.ts
│   ├── components/
│   │   ├── DateTimePicker.styles.ts
│   │   ├── Button.styles.ts
│   │   └── [OtherComponent].styles.ts
│   └── common/
│       ├── layout.styles.ts
│       ├── typography.styles.ts
│       └── forms.styles.ts
├── core/
│   ├── theme/
│   ├── constants/
│   └── utils/
└── components/
    └── [Component files without styles]
```

## Summary

The styles separation provides:
- ✅ **Better Organization**: Styles are in dedicated files
- ✅ **Theme Integration**: All styles use core theme constants
- ✅ **Maintainability**: Easier to update and manage styles
- ✅ **Reusability**: Styles can be shared between components
- ✅ **Consistency**: Uniform styling across the app
- ✅ **Readability**: Cleaner component files

This structure makes the codebase more maintainable and scalable while ensuring consistent styling throughout the application. 