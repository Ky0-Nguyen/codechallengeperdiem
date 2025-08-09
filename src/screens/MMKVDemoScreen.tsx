/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @screen MMKVDemoScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAppStore, useCacheStore } from '../contexts/StoreProvider';
import MMKVStorage from '../services/MMKVStorage';

const MMKVDemoScreen: React.FC = observer(() => {
  const appStore = useAppStore();
  const cacheStore = useCacheStore();
  
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [cacheKey, setCacheKey] = useState('');
  const [cacheValue, setCacheValue] = useState('');
  const [cacheExpiry, setCacheExpiry] = useState('30');

  const handleSetUserProfile = () => {
    if (!userName || !userEmail) {
      Alert.alert('Error', 'Please enter both name and email');
      return;
    }

    const profile = {
      id: Date.now().toString(),
      name: userName,
      email: userEmail,
      preferences: {
        notifications: true,
        theme: 'auto' as const,
        language: 'en',
      },
    };

    appStore.setUserProfile(profile);
    Alert.alert('Success', 'User profile saved!');
    setUserName('');
    setUserEmail('');
  };

  const handleUpdateTheme = (theme: 'light' | 'dark' | 'auto') => {
    appStore.setTheme(theme);
    Alert.alert('Success', `Theme changed to ${theme}`);
  };

  const handleToggleNotifications = (enabled: boolean) => {
    appStore.toggleNotifications(enabled);
    Alert.alert('Success', `Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleSetCache = () => {
    if (!cacheKey || !cacheValue) {
      Alert.alert('Error', 'Please enter both key and value');
      return;
    }

    const expiryMinutes = parseInt(cacheExpiry) || 30;
    cacheStore.set(cacheKey, cacheValue, expiryMinutes);
    Alert.alert('Success', `Cache set: ${cacheKey} = ${cacheValue}`);
    setCacheKey('');
    setCacheValue('');
  };

  const handleGetCache = () => {
    if (!cacheKey) {
      Alert.alert('Error', 'Please enter a cache key');
      return;
    }

    const value = cacheStore.get(cacheKey);
    if (value !== null) {
      Alert.alert('Cache Value', `${cacheKey}: ${value}`);
    } else {
      Alert.alert('Not Found', `No cache found for key: ${cacheKey}`);
    }
  };

  const handleClearCache = () => {
    cacheStore.clear();
    Alert.alert('Success', 'All cache cleared');
  };

  const handleLogout = () => {
    appStore.logout();
    Alert.alert('Success', 'Logged out successfully');
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear all stored data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            MMKVStorage.clear();
            appStore.reset();
            cacheStore.clear();
            Alert.alert('Success', 'All data reset');
          },
        },
      ]
    );
  };

  const showStorageInfo = () => {
    const storageSize = MMKVStorage.getStorageSize();
    const allKeys = MMKVStorage.getAllKeys();
    const cacheStats = cacheStore.statistics;
    
    Alert.alert(
      'Storage Information',
      `Storage Size: ${storageSize} bytes\n` +
      `Total Keys: ${allKeys.length}\n` +
      `Cache Items: ${cacheStats.total}\n` +
      `Valid Cache: ${cacheStats.valid}\n` +
      `Expired Cache: ${cacheStats.expired}`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MMKV + MobX Demo</Text>
        <Text style={styles.subtitle}>
          Fast storage with reactive state management
        </Text>
      </View>

      {/* User Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        
        {appStore.isAuthenticated ? (
          <View style={styles.profileInfo}>
            <Text style={styles.profileText}>
              Name: {appStore.userDisplayName}
            </Text>
            <Text style={styles.profileText}>
              Email: {appStore.userEmail}
            </Text>
            <Text style={styles.profileText}>
              Theme: {appStore.currentTheme}
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={userName}
              onChangeText={setUserName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSetUserProfile}
            >
              <Text style={styles.buttonText}>Set User Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Theme Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme Settings</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={() => handleUpdateTheme('light')}
          >
            <Text style={styles.buttonText}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={() => handleUpdateTheme('dark')}
          >
            <Text style={styles.buttonText}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={() => handleUpdateTheme('auto')}
          >
            <Text style={styles.buttonText}>Auto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={appStore.isNotificationsEnabled}
            onValueChange={handleToggleNotifications}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound</Text>
          <Switch
            value={appStore.notificationSettings.sound}
            onValueChange={(enabled) =>
              appStore.updateNotificationSettings({ sound: enabled })
            }
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Vibration</Text>
          <Switch
            value={appStore.notificationSettings.vibration}
            onValueChange={(enabled) =>
              appStore.updateNotificationSettings({ vibration: enabled })
            }
          />
        </View>
      </View>

      {/* Cache Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Management</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Cache key"
          value={cacheKey}
          onChangeText={setCacheKey}
        />
        <TextInput
          style={styles.input}
          placeholder="Cache value"
          value={cacheValue}
          onChangeText={setCacheValue}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiry (minutes)"
          value={cacheExpiry}
          onChangeText={setCacheExpiry}
          keyboardType="numeric"
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={handleSetCache}
          >
            <Text style={styles.buttonText}>Set Cache</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.smallButton]}
            onPress={handleGetCache}
          >
            <Text style={styles.buttonText}>Get Cache</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.button, styles.warningButton]}
          onPress={handleClearCache}
        >
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>

      {/* Cache Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cache Statistics</Text>
        <Text style={styles.statText}>
          Total Items: {cacheStore.statistics.total}
        </Text>
        <Text style={styles.statText}>
          Valid Items: {cacheStore.statistics.valid}
        </Text>
        <Text style={styles.statText}>
          Expired Items: {cacheStore.statistics.expired}
        </Text>
        <Text style={styles.statText}>
          Storage Size: {cacheStore.statistics.size} bytes
        </Text>
      </View>

      {/* Utility Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utility Actions</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={showStorageInfo}
        >
          <Text style={styles.buttonText}>Show Storage Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => cacheStore.cleanExpired()}
        >
          <Text style={styles.buttonText}>Clean Expired Cache</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleResetAll}
        >
          <Text style={styles.buttonText}>Reset All Data</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
});

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
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  warningButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileInfo: {
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  statText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});

export default MMKVDemoScreen; 