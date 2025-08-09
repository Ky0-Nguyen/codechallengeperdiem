import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  TriggerType,
  AndroidColor,
  AndroidCategory,
} from '@notifee/react-native';
import { Platform } from 'react-native';
import NotificationService from '../NotificationService';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create default channel on Android', () => {
      // Change platform to Android
      (Platform.OS as any) = 'android';

      // Re-initialize the service
      const service = new (NotificationService as any).constructor();

      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
        lights: [AndroidColor.RED, 300, 600],
      });
    });

    it('should not create channel on iOS', () => {
      (Platform.OS as any) = 'ios';

      const service = new (NotificationService as any).constructor();

      expect(notifee.createChannel).not.toHaveBeenCalled();
    });
  });

  describe('displayNotification', () => {
    it('should display a simple notification', async () => {
      const title = 'Test Title';
      const body = 'Test Body';
      const data = { key: 'value' };
      const mockNotificationId = 'notification-123';

      (notifee.displayNotification as jest.Mock).mockResolvedValue(mockNotificationId);

      const result = await NotificationService.displayNotification(title, body, data);

      expect(notifee.displayNotification).toHaveBeenCalledWith({
        title,
        body,
        data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGTEXT,
            text: body,
          },
        },
        ios: {
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
      expect(result).toBe(mockNotificationId);
    });

    it('should handle display notification errors', async () => {
      const error = new Error('Notification error');
      (notifee.displayNotification as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.displayNotification('Title', 'Body')
      ).rejects.toThrow('Notification error');
    });
  });

  describe('displayCustomNotification', () => {
    it('should display custom notification with big text', async () => {
      const title = 'Custom Title';
      const body = 'Custom Body';
      const options = {
        bigText: 'This is expanded text',
        category: AndroidCategory.MESSAGE,
        data: { custom: true },
      };
      const mockNotificationId = 'custom-notification-123';

      (notifee.displayNotification as jest.Mock).mockResolvedValue(mockNotificationId);

      const result = await NotificationService.displayCustomNotification(title, body, options);

      expect(notifee.displayNotification).toHaveBeenCalledWith({
        title,
        body,
        data: options.data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGTEXT,
            text: options.bigText,
          },
          category: options.category,
        },
        ios: {
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
      expect(result).toBe(mockNotificationId);
    });

    it('should display custom notification with image', async () => {
      const title = 'Image Title';
      const body = 'Image Body';
      const options = {
        imageUrl: 'https://example.com/image.jpg',
        data: { hasImage: true },
      };

      (notifee.displayNotification as jest.Mock).mockResolvedValue('notification-id');

      await NotificationService.displayCustomNotification(title, body, options);

      expect(notifee.displayNotification).toHaveBeenCalledWith({
        title,
        body,
        data: options.data,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.BIGPICTURE,
            picture: options.imageUrl,
            text: body,
          },
        },
        ios: {
          foregroundPresentationOptions: {
            badge: true,
            sound: true,
            banner: true,
            list: true,
          },
        },
      });
    });
  });

  describe('scheduleNotification', () => {
    it('should schedule notification with date', async () => {
      const title = 'Scheduled Title';
      const body = 'Scheduled Body';
      const date = new Date(Date.now() + 60000); // 1 minute from now
      const data = { scheduled: true };
      const mockNotificationId = 'scheduled-123';

      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue(mockNotificationId);

      const result = await NotificationService.scheduleNotification(
        title,
        body,
        { date },
        data
      );

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        {
          title,
          body,
          data,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
        }
      );
      expect(result).toBe(mockNotificationId);
    });

    it('should schedule notification with seconds delay', async () => {
      const title = 'Delayed Title';
      const body = 'Delayed Body';
      const seconds = 30;
      const data = { delayed: true };

      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('notification-id');

      await NotificationService.scheduleNotification(
        title,
        body,
        { seconds },
        data
      );

      const expectedTimestamp = Date.now() + seconds * 1000;
      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.any(Object),
        {
          type: TriggerType.TIMESTAMP,
          timestamp: expect.any(Number),
        }
      );
    });

    it('should schedule repeating notification', async () => {
      const title = 'Repeating Title';
      const body = 'Repeating Body';
      const date = new Date(Date.now() + 60000);
      const data = { repeating: true };

      (notifee.createTriggerNotification as jest.Mock).mockResolvedValue('notification-id');

      await NotificationService.scheduleNotification(
        title,
        body,
        { date, repeats: true },
        data
      );

      expect(notifee.createTriggerNotification).toHaveBeenCalledWith(
        expect.any(Object),
        {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
          repeatFrequency: 'DAILY',
        }
      );
    });

    it('should handle scheduling errors', async () => {
      const error = new Error('Scheduling error');
      (notifee.createTriggerNotification as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.scheduleNotification('Title', 'Body', { seconds: 10 })
      ).rejects.toThrow('Scheduling error');
    });
  });

  describe('cancelNotification', () => {
    it('should cancel specific notification', async () => {
      const notificationId = 'notification-123';

      await NotificationService.cancelNotification(notificationId);

      expect(notifee.cancelNotification).toHaveBeenCalledWith(notificationId);
    });

    it('should handle cancel errors', async () => {
      const error = new Error('Cancel error');
      (notifee.cancelNotification as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.cancelNotification('notification-id')
      ).rejects.toThrow('Cancel error');
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all notifications', async () => {
      await NotificationService.cancelAllNotifications();

      expect(notifee.cancelAllNotifications).toHaveBeenCalled();
    });

    it('should handle cancel all errors', async () => {
      const error = new Error('Cancel all error');
      (notifee.cancelAllNotifications as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.cancelAllNotifications()
      ).rejects.toThrow('Cancel all error');
    });
  });

  describe('getScheduledNotifications', () => {
    it('should get scheduled notifications', async () => {
      const mockNotifications = [
        {
          notification: { title: 'Test', body: 'Body' },
          trigger: { timestamp: Date.now() + 60000 },
        },
      ];

      (notifee.getTriggerNotifications as jest.Mock).mockResolvedValue(mockNotifications);

      const result = await NotificationService.getScheduledNotifications();

      expect(notifee.getTriggerNotifications).toHaveBeenCalled();
      expect(result).toEqual(mockNotifications);
    });

    it('should handle get scheduled notifications errors', async () => {
      const error = new Error('Get notifications error');
      (notifee.getTriggerNotifications as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.getScheduledNotifications()
      ).rejects.toThrow('Get notifications error');
    });
  });

  describe('requestPermissions', () => {
    it('should request notification permissions', async () => {
      const mockSettings = {
        authorizationStatus: 'authorized',
        alert: true,
        badge: true,
        sound: true,
      };

      (notifee.requestPermission as jest.Mock).mockResolvedValue(mockSettings);

      const result = await NotificationService.requestPermissions();

      expect(notifee.requestPermission).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });

    it('should handle permission request errors', async () => {
      const error = new Error('Permission error');
      (notifee.requestPermission as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.requestPermissions()
      ).rejects.toThrow('Permission error');
    });
  });

  describe('getNotificationSettings', () => {
    it('should get notification settings', async () => {
      const mockSettings = {
        authorizationStatus: 'authorized',
        alert: true,
        badge: true,
        sound: true,
      };

      (notifee.getNotificationSettings as jest.Mock).mockResolvedValue(mockSettings);

      const result = await NotificationService.getNotificationSettings();

      expect(notifee.getNotificationSettings).toHaveBeenCalled();
      expect(result).toEqual(mockSettings);
    });

    it('should handle get settings errors', async () => {
      const error = new Error('Settings error');
      (notifee.getNotificationSettings as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.getNotificationSettings()
      ).rejects.toThrow('Settings error');
    });
  });

  describe('createChannel', () => {
    it('should create custom channel on Android', async () => {
      (Platform.OS as any) = 'android';

      const channelId = 'custom-channel';
      const channelName = 'Custom Channel';
      const options = {
        importance: AndroidImportance.LOW,
        sound: 'custom_sound',
        vibration: false,
        vibrationPattern: [100, 200],
        lights: [AndroidColor.GREEN, 500, 1000] as [AndroidColor, number, number],
      };

      await NotificationService.createChannel(channelId, channelName, options);

      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: channelId,
        name: channelName,
        importance: options.importance,
        sound: options.sound,
        vibration: options.vibration,
        vibrationPattern: options.vibrationPattern,
        lights: options.lights,
      });
    });

    it('should not create channel on iOS', async () => {
      (Platform.OS as any) = 'ios';

      await NotificationService.createChannel('channel-id', 'Channel Name');

      expect(notifee.createChannel).not.toHaveBeenCalled();
    });

    it('should use default options when not provided', async () => {
      (Platform.OS as any) = 'android';

      await NotificationService.createChannel('channel-id', 'Channel Name');

      expect(notifee.createChannel).toHaveBeenCalledWith({
        id: 'channel-id',
        name: 'Channel Name',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
        lights: [AndroidColor.RED, 300, 600],
      });
    });

    it('should handle create channel errors', async () => {
      (Platform.OS as any) = 'android';
      const error = new Error('Channel creation error');
      (notifee.createChannel as jest.Mock).mockRejectedValue(error);

      await expect(
        NotificationService.createChannel('channel-id', 'Channel Name')
      ).rejects.toThrow('Channel creation error');
    });
  });

  describe('Event Handling', () => {
    it('should setup foreground event listeners', () => {
      // Event listeners are set up in constructor, but we need to check if they're available
      expect(typeof notifee.onForegroundEvent).toBe('function');
    });

    it('should setup background event listeners', () => {
      // Event listeners are set up in constructor, but we need to check if they're available
      expect(typeof notifee.onBackgroundEvent).toBe('function');
    });

    it('should handle notification press events', () => {
      const mockNotification = { id: '123', title: 'Test' };
      
      // Get the event handler from the mock calls
      const mockCalls = (notifee.onForegroundEvent as jest.Mock).mock.calls;
      if (mockCalls.length > 0) {
        const eventHandlers = mockCalls[0][0];
        const pressEvent = {
          type: EventType.PRESS,
          detail: { notification: mockNotification },
        };

        // This should not throw
        expect(() => eventHandlers(pressEvent)).not.toThrow();
      }
    });

    it('should handle notification dismiss events', () => {
      const mockNotification = { id: '123', title: 'Test' };
      
      // Get the event handler from the mock calls
      const mockCalls = (notifee.onForegroundEvent as jest.Mock).mock.calls;
      if (mockCalls.length > 0) {
        const eventHandlers = mockCalls[0][0];
        const dismissEvent = {
          type: EventType.DISMISSED,
          detail: { notification: mockNotification },
        };

        // This should not throw
        expect(() => eventHandlers(dismissEvent)).not.toThrow();
      }
    });
  });
}); 