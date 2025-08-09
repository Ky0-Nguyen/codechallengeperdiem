import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, AppState, AppStateStatus } from 'react-native';
import { useStore } from '../../contexts/StoreProvider';
import { utils } from '../utils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

// Hook for managing loading state
export const useLoading = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  
  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading: setIsLoading,
  };
};

// Hook for managing form state
export const useForm = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);
  
  const updateForm = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
  }, [initialState]);
  
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);
  
  const validateForm = useCallback((validationRules: Record<keyof T, (value: any) => string | null>) => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach((field) => {
      const key = field as keyof T;
      const value = formData[key];
      const error = validationRules[key](value);
      
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [formData]);
  
  return {
    formData,
    errors,
    updateField,
    updateForm,
    resetForm,
    setFieldError,
    clearErrors,
    validateForm,
  };
};

// Hook for managing API calls
export const useApi = <T = any>() => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      startLoading();
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = utils.error.getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);
  
  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};

// Hook for managing app state
export const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
      setIsActive(nextAppState === 'active');
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);
  
  return {
    appState,
    isActive,
  };
};

// Hook for managing timezone
export const useTimezone = () => {
  const { appStore } = useStore();
  const [isNYCTimezone, setIsNYCTimezone] = useState(false);
  
  const toggleTimezone = useCallback(() => {
    const newTimezone = !isNYCTimezone;
    setIsNYCTimezone(newTimezone);
    appStore.setNYCTimezone(newTimezone);
  }, [isNYCTimezone, appStore]);
  
  const getCurrentTime = useCallback(() => {
    const timezone = isNYCTimezone ? 'America/New_York' : utils.timezone.getCurrentTimezone();
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [isNYCTimezone]);
  
  const getGreetingMessage = useCallback(() => {
    return utils.greeting.getGreetingMessage(isNYCTimezone);
  }, [isNYCTimezone]);
  
  return {
    isNYCTimezone,
    toggleTimezone,
    getCurrentTime,
    getGreetingMessage,
  };
};

// Hook for managing date selection
export const useDateSelection = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  }, []);
  
  const selectTimeSlot = useCallback((timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  }, []);
  
  const clearSelection = useCallback(() => {
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  }, []);
  
  const isSelectionComplete = useCallback(() => {
    return selectedDate !== null && selectedTimeSlot !== null;
  }, [selectedDate, selectedTimeSlot]);
  
  return {
    selectedDate,
    selectedTimeSlot,
    selectDate,
    selectTimeSlot,
    clearSelection,
    isSelectionComplete,
  };
};

// Hook for managing alerts
export const useAlert = () => {
  const showAlert = useCallback((title: string, message: string, buttons?: any[]) => {
    Alert.alert(title, message, buttons);
  }, []);
  
  const showError = useCallback((message: string) => {
    Alert.alert('Error', message);
  }, []);
  
  const showSuccess = useCallback((message: string) => {
    Alert.alert('Success', message);
  }, []);
  
  const showConfirmation = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'Confirm', style: 'destructive', onPress: onConfirm },
      ]
    );
  }, []);
  
  return {
    showAlert,
    showError,
    showSuccess,
    showConfirmation,
  };
};

// Hook for managing modal state
export const useModal = (initialState: boolean = false) => {
  const [isVisible, setIsVisible] = useState(initialState);
  
  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible(prev => !prev), []);
  
  return {
    isVisible,
    show,
    hide,
    toggle,
  };
};

// Hook for managing keyboard
export const useKeyboard = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    });
    
    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);
  
  return {
    isKeyboardVisible,
    keyboardHeight,
  };
};

// Hook for managing scroll position
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  }, []);
  
  const handleScrollBeginDrag = useCallback(() => {
    setIsScrolling(true);
  }, []);
  
  const handleScrollEndDrag = useCallback(() => {
    setIsScrolling(false);
  }, []);
  
  return {
    scrollY,
    isScrolling,
    handleScroll,
    handleScrollBeginDrag,
    handleScrollEndDrag,
  };
};

// Hook for managing debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Hook for managing previous value
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Hook for managing mounted state
export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  return isMounted;
};

// Hook for managing network status
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    // This would typically use NetInfo or similar
    // For now, we'll assume connected
    setIsConnected(true);
  }, []);
  
  return {
    isConnected,
  };
};

// Export all hooks
export const hooks = {
  useLoading,
  useForm,
  useApi,
  useAppState,
  useTimezone,
  useDateSelection,
  useAlert,
  useModal,
  useKeyboard,
  useScrollPosition,
  useDebounce,
  usePrevious,
  useMounted,
  useNetworkStatus,
};

export default hooks; 