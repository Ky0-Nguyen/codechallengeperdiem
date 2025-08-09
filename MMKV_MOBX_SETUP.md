# MMKV + MobX Setup Guide

This guide explains how to set up and use MMKV (fast key-value storage) with MobX (reactive state management) in your React Native project.

## Installation

The packages have been installed and configured. Here's what was done:

1. **Installed packages:**
   ```bash
   npm install react-native-mmkv mobx mobx-react-lite
   ```

2. **iOS Setup:**
   - Ran `cd ios && pod install` to link native modules

3. **Android Setup:**
   - Auto-linked via React Native CLI

## Project Structure

```
src/
├── services/
│   └── MMKVStorage.ts           # MMKV storage service
├── stores/
│   ├── AppStore.ts              # Main app state store
│   ├── CacheStore.ts            # Cache management store
│   └── RootStore.ts             # Root store combining all stores
├── contexts/
│   └── StoreProvider.tsx        # MobX store provider
└── screens/
    └── MMKVDemoScreen.tsx       # Demo screen for testing
```

## Features Implemented

### MMKVStorage.ts
- **Encrypted Storage**: Secure data storage with encryption
- **Type Safety**: Full TypeScript support with interfaces
- **Generic Methods**: Flexible get/set methods for any data type
- **User Profile Management**: Store and retrieve user data
- **App Settings**: Persistent app configuration
- **Notification Settings**: Store notification preferences
- **Cache Management**: Time-based cache with expiration
- **Auth Token Storage**: Secure token management
- **Theme & Language**: Persistent UI preferences
- **Migration Support**: Data migration utilities
- **Backup/Restore**: Export/import functionality for debugging

### MobX Stores

#### AppStore.ts
- **Reactive State**: Automatic UI updates when data changes
- **User Management**: Profile, authentication state
- **Settings Management**: Theme, language, notifications
- **Privacy Settings**: Analytics, crash reports
- **Computed Properties**: Derived state calculations
- **MMKV Integration**: Automatic persistence to storage

#### CacheStore.ts
- **Cache Management**: Set, get, remove cache items
- **Expiration**: Time-based cache expiration
- **Statistics**: Cache size, item counts, expiration tracking
- **Bulk Operations**: Set/get multiple items
- **Cache Freshness**: Check if cache is still valid
- **Cleanup**: Remove expired items automatically

#### RootStore.ts
- **Store Coordination**: Manages all stores together
- **Initialization**: Ensures proper store setup order
- **Reset Functionality**: Clear all data when needed
- **Statistics**: Overview of all store states

### StoreProvider.tsx
- **React Context**: Provides stores to components
- **Custom Hooks**: Easy access to specific stores
- **Observer Pattern**: Automatic re-renders on state changes

## Usage Examples

### Basic MMKV Usage
```typescript
import MMKVStorage from './src/services/MMKVStorage';

// Store data
MMKVStorage.set('user_name', 'John Doe');
MMKVStorage.set('user_age', 25);

// Retrieve data
const name = MMKVStorage.get<string>('user_name');
const age = MMKVStorage.get<number>('user_age');

// Check if key exists
if (MMKVStorage.exists('user_name')) {
  console.log('User name exists');
}
```

### User Profile Management
```typescript
import MMKVStorage, { UserProfile } from './src/services/MMKVStorage';

const profile: UserProfile = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    notifications: true,
    theme: 'dark',
    language: 'en',
  },
};

// Save profile
MMKVStorage.setUserProfile(profile);

// Get profile
const savedProfile = MMKVStorage.getUserProfile();

// Update profile
MMKVStorage.updateUserProfile({ name: 'Jane Doe' });
```

### Cache Management
```typescript
import MMKVStorage from './src/services/MMKVStorage';

// Cache with expiration (30 minutes)
MMKVStorage.setCacheData('api_response', { data: 'value' }, 30);

// Get cached data
const cachedData = MMKVStorage.getCacheData('api_response');

// Check if cache exists and is valid
if (MMKVStorage.getCacheData('api_response')) {
  console.log('Cache is valid');
}
```

### MobX Store Usage
```typescript
import { observer } from 'mobx-react-lite';
import { useAppStore, useCacheStore } from './src/contexts/StoreProvider';

const MyComponent = observer(() => {
  const appStore = useAppStore();
  const cacheStore = useCacheStore();

  // Access reactive state
  const userName = appStore.userDisplayName;
  const isAuthenticated = appStore.isAuthenticated;
  const cacheSize = cacheStore.size;

  // Update state (automatically persists to MMKV)
  const handleLogin = () => {
    appStore.setUserProfile({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      preferences: { notifications: true, theme: 'light', language: 'en' },
    });
  };

  // Cache operations
  const handleCacheData = () => {
    cacheStore.set('my_key', 'my_value', 60); // 60 minutes
  };

  return (
    <View>
      <Text>Welcome, {userName}!</Text>
      <Text>Cache items: {cacheSize}</Text>
    </View>
  );
});
```

### Theme Management
```typescript
const appStore = useAppStore();

// Change theme (automatically saves to MMKV)
appStore.setTheme('dark');

// Get current theme
const currentTheme = appStore.currentTheme; // 'light' | 'dark' | 'auto'
```

### Notification Settings
```typescript
const appStore = useAppStore();

// Toggle notifications
appStore.toggleNotifications(true);

// Update specific settings
appStore.updateNotificationSettings({
  sound: false,
  vibration: true,
});

// Toggle specific categories
appStore.toggleNotificationCategory('reminders');
```

## Advanced Features

### Cache with Expiration
```typescript
// Cache data for 1 hour
cacheStore.set('api_data', responseData, 60);

// Check if cache is fresh (less than 30 minutes old)
if (cacheStore.isFresh('api_data', 30)) {
  console.log('Cache is fresh');
}

// Extend cache life
cacheStore.touch('api_data');
```

### Bulk Operations
```typescript
// Set multiple cache items
cacheStore.setMultiple([
  { key: 'user_1', data: user1Data, expiresInMinutes: 30 },
  { key: 'user_2', data: user2Data, expiresInMinutes: 60 },
]);

// Get multiple items
const users = cacheStore.getMultiple(['user_1', 'user_2']);
```

### Storage Statistics
```typescript
// Get cache statistics
const stats = cacheStore.statistics;
console.log(`Total: ${stats.total}, Valid: ${stats.valid}, Expired: ${stats.expired}`);

// Get storage size
const size = MMKVStorage.getStorageSize();
console.log(`Storage size: ${size} bytes`);
```

## Testing

1. **Run the app:**
   ```bash
   npm run ios     # For iOS
   npm run android # For Android
   ```

2. **Test Features:**
   - Set user profile
   - Change theme settings
   - Toggle notification settings
   - Set/get cache data
   - View storage statistics
   - Test cache expiration
   - Reset all data

## Performance Benefits

### MMKV Advantages
- **Fast**: 10x faster than AsyncStorage
- **Encrypted**: Built-in encryption support
- **Type Safe**: Full TypeScript support
- **Cross-Platform**: Works on iOS and Android
- **Memory Efficient**: Minimal memory footprint

### MobX Advantages
- **Reactive**: Automatic UI updates
- **Simple**: Minimal boilerplate code
- **Predictable**: Unidirectional data flow
- **Debuggable**: Great developer tools
- **Flexible**: Works with any React setup

## Best Practices

### Storage
1. **Use Constants**: Define storage keys as constants to avoid typos
2. **Type Safety**: Always use TypeScript interfaces for stored data
3. **Error Handling**: Wrap storage operations in try-catch blocks
4. **Encryption**: Use encryption for sensitive data
5. **Cleanup**: Regularly clean expired cache items

### State Management
1. **Observer Pattern**: Use `observer()` for components that need reactive updates
2. **Computed Properties**: Use computed properties for derived state
3. **Actions**: Use actions for state modifications
4. **Store Separation**: Keep stores focused on specific domains
5. **Persistence**: Automatically persist important state to MMKV

### Performance
1. **Cache Strategy**: Use appropriate cache expiration times
2. **Bulk Operations**: Use bulk operations for multiple items
3. **Lazy Loading**: Load data only when needed
4. **Memory Management**: Clean up unused cache items
5. **Storage Monitoring**: Monitor storage size and usage

## Troubleshooting

### Common Issues

1. **Data not persisting:**
   - Check if MMKV is properly initialized
   - Verify encryption key is set
   - Ensure proper error handling

2. **UI not updating:**
   - Make sure component is wrapped with `observer()`
   - Check if state is being modified in MobX actions
   - Verify store is properly injected

3. **Cache not working:**
   - Check cache expiration times
   - Verify cache keys are unique
   - Ensure cache cleanup is running

4. **Performance issues:**
   - Monitor storage size
   - Clean expired cache regularly
   - Use appropriate cache strategies

### Debug Tips

- Use `MMKVStorage.exportData()` to inspect stored data
- Check `cacheStore.statistics` for cache information
- Monitor `appStore.statistics` for app state
- Use React DevTools for MobX debugging

## Next Steps

To extend this setup:

1. **API Integration**: Use cache store for API response caching
2. **Offline Support**: Store data for offline functionality
3. **Sync**: Implement data synchronization
4. **Analytics**: Track storage usage and performance
5. **Migration**: Add data migration strategies for app updates

## Resources

- [MMKV Documentation](https://github.com/Tencent/MMKV)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)
- [MobX Documentation](https://mobx.js.org/)
- [MobX React Lite](https://github.com/mobxjs/mobx-react-lite) 