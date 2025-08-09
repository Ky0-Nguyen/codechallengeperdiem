/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @screen NotificationDemoScreen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import NotificationService from '../services/NotificationService';

const NotificationDemoScreen: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<string>('Unknown');
  const [scheduledNotifications, setScheduledNotifications] = useState<any[]>([]);

  useEffect(() => {
    checkPermissions();
    loadScheduledNotifications();
  }, []);

  const checkPermissions = async () => {
    try {
      const settings = await NotificationService.getNotificationSettings();
      setPermissionStatus(settings.authorizationStatus);
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await NotificationService.getScheduledNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const settings = await NotificationService.requestPermissions();
      setPermissionStatus(settings.authorizationStatus);
      Alert.alert(
        'Permissions',
        `Notification permissions: ${settings.authorizationStatus}`
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const showSimpleNotification = async () => {
    try {
      await NotificationService.displayNotification(
        'Simple Notification',
        'This is a simple notification from Notifee!',
        { type: 'simple', timestamp: Date.now() }
      );
      Alert.alert('Success', 'Simple notification sent!');
    } catch (error) {
      console.error('Error showing simple notification:', error);
      Alert.alert('Error', 'Failed to show notification');
    }
  };

  const showCustomNotification = async () => {
    try {
      await NotificationService.displayCustomNotification(
        'Custom Notification',
        'This is a custom notification with big text style!',
        {
          bigText: 'This is the expanded text that shows when you expand the notification. It can contain much more information than the regular body text.',
          category: Platform.OS === 'android' ? 'message' : undefined,
          data: { type: 'custom', timestamp: Date.now() },
        }
      );
      Alert.alert('Success', 'Custom notification sent!');
    } catch (error) {
      console.error('Error showing custom notification:', error);
      Alert.alert('Error', 'Failed to show custom notification');
    }
  };

  const scheduleNotification = async () => {
    try {
      const futureDate = new Date(Date.now() + 10 * 1000); // 10 seconds from now
      await NotificationService.scheduleNotification(
        'Scheduled Notification',
        'This notification was scheduled to appear 10 seconds after you pressed the button!',
        { date: futureDate },
        { type: 'scheduled', timestamp: Date.now() }
      );
      Alert.alert('Success', 'Notification scheduled for 10 seconds from now!');
      loadScheduledNotifications();
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  const scheduleRepeatingNotification = async () => {
    try {
      const futureDate = new Date(Date.now() + 30 * 1000); // 30 seconds from now
      await NotificationService.scheduleNotification(
        'Repeating Notification',
        'This notification will repeat daily!',
        { date: futureDate, repeats: true },
        { type: 'repeating', timestamp: Date.now() }
      );
      Alert.alert('Success', 'Repeating notification scheduled!');
      loadScheduledNotifications();
    } catch (error) {
      console.error('Error scheduling repeating notification:', error);
      Alert.alert('Error', 'Failed to schedule repeating notification');
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await NotificationService.cancelAllNotifications();
      Alert.alert('Success', 'All notifications cancelled!');
      loadScheduledNotifications();
    } catch (error) {
      console.error('Error cancelling notifications:', error);
      Alert.alert('Error', 'Failed to cancel notifications');
    }
  };

  const createCustomChannel = async () => {
    if (Platform.OS === 'android') {
      try {
        await NotificationService.createChannel(
          'custom-channel',
          'Custom Channel',
          {
            importance: 'high',
            sound: 'default',
            vibration: true,
            vibrationPattern: [300, 500, 300, 500],
            lights: ['red', 300, 600],
          }
        );
        Alert.alert('Success', 'Custom channel created!');
      } catch (error) {
        console.error('Error creating custom channel:', error);
        Alert.alert('Error', 'Failed to create custom channel');
      }
    } else {
      Alert.alert('Info', 'Custom channels are only available on Android');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifee Demo</Text>
        <Text style={styles.subtitle}>
          Test different notification features
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissions</Text>
        <Text style={styles.statusText}>
          Status: {permissionStatus}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermissions}
        >
          <Text style={styles.buttonText}>Request Permissions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Notifications</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={showSimpleNotification}
        >
          <Text style={styles.buttonText}>Show Simple Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={showCustomNotification}
        >
          <Text style={styles.buttonText}>Show Custom Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scheduled Notifications</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={scheduleNotification}
        >
          <Text style={styles.buttonText}>Schedule (10s delay)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={scheduleRepeatingNotification}
        >
          <Text style={styles.buttonText}>Schedule Repeating (Daily)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={cancelAllNotifications}
        >
          <Text style={styles.buttonText}>Cancel All Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advanced Features</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={createCustomChannel}
        >
          <Text style={styles.buttonText}>Create Custom Channel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Scheduled Notifications ({scheduledNotifications.length})
        </Text>
        {scheduledNotifications.length === 0 ? (
          <Text style={styles.emptyText}>No scheduled notifications</Text>
        ) : (
          scheduledNotifications.map((notification, index) => (
            <View key={index} style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                {notification.notification.title}
              </Text>
              <Text style={styles.notificationBody}>
                {notification.notification.body}
              </Text>
              <Text style={styles.notificationTime}>
                Trigger: {new Date(notification.trigger.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default NotificationDemoScreen; 