/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component NotificationExample
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NotificationService from '../services/NotificationService';

interface NotificationExampleProps {
  title?: string;
  onNotificationSent?: () => void;
}

const NotificationExample: React.FC<NotificationExampleProps> = ({
  title = 'Send Notification',
  onNotificationSent,
}) => {
  const handleSendNotification = async () => {
    try {
      await NotificationService.displayNotification(
        'Example Notification',
        'This notification was sent from a component!',
        {
          component: 'NotificationExample',
          timestamp: Date.now(),
        }
      );
      
      Alert.alert('Success', 'Notification sent successfully!');
      onNotificationSent?.();
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const handleScheduleReminder = async () => {
    try {
      const reminderTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      
      await NotificationService.scheduleNotification(
        'Reminder',
        'This is your scheduled reminder!',
        { date: reminderTime },
        {
          type: 'reminder',
          scheduledAt: Date.now(),
        }
      );
      
      Alert.alert('Success', 'Reminder scheduled for 5 minutes from now!');
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Example</Text>
      
      <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleScheduleReminder}>
        <Text style={styles.buttonText}>Schedule Reminder (5 min)</Text>
      </TouchableOpacity>
      
      <Text style={styles.description}>
        This component demonstrates how to integrate notifications into your app components.
        You can customize the notification content and timing based on your app's needs.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 15,
    lineHeight: 18,
  },
});

export default NotificationExample; 