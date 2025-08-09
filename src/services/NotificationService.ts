import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  TriggerType,
  AndroidColor,
  AndroidCategory,
} from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private channelId: string = 'default';

  constructor() {
    this.createDefaultChannel();
    this.setupEventListeners();
  }

  /**
   * Create default notification channel for Android
   */
  private async createDefaultChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: this.channelId,
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        vibrationPattern: [300, 500],
        lights: [AndroidColor.RED, 300, 600],
      });
    }
  }

  /**
   * Setup event listeners for notification interactions
   */
  private setupEventListeners() {
    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          // Handle notification press
          this.handleNotificationPress(detail.notification);
          break;
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification (background)', detail.notification);
          // Handle background notification press
          this.handleNotificationPress(detail.notification);
          break;
      }
    });
  }

  /**
   * Handle notification press events
   */
  private handleNotificationPress(notification: any) {
    // You can navigate to specific screens or perform actions based on notification data
    console.log('Notification pressed:', notification);
  }

  /**
   * Display a simple notification
   */
  async displayNotification(title: string, body: string, data?: any) {
    try {
      const notificationId = await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId: this.channelId,
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

      return notificationId;
    } catch (error) {
      console.error('Error displaying notification:', error);
      throw error;
    }
  }

  /**
   * Display a notification with custom styling
   */
  async displayCustomNotification(
    title: string,
    body: string,
    options: {
      bigText?: string;
      imageUrl?: string;
      category?: AndroidCategory;
      data?: any;
    } = {}
  ) {
    try {
      const androidStyle: any = {
        type: AndroidStyle.BIGTEXT,
        text: options.bigText || body,
      };

      if (options.imageUrl) {
        androidStyle.type = AndroidStyle.BIGPICTURE;
        androidStyle.picture = options.imageUrl;
      }

      const notificationId = await notifee.displayNotification({
        title,
        body,
        data: options.data,
        android: {
          channelId: this.channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: androidStyle,
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

      return notificationId;
    } catch (error) {
      console.error('Error displaying custom notification:', error);
      throw error;
    }
  }

  /**
   * Schedule a notification for a specific time
   */
  async scheduleNotification(
    title: string,
    body: string,
    trigger: {
      date?: Date;
      seconds?: number;
      repeats?: boolean;
    },
    data?: any
  ) {
    try {
      let triggerConfig: any = {};

      if (trigger.date) {
        triggerConfig = {
          type: TriggerType.TIMESTAMP,
          timestamp: trigger.date.getTime(),
        };
      } else if (trigger.seconds) {
        triggerConfig = {
          type: TriggerType.TIMESTAMP,
          timestamp: Date.now() + trigger.seconds * 1000,
        };
      }

      if (trigger.repeats) {
        triggerConfig.repeatFrequency = 'DAILY';
      }

      const notificationId = await notifee.createTriggerNotification(
        {
          title,
          body,
          data,
          android: {
            channelId: this.channelId,
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
        triggerConfig
      );

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel a specific notification
   */
  async cancelNotification(notificationId: string) {
    try {
      await notifee.cancelNotification(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications() {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications() {
    try {
      const notifications = await notifee.getTriggerNotifications();
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      throw error;
    }
  }

  /**
   * Request notification permissions
   */
  async requestPermissions() {
    try {
      const settings = await notifee.requestPermission();
      return settings;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      throw error;
    }
  }

  /**
   * Get current notification settings
   */
  async getNotificationSettings() {
    try {
      const settings = await notifee.getNotificationSettings();
      return settings;
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw error;
    }
  }

  /**
   * Create a custom notification channel
   */
  async createChannel(
    channelId: string,
    channelName: string,
    options: {
      importance?: AndroidImportance;
      sound?: string;
      vibration?: boolean;
      vibrationPattern?: number[];
      lights?: [AndroidColor, number, number];
    } = {}
  ) {
    if (Platform.OS === 'android') {
      try {
        await notifee.createChannel({
          id: channelId,
          name: channelName,
          importance: options.importance || AndroidImportance.HIGH,
          sound: options.sound || 'default',
          vibration: options.vibration !== false,
          vibrationPattern: options.vibrationPattern || [300, 500],
          lights: options.lights || [AndroidColor.RED, 300, 600],
        });
      } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
      }
    }
  }
}

export default new NotificationService(); 