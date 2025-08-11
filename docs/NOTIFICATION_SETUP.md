# React Native Notifee Setup Guide

This guide explains how to set up and use React Native Notifee for push notifications in your project.

## Installation

The package has been installed and configured. Here's what was done:

1. **Installed Notifee package:**
   ```bash
   npm install @notifee/react-native
   ```

2. **iOS Setup:**
   - Ran `cd ios && pod install` to link native modules
   - Added notification permissions to `Info.plist`

3. **Android Setup:**
   - Auto-linked via React Native CLI

## Project Structure

```
src/
├── services/
│   └── NotificationService.ts    # Main notification service
└── screens/
    └── NotificationDemoScreen.tsx # Demo screen for testing
```

## Features Implemented

### NotificationService.ts
- **Permission Management**: Request and check notification permissions
- **Basic Notifications**: Display simple notifications
- **Custom Notifications**: Notifications with custom styling (big text, images)
- **Scheduled Notifications**: Schedule notifications for specific times
- **Repeating Notifications**: Daily/weekly repeating notifications
- **Notification Management**: Cancel specific or all notifications
- **Channel Management**: Create custom notification channels (Android)
- **Event Handling**: Handle notification press and dismiss events

### NotificationDemoScreen.tsx
- Interactive demo screen to test all notification features
- Permission status display
- Scheduled notifications list
- Buttons to test different notification types

## Usage Examples

### Basic Notification
```typescript
import NotificationService from './src/services/NotificationService';

// Display a simple notification
await NotificationService.displayNotification(
  'Hello!',
  'This is a test notification',
  { customData: 'value' }
);
```

### Scheduled Notification
```typescript
// Schedule notification for 10 seconds from now
const futureDate = new Date(Date.now() + 10 * 1000);
await NotificationService.scheduleNotification(
  'Scheduled Title',
  'Scheduled message',
  { date: futureDate },
  { type: 'scheduled' }
);
```

### Custom Notification with Big Text
```typescript
await NotificationService.displayCustomNotification(
  'Custom Title',
  'Short message',
  {
    bigText: 'This is the expanded text that shows when you expand the notification.',
    data: { type: 'custom' }
  }
);
```

### Request Permissions
```typescript
const settings = await NotificationService.requestPermissions();
console.log('Permission status:', settings.authorizationStatus);
```

## Platform-Specific Features

### iOS
- Foreground presentation options
- Background event handling
- Permission management

### Android
- Custom notification channels
- Different notification styles (BigText, BigPicture)
- Vibration patterns and LED lights
- Notification categories

## Testing

1. **Run the app:**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

2. **Test Features:**
   - Request notification permissions
   - Show simple notifications
   - Show custom notifications with big text
   - Schedule notifications (10s delay)
   - Schedule repeating notifications
   - Cancel all notifications
   - Create custom channels (Android only)

## Important Notes

### iOS
- Notifications work in foreground, background, and when app is closed
- Permission is required for notifications to work
- Foreground notifications are displayed by default

### Android
- Notification channels are required for Android 8.0+
- Different importance levels affect notification behavior
- Custom styling options available

### Permissions
- Always request permissions before showing notifications
- Check permission status before attempting to display notifications
- Handle permission denial gracefully

## Troubleshooting

### Common Issues

1. **Notifications not showing on iOS:**
   - Check if permissions are granted
   - Ensure app is not in Do Not Disturb mode
   - Verify notification settings in iOS Settings

2. **Notifications not showing on Android:**
   - Check if notification channel is created
   - Verify app notification settings
   - Check if battery optimization is disabled

3. **Scheduled notifications not working:**
   - Ensure device is not in battery saver mode
   - Check if app has background permissions
   - Verify trigger configuration

### Debug Tips

- Use console.log to debug notification events
- Check notification settings with `getNotificationSettings()`
- Monitor scheduled notifications with `getScheduledNotifications()`

## Next Steps

To extend this setup:

1. **Push Notifications**: Integrate with Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNs)
2. **Deep Linking**: Add navigation when notifications are pressed
3. **Custom Actions**: Add action buttons to notifications
4. **Rich Notifications**: Add images, videos, or custom layouts
5. **Analytics**: Track notification engagement

## Resources

- [Notifee Documentation](https://notifee.app/)
- [React Native Notifee GitHub](https://github.com/invertase/react-native-notifee)
- [iOS Push Notifications Guide](https://developer.apple.com/documentation/usernotifications)
- [Android Notifications Guide](https://developer.android.com/guide/topics/ui/notifiers/notifications) 