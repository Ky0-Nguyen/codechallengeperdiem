import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../core';

export const loginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.XL,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'stretch',
  },
  rowInfo: {
    width: '100%',
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.HEADER,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XL,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: COLORS.GOOGLE_BLUE,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.MD,
    minHeight: 48,
    alignSelf: 'stretch',
    ...SHADOWS.BUTTON,
  },
  googleButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SPACING.MD,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.BORDER,
  },
  dividerText: {
    marginHorizontal: SPACING.MD,
    color: COLORS.TEXT_SECONDARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    width: '100%',
    marginBottom: SPACING.MD,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 48,
    alignSelf: 'stretch',
  },
  signInButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.MD,
    minHeight: 48,
    alignSelf: 'stretch',
    ...SHADOWS.BUTTON,
  },
  signInButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
  },
  disabledButton: {
    opacity: 0.6,
  },
  demoButton: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.SM,
  },
  demoButtonText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    textDecorationLine: 'underline',
  },
  switchModeButton: {
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.SM,
  },
  switchModeButtonText: {
    color: COLORS.PRIMARY,
    fontSize: TYPOGRAPHY.FONT_SIZE.MD,
    textDecorationLine: 'underline',
  },
}); 