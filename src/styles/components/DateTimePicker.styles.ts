import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../core';

const { height: screenHeight } = Dimensions.get('window');

export const dateTimePickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    minHeight: screenHeight * 0.5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.GRAY_300,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: TYPOGRAPHY.FONT_SIZE.XXL,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.GRAY_100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_SECONDARY,
  },
  content: {
    flex: 1,
  },
  timezoneInfo: {
    backgroundColor: COLORS.GRAY_50,
    padding: SPACING.SM,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
  },
  timezoneText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
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
  summary: {
    backgroundColor: COLORS.INFO + '10', // Light blue background
    padding: SPACING.MD,
    margin: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.FONT_SIZE.SM,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
    color: COLORS.INFO,
    marginBottom: SPACING.XS,
  },
  summaryText: {
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    color: COLORS.TEXT_PRIMARY,
  },
  footer: {
    padding: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  confirmButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: 'center',
    ...SHADOWS.BUTTON,
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: TYPOGRAPHY.FONT_SIZE.LG,
    fontWeight: TYPOGRAPHY.FONT_WEIGHT.SEMIBOLD,
  },
  disabledButton: {
    backgroundColor: COLORS.GRAY_300,
  },
}); 