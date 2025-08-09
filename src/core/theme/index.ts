import { Dimensions } from 'react-native';
import { LAYOUT_CONSTANTS } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Color Palette
export const COLORS = {
  // Primary Colors
  PRIMARY: '#007AFF',
  PRIMARY_DARK: '#0056CC',
  PRIMARY_LIGHT: '#4DA3FF',
  
  // Secondary Colors
  SECONDARY: '#4CAF50',
  SECONDARY_DARK: '#388E3C',
  SECONDARY_LIGHT: '#81C784',
  
  // Accent Colors
  ACCENT: '#FF6B35',
  ACCENT_DARK: '#E55A2B',
  ACCENT_LIGHT: '#FF8A65',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_50: '#FAFAFA',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#EEEEEE',
  GRAY_300: '#E0E0E0',
  GRAY_400: '#BDBDBD',
  GRAY_500: '#9E9E9E',
  GRAY_600: '#757575',
  GRAY_700: '#616161',
  GRAY_800: '#424242',
  GRAY_900: '#212121',
  
  // Status Colors
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
  
  // Background Colors
  BACKGROUND: '#F5F5F5',
  SURFACE: '#FFFFFF',
  CARD: '#FFFFFF',
  
  // Text Colors
  TEXT_PRIMARY: '#212121',
  TEXT_SECONDARY: '#757575',
  TEXT_DISABLED: '#BDBDBD',
  TEXT_INVERSE: '#FFFFFF',
  
  // Border Colors
  BORDER: '#E0E0E0',
  BORDER_LIGHT: '#F5F5F5',
  BORDER_DARK: '#BDBDBD',
  
  // Shadow Colors
  SHADOW: 'rgba(0, 0, 0, 0.1)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.2)',
  SHADOW_LIGHT: 'rgba(0, 0, 0, 0.05)',
  
  // Overlay Colors
  OVERLAY: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(0, 0, 0, 0.3)',
  
  // Brand Colors
  GOOGLE_BLUE: '#4285F4',
  GOOGLE_RED: '#EA4335',
  GOOGLE_YELLOW: '#FBBC05',
  GOOGLE_GREEN: '#34A853',
};

// Typography
export const TYPOGRAPHY = {
  FONT_FAMILY: {
    REGULAR: 'System',
    MEDIUM: 'System',
    BOLD: 'System',
    LIGHT: 'System',
  },
  
  FONT_SIZE: {
    ...LAYOUT_CONSTANTS.FONT_SIZE,
  },
  
  FONT_WEIGHT: {
    LIGHT: '300',
    REGULAR: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
  },
  
  LINE_HEIGHT: {
    TIGHT: 1.2,
    NORMAL: 1.4,
    RELAXED: 1.6,
    LOOSE: 1.8,
  },
  
  LETTER_SPACING: {
    TIGHT: -0.5,
    NORMAL: 0,
    WIDE: 0.5,
  },
};

// Spacing
export const SPACING = {
  ...LAYOUT_CONSTANTS.PADDING,
  ...LAYOUT_CONSTANTS.MARGIN,
};

// Border Radius
export const BORDER_RADIUS = {
  ...LAYOUT_CONSTANTS.BORDER_RADIUS,
  CIRCLE: 9999,
};

// Shadows
export const SHADOWS = {
  SMALL: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  LARGE: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  CARD: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  BUTTON: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
};

// Screen Dimensions
export const SCREEN = {
  WIDTH: screenWidth,
  HEIGHT: screenHeight,
  ASPECT_RATIO: screenWidth / screenHeight,
};

// Common Styles
export const COMMON_STYLES = {
  // Container styles
  CONTAINER: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  
  CENTERED: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  ROW: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  ROW_SPACE_BETWEEN: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  ROW_CENTER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Card styles
  CARD: {
    backgroundColor: COLORS.CARD,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    ...SHADOWS.CARD,
  },
  
  // Button styles
  BUTTON_PRIMARY: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.BUTTON,
  },
  
  BUTTON_SECONDARY: {
    backgroundColor: COLORS.SECONDARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.BUTTON,
  },
  
  BUTTON_OUTLINE: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  BUTTON_DISABLED: {
    backgroundColor: COLORS.GRAY_300,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input styles
  INPUT: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  
  INPUT_FOCUSED: {
    borderColor: COLORS.PRIMARY,
  },
  
  INPUT_ERROR: {
    borderColor: COLORS.ERROR,
  },
  
  // Text styles
  TEXT_PRIMARY: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
  },
  
  TEXT_SECONDARY: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.REGULAR,
  },
  
  TEXT_TITLE: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  
  TEXT_HEADER: {
    fontSize: TYPOGRAPHY.FONT_SIZE.HEADER,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
  },
  
  TEXT_BUTTON: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.WHITE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  
  TEXT_BUTTON_OUTLINE: {
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    color: COLORS.PRIMARY,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  
  // Status styles
  STATUS_SUCCESS: {
    backgroundColor: COLORS.SUCCESS,
    color: COLORS.WHITE,
  },
  
  STATUS_WARNING: {
    backgroundColor: COLORS.WARNING,
    color: COLORS.WHITE,
  },
  
  STATUS_ERROR: {
    backgroundColor: COLORS.ERROR,
    color: COLORS.WHITE,
  },
  
  STATUS_INFO: {
    backgroundColor: COLORS.INFO,
    color: COLORS.WHITE,
  },
};

// Theme object
export const THEME = {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  SCREEN,
  COMMON_STYLES,
};

export default THEME; 