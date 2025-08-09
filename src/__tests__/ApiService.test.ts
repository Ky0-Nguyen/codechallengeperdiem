import ApiService from '../services/ApiService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getStoreTimes', () => {
    it('should fetch store times successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isOpen: true },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await ApiService.getStoreTimes();

      expect(mockedAxios.get).toHaveBeenCalledWith('/store-times');
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should return mock data when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await ApiService.getStoreTimes();

      expect(result).toHaveLength(7); // Mock data has 7 days
      expect(result[0]).toHaveProperty('dayOfWeek', 0);
      expect(result[0]).toHaveProperty('isOpen', true);
    });
  });

  describe('getStoreOverrides', () => {
    it('should fetch store overrides successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { date: '12/25', isOpen: false, reason: 'Christmas Day' },
            { date: '12/24', openTime: '09:00', closeTime: '16:00', isOpen: true, reason: 'Christmas Eve' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await ApiService.getStoreOverrides();

      expect(mockedAxios.get).toHaveBeenCalledWith('/store-overrides');
      expect(result).toEqual(mockResponse.data.data);
    });

    it('should return mock data when API call fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await ApiService.getStoreOverrides();

      expect(result).toHaveLength(5); // Mock data has 5 overrides
      expect(result[0]).toHaveProperty('date', '12/25');
      expect(result[0]).toHaveProperty('isOpen', false);
    });
  });

  describe('getStoreOverrideForDate', () => {
    it('should find override for specific date', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { date: '12/25', isOpen: false, reason: 'Christmas Day' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const testDate = new Date('2024-12-25');
      const result = await ApiService.getStoreOverrideForDate(testDate);

      expect(result).toEqual({ date: '12/25', isOpen: false, reason: 'Christmas Day' });
    });

    it('should return null when no override exists for date', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { date: '12/25', isOpen: false, reason: 'Christmas Day' },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const testDate = new Date('2024-12-26'); // No override for this date
      const result = await ApiService.getStoreOverrideForDate(testDate);

      expect(result).toBeNull();
    });
  });

  describe('getStoreHoursForDay', () => {
    it('should find store hours for specific day', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true },
            { dayOfWeek: 2, openTime: '09:00', closeTime: '20:00', isOpen: true },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await ApiService.getStoreHoursForDay(1);

      expect(result).toEqual({ dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true });
    });

    it('should return null when no hours exist for day', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '20:00', isOpen: true },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await ApiService.getStoreHoursForDay(7); // No hours for day 7

      expect(result).toBeNull();
    });
  });
}); 