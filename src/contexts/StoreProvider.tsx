import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import RootStore from '../stores/RootStore';

// Create context for the root store
const StoreContext = createContext<RootStore | null>(null);

// Hook to use the store
export const useStore = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return store;
};

// Hook to use specific stores
export const useAppStore = () => {
  const store = useStore();
  return store.appStore;
};

export const useCacheStore = () => {
  const store = useStore();
  return store.cacheStore;
};

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = observer(({ children }) => {
  useEffect(() => {
    // Initialize the root store when the provider mounts
    RootStore.initialize();
  }, []);

  return (
    <StoreContext.Provider value={RootStore}>
      {children}
    </StoreContext.Provider>
  );
});

export default StoreProvider; 