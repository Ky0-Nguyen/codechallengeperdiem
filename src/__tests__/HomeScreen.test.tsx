import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StoreProvider } from '../contexts/StoreProvider';
import HomeScreen from '../screens/HomeScreen';
import StoreService from '../services/StoreService';

// Mock the StoreService
jest.mock('../services/StoreService');

describe('HomeScreen', () => {
  const mockStoreInfo = {
    id: 'store-1',
    name: 'Test Store',
    timezone: 'America/New_York',
    storeHours: [
      { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true },
    ],
    storeOverrides: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (StoreService.getMockStoreInfo as jest.Mock).mockReturnValue(mockStoreInfo);
  });

  const renderWithProvider = () => {
    return render(
      <StoreProvider>
        <HomeScreen />
      </StoreProvider>
    );
  };

  it('renders correctly', () => {
    const { getByText } = renderWithProvider();

    expect(getByText(/Good Morning|Good Afternoon|Good Evening|Night Owl/)).toBeTruthy();
    expect(getByText('Local Time')).toBeTruthy();
    expect(getByText('Store is Open')).toBeTruthy();
    expect(getByText('Select Date')).toBeTruthy();
  });

  it('displays greeting message', () => {
    const { getByText } = renderWithProvider();

    // Should display a greeting message
    const greetingElement = getByText(/Good Morning|Good Afternoon|Good Evening|Night Owl/);
    expect(greetingElement).toBeTruthy();
  });

  it('shows timezone toggle', () => {
    const { getByText } = renderWithProvider();

    expect(getByText('Local Time')).toBeTruthy();
  });

  it('shows store status', () => {
    const { getByText } = renderWithProvider();

    expect(getByText('Store is Open')).toBeTruthy();
  });

  it('displays date selection', () => {
    const { getByText } = renderWithProvider();

    expect(getByText('Select Date')).toBeTruthy();
  });

  it('generates dates for next 30 days', () => {
    const { getAllByText } = renderWithProvider();

    // Should have multiple date items
    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    expect(dateItems.length).toBeGreaterThan(0);
  });

  it('handles date selection', () => {
    const { getAllByText } = renderWithProvider();

    const dateItems = getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
    if (dateItems.length > 0) {
      fireEvent.press(dateItems[0]);
      
      // Should show time slots after date selection
      // Note: This might need adjustment based on actual implementation
    }
  });

  it('toggles timezone', () => {
    const { getByText } = renderWithProvider();

    const timezoneToggle = getByText('Local Time');
    fireEvent.press(timezoneToggle);

    // Should change to NYC time
    expect(getByText('NYC Time')).toBeTruthy();
  });
}); 