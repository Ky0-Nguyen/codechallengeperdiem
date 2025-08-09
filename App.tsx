/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import NotificationService from './src/services/NotificationService';
import StoreProvider from './src/contexts/StoreProvider';
import MainNavigator from './src/components/MainNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize notification service
    const initializeNotifications = async () => {
      try {
        // Request permissions on app start
        await NotificationService.requestPermissions();
        console.log('Notification service initialized');
      } catch (error) {
        console.error('Error initializing notification service:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <StoreProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <MainNavigator />
      </View>
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
