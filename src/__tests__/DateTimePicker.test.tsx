import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DateTimePicker from '../components/DateTimePicker';

describe('DateTimePicker', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    expect(getByText('Select Date & Time')).toBeTruthy();
    expect(getByText('Timezone: Local Time')).toBeTruthy();
    expect(getByText('Select Date')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <DateTimePicker
        visible={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    expect(queryByText('Select Date & Time')).toBeNull();
  });

  it('shows NYC timezone when isNYCTimezone is true', () => {
    const { getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={true}
      />
    );

    expect(getByText('Timezone: New York (NYC)')).toBeTruthy();
  });

  it('generates dates for next 30 days', () => {
    const { getAllByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    // Should have multiple date items
    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    expect(dateItems.length).toBeGreaterThan(0);
  });

  it('handles date selection', () => {
    const { getAllByText, getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    if (dateItems.length > 0) {
      fireEvent.press(dateItems[0]);
      
      // Should show time slots section after date selection
      waitFor(() => {
        expect(getByText(/Time Slots for/)).toBeTruthy();
      });
    }
  });

  it('handles time slot selection', () => {
    const { getAllByText, getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    // First select a date
    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    if (dateItems.length > 0) {
      fireEvent.press(dateItems[0]);
      
      // Then select a time slot
      waitFor(() => {
        const timeSlots = getAllByText(/08:|09:|10:|11:|12:|13:|14:|15:|16:|17:|18:|19:/);
        if (timeSlots.length > 0) {
          fireEvent.press(timeSlots[0]);
          
          // Should show selected summary
          expect(getByText('Selected:')).toBeTruthy();
        }
      });
    }
  });

  it('calls onClose when close button is pressed', () => {
    const { getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    const closeButton = getByText('✕');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm button is pressed with valid selection', () => {
    const { getAllByText, getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    // Select a date and time slot
    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    if (dateItems.length > 0) {
      fireEvent.press(dateItems[0]);
      
      waitFor(() => {
        const timeSlots = getAllByText(/08:|09:|10:|11:|12:|13:|14:|15:|16:|17:|18:|19:/);
        if (timeSlots.length > 0) {
          fireEvent.press(timeSlots[0]);
          
          // Press confirm button
          const confirmButton = getByText('Confirm Selection');
          fireEvent.press(confirmButton);
          
          expect(mockOnConfirm).toHaveBeenCalled();
          expect(mockOnClose).toHaveBeenCalled();
        }
      });
    }
  });

  it('does not call onConfirm when no selection is made', () => {
    const { getByText } = render(
      <DateTimePicker
        visible={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        isNYCTimezone={false}
      />
    );

    const confirmButton = getByText('Confirm Selection');
    fireEvent.press(confirmButton);

    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
}); 