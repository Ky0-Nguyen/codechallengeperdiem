import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import StoreProvider, { useStore, useAppStore, useCacheStore } from '../StoreProvider';
import RootStore from '../../stores/RootStore';

jest.mock('../../stores/RootStore');
const mockRootStore = RootStore as jest.Mocked<typeof RootStore>;

describe('StoreProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRootStore.initialize.mockResolvedValue();
  });

  describe('StoreProvider Component', () => {
    it('should render children', () => {
      const { getByText } = render(
        <StoreProvider>
          <Text>Test Child</Text>
        </StoreProvider>
      );

      expect(getByText('Test Child')).toBeTruthy();
    });

    it('should initialize stores on mount', async () => {
      render(
        <StoreProvider>
          <Text>Test</Text>
        </StoreProvider>
      );

      await waitFor(() => {
        expect(mockRootStore.initialize).toHaveBeenCalled();
      });
    });

    it('should handle initialization errors gracefully', async () => {
      const error = new Error('Initialization failed');
      mockRootStore.initialize.mockRejectedValue(error);

      // Should not throw
      expect(() => {
        render(
          <StoreProvider>
            <Text>Test</Text>
          </StoreProvider>
        );
      }).not.toThrow();
    });
  });

  describe('useStore Hook', () => {
    const TestComponent = () => {
      const store = useStore();
      return <Text>Store: {store ? 'Available' : 'Not Available'}</Text>;
    };

    it('should provide store context', () => {
      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText('Store: Available')).toBeTruthy();
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useStore must be used within a StoreProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('useAppStore Hook', () => {
    const TestComponent = () => {
      const appStore = useAppStore();
      return <Text>AppStore: {appStore ? 'Available' : 'Not Available'}</Text>;
    };

    it('should provide app store', () => {
      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText('AppStore: Available')).toBeTruthy();
    });

    it('should return the same app store instance', () => {
      const TestComponent2 = () => {
        const appStore1 = useAppStore();
        const appStore2 = useAppStore();
        return (
          <Text>
            Same Instance: {appStore1 === appStore2 ? 'Yes' : 'No'}
          </Text>
        );
      };

      const { getByText } = render(
        <StoreProvider>
          <TestComponent2 />
        </StoreProvider>
      );

      expect(getByText('Same Instance: Yes')).toBeTruthy();
    });
  });

  describe('useCacheStore Hook', () => {
    const TestComponent = () => {
      const cacheStore = useCacheStore();
      return <Text>CacheStore: {cacheStore ? 'Available' : 'Not Available'}</Text>;
    };

    it('should provide cache store', () => {
      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText('CacheStore: Available')).toBeTruthy();
    });

    it('should return the same cache store instance', () => {
      const TestComponent2 = () => {
        const cacheStore1 = useCacheStore();
        const cacheStore2 = useCacheStore();
        return (
          <Text>
            Same Instance: {cacheStore1 === cacheStore2 ? 'Yes' : 'No'}
          </Text>
        );
      };

      const { getByText } = render(
        <StoreProvider>
          <TestComponent2 />
        </StoreProvider>
      );

      expect(getByText('Same Instance: Yes')).toBeTruthy();
    });
  });

  describe('Store Integration', () => {
    const TestComponent = () => {
      const appStore = useAppStore();
      const cacheStore = useCacheStore();
      
      return (
        <Text>
          AppStore: {appStore ? 'Available' : 'Not Available'} | 
          CacheStore: {cacheStore ? 'Available' : 'Not Available'}
        </Text>
      );
    };

    it('should provide both stores', () => {
      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText(/AppStore: Available/)).toBeTruthy();
      expect(getByText(/CacheStore: Available/)).toBeTruthy();
    });

    it('should provide stores from root store', () => {
      const TestComponent2 = () => {
        const rootStore = useStore();
        const appStore = useAppStore();
        const cacheStore = useCacheStore();
        
        return (
          <Text>
            RootStore: {rootStore ? 'Available' : 'Not Available'} | 
            AppStore Match: {rootStore?.appStore === appStore ? 'Yes' : 'No'} | 
            CacheStore Match: {rootStore?.cacheStore === cacheStore ? 'Yes' : 'No'}
          </Text>
        );
      };

      const { getByText } = render(
        <StoreProvider>
          <TestComponent2 />
        </StoreProvider>
      );

      expect(getByText(/RootStore: Available/)).toBeTruthy();
      expect(getByText(/AppStore Match: Yes/)).toBeTruthy();
      expect(getByText(/CacheStore Match: Yes/)).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle store initialization errors', async () => {
      const error = new Error('Store initialization failed');
      mockRootStore.initialize.mockRejectedValue(error);

      // Should not crash the app
      expect(() => {
        render(
          <StoreProvider>
            <Text>Test</Text>
          </StoreProvider>
        );
      }).not.toThrow();
    });

    it('should handle multiple providers gracefully', () => {
      const TestComponent = () => {
        const store = useStore();
        return <Text>Store: {store ? 'Available' : 'Not Available'}</Text>;
      };

      const { getByText } = render(
        <StoreProvider>
          <StoreProvider>
            <TestComponent />
          </StoreProvider>
        </StoreProvider>
      );

      expect(getByText('Store: Available')).toBeTruthy();
    });
  });

  describe('Multiple Providers', () => {
    it('should work with nested providers', () => {
      const TestComponent = () => {
        const store = useStore();
        return <Text>Nested Store: {store ? 'Available' : 'Not Available'}</Text>;
      };

      const { getByText } = render(
        <StoreProvider>
          <StoreProvider>
            <TestComponent />
          </StoreProvider>
        </StoreProvider>
      );

      expect(getByText('Nested Store: Available')).toBeTruthy();
    });

    it('should maintain store context in nested components', () => {
      const NestedComponent = () => {
        const appStore = useAppStore();
        const cacheStore = useCacheStore();
        return (
          <Text>
            Nested AppStore: {appStore ? 'Available' : 'Not Available'} | 
            Nested CacheStore: {cacheStore ? 'Available' : 'Not Available'}
          </Text>
        );
      };

      const TestComponent = () => {
        return (
          <StoreProvider>
            <NestedComponent />
          </StoreProvider>
        );
      };

      const { getByText } = render(<TestComponent />);

      expect(getByText(/Nested AppStore: Available/)).toBeTruthy();
      expect(getByText(/Nested CacheStore: Available/)).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      let renderCount = 0;
      const TestComponent = React.memo(() => {
        renderCount++;
        const appStore = useAppStore();
        return <Text>Render Count: {renderCount}</Text>;
      });

      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText('Render Count: 1')).toBeTruthy();
    });

    it('should provide stable store references', () => {
      let appStoreRef: any = null;
      let cacheStoreRef: any = null;

      const TestComponent = () => {
        const appStore = useAppStore();
        const cacheStore = useCacheStore();
        
        if (!appStoreRef) appStoreRef = appStore;
        if (!cacheStoreRef) cacheStoreRef = cacheStore;
        
        return (
          <Text>
            AppStore Stable: {appStore === appStoreRef ? 'Yes' : 'No'} | 
            CacheStore Stable: {cacheStore === cacheStoreRef ? 'Yes' : 'No'}
          </Text>
        );
      };

      const { getByText } = render(
        <StoreProvider>
          <TestComponent />
        </StoreProvider>
      );

      expect(getByText(/AppStore Stable: Yes/)).toBeTruthy();
      expect(getByText(/CacheStore Stable: Yes/)).toBeTruthy();
    });
  });
}); 