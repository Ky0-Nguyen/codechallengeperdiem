// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(),
    size: 0,
  })),
}));

// Mock @notifee/react-native
jest.mock('@notifee/react-native', () => {
  const mockNotifee = {
    displayNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
    cancelNotification: jest.fn(),
    cancelAllNotifications: jest.fn(),
    getTriggerNotifications: jest.fn(),
    requestPermission: jest.fn(),
    getNotificationSettings: jest.fn(),
    createChannel: jest.fn(),
    onForegroundEvent: jest.fn(),
    onBackgroundEvent: jest.fn(),
  };
  
  return {
    default: mockNotifee,
    ...mockNotifee,
    AndroidImportance: {
      HIGH: 'high',
      DEFAULT: 'default',
      LOW: 'low',
    },
    AndroidStyle: {
      BIGTEXT: 'bigtext',
      BIGPICTURE: 'bigpicture',
    },
    EventType: {
      PRESS: 'press',
      DISMISSED: 'dismissed',
    },
    TriggerType: {
      TIMESTAMP: 'timestamp',
    },
    AndroidColor: {
      RED: 'red',
      GREEN: 'green',
      BLUE: 'blue',
    },
    AndroidCategory: {
      MESSAGE: 'message',
      CALL: 'call',
      EMAIL: 'email',
    },
  };
});

// Mock TurboModuleRegistry first
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({
    show: jest.fn(),
    addMenuItem: jest.fn(),
    reload: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    initialize: jest.fn(),
  })),
  get: jest.fn(() => ({
    show: jest.fn(),
    addMenuItem: jest.fn(),
    reload: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    initialize: jest.fn(),
  })),
}));

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios || obj.default),
      constants: {
        isTesting: true,
        reactNativeVersion: {
          major: 0,
          minor: 80,
          patch: 2,
        },
      },
    },
    Alert: {
      alert: jest.fn(),
    },
    StatusBar: {
      setBarStyle: jest.fn(),
    },
    NativeModules: {
      ...RN.NativeModules,
      DevMenu: {
        show: jest.fn(),
      },
      DevSettings: {
        addMenuItem: jest.fn(),
        reload: jest.fn(),
      },
      AsyncStorage: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      MMKV: {
        initialize: jest.fn(),
      },
      Notifee: {
        initialize: jest.fn(),
      },
    },
    // Mock additional modules that might be needed
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    Linking: {
      openURL: jest.fn(),
      canOpenURL: jest.fn(),
    },
  };
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup global test utilities
global.testUtils = {
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  createMockMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    delete: jest.fn(),
    contains: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(),
    size: 0,
  }),
}; 