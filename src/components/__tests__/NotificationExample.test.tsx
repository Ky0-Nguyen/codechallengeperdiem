import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NotificationExample from '../NotificationExample';
import NotificationService from '../../services/NotificationService';

jest.mock('../../services/NotificationService');
// React Native is already mocked in jest.setup.js

const mockNotificationService = NotificationService as jest.Mocked<typeof NotificationService>;

describe('NotificationExample', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotificationService.displayNotification.mockResolvedValue('notification-id');
    mockNotificationService.scheduleNotification.mockResolvedValue('scheduled-id');
  });

  describe('Rendering', () => {
    it('should render with default title', () => {
      const { getByText } = render(<NotificationExample />);
      
      expect(getByText('Notification Example')).toBeTruthy();
      expect(getByText('Send Notification')).toBeTruthy();
      expect(getByText('Schedule Reminder (5 min)')).toBeTruthy();
    });

    it('should render with custom title', () => {
      const { getByText } = render(<NotificationExample title="Custom Title" />);
      
      expect(getByText('Custom Title')).toBeTruthy();
    });

    it('should render description text', () => {
      const { getByText } = render(<NotificationExample />);
      
      expect(getByText(/This component demonstrates/)).toBeTruthy();
    });
  });

  describe('Send Notification', () => {
    it('should send notification when button is pressed', async () => {
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(mockNotificationService.displayNotification).toHaveBeenCalledWith(
          'Hello!',
          'This is a test notification from the example component.',
          { source: 'NotificationExample' }
        );
      });
    });

    it('should show success alert when notification is sent', async () => {
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          'Notification sent successfully!',
          expect.any(Array)
        );
      });
    });

    it('should show error alert when notification fails', async () => {
      const error = new Error('Notification failed');
      mockNotificationService.displayNotification.mockRejectedValue(error);
      
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to send notification: Notification failed',
          expect.any(Array)
        );
      });
    });
  });

  describe('Schedule Reminder', () => {
    it('should schedule reminder when button is pressed', async () => {
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Schedule Reminder (5 min)');

      fireEvent.press(button);

      await waitFor(() => {
        expect(mockNotificationService.scheduleNotification).toHaveBeenCalledWith(
          'Reminder',
          'This is your scheduled reminder!',
          { seconds: 300 },
          { source: 'NotificationExample', type: 'reminder' }
        );
      });
    });

    it('should show success alert when reminder is scheduled', async () => {
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Schedule Reminder (5 min)');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          'Reminder scheduled for 5 minutes from now!',
          expect.any(Array)
        );
      });
    });

    it('should show error alert when scheduling fails', async () => {
      const error = new Error('Scheduling failed');
      mockNotificationService.scheduleNotification.mockRejectedValue(error);
      
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Schedule Reminder (5 min)');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to schedule reminder: Scheduling failed',
          expect.any(Array)
        );
      });
    });
  });

  describe('Component Integration', () => {
    it('should call onNotificationSent callback when notification is sent', async () => {
      const mockCallback = jest.fn();
      const { getByText } = render(
        <NotificationExample onNotificationSent={mockCallback} />
      );
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalled();
      });
    });

    it('should not call onNotificationSent callback when notification fails', async () => {
      const mockCallback = jest.fn();
      const error = new Error('Notification failed');
      mockNotificationService.displayNotification.mockRejectedValue(error);
      
      const { getByText } = render(
        <NotificationExample onNotificationSent={mockCallback} />
      );
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle notification service errors gracefully', async () => {
      const error = new Error('Service unavailable');
      mockNotificationService.displayNotification.mockRejectedValue(error);
      
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Send Notification');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to send notification: Service unavailable',
          expect.any(Array)
        );
      });
    });

    it('should handle scheduling service errors gracefully', async () => {
      const error = new Error('Scheduling service unavailable');
      mockNotificationService.scheduleNotification.mockRejectedValue(error);
      
      const { getByText } = render(<NotificationExample />);
      const button = getByText('Schedule Reminder (5 min)');

      fireEvent.press(button);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Failed to schedule reminder: Scheduling service unavailable',
          expect.any(Array)
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      const { getByText } = render(<NotificationExample />);
      
      const sendButton = getByText('Send Notification');
      const scheduleButton = getByText('Schedule Reminder (5 min)');
      
      expect(sendButton).toBeTruthy();
      expect(scheduleButton).toBeTruthy();
    });
  });

  describe('Props Validation', () => {
    it('should work without optional props', () => {
      const { getByText } = render(<NotificationExample />);
      
      expect(getByText('Send Notification')).toBeTruthy();
      expect(getByText('Schedule Reminder (5 min)')).toBeTruthy();
    });

    it('should work with all optional props', () => {
      const mockCallback = jest.fn();
      const { getByText } = render(
        <NotificationExample 
          title="Custom Title" 
          onNotificationSent={mockCallback} 
        />
      );
      
      expect(getByText('Custom Title')).toBeTruthy();
    });
  });
}); 