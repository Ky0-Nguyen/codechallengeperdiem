/**
 * @author Nguyễn Tuấn
 * @created 2024-12-19
 * @component MainNavigator
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../contexts/StoreProvider';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from './LoadingScreen';
import StoreService from '../services/StoreService';

const MainNavigator: React.FC = observer(() => {
  const { appStore } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize store service with API data
        await StoreService.initializeStoreInfo();
        const storeInfo = StoreService.getStoreInfo();
        
        if (storeInfo) {
          appStore.setStoreInfo(storeInfo);
        }

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to mock data
        const mockStoreInfo = StoreService.getMockStoreInfo();
        StoreService.initializeStoreInfo(mockStoreInfo);
        appStore.setStoreInfo(mockStoreInfo);
      }
      
      setIsInitialized(true);
    };

    initializeApp();
  }, [appStore]);

  const handleLoginSuccess = () => {
    // Set a mock user profile
    appStore.setUserProfile({
      id: 'user-1',
      email: 'user@tryperdiem.com',
      name: 'Demo User',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  if (!isInitialized) {
    return <LoadingScreen message="Initializing App..." />;
  }

  if (!appStore.isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return <HomeScreen />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default MainNavigator; 