import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../core';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  greeting: {
    fontSize: TYPOGRAPHY.FONT_SIZE.TITLE,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  userName: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  currentTime: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  timezoneToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timezoneLabel: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    ...SHADOWS.SMALL,
  },
  logoutButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    ...SHADOWS.CARD,
  },
  statusLight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.XS,
  },
  statusText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  selectedAppointment: {
    backgroundColor: COLORS.INFO + '10', // Light blue background
    margin: SPACING.MD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },
  selectedTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.INFO,
    marginBottom: SPACING.XS,
  },
  selectedDateTime: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100, // Add padding to prevent content from being hidden behind the bottom button
  },
  section: {
    margin: SPACING.MD,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateItem: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.MD,
    marginRight: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    minWidth: 80,
    ...SHADOWS.CARD,
  },
  todayItem: {
    backgroundColor: COLORS.PRIMARY,
  },
  selectedDateItem: {
    backgroundColor: COLORS.SECONDARY,
  },
  dateDay: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  dateNumber: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  todayText: {
    color: COLORS.WHITE,
  },
  selectedDateText: {
    color: COLORS.WHITE,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    backgroundColor: COLORS.WHITE,
    padding: SPACING.SM,
    marginBottom: SPACING.XS,
    borderRadius: BORDER_RADIUS.SM,
    minWidth: '30%',
    alignItems: 'center',
    ...SHADOWS.SMALL,
  },
  unavailableTimeSlot: {
    backgroundColor: COLORS.GRAY_100,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.SECONDARY,
  },
  timeSlotText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_PRIMARY,
  },
  unavailableTimeSlotText: {
    color: COLORS.TEXT_DISABLED,
  },
  selectedTimeSlotText: {
    color: COLORS.WHITE,
  },
  confirmButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MD,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    ...SHADOWS.BUTTON,
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  quickBookingButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    marginBottom: SPACING.MD,
    ...SHADOWS.BUTTON,
  },
  quickBookingButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    ...SHADOWS.CARD,
  },
}); 