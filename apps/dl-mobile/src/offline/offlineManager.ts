import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus } from 'react-native';
import { useAppStore } from '../store/appStore';

export function setupOfflineManager() {
  const { setOffline } = useAppStore.getState();

  let lastConnected: boolean | null = null;

  // NetInfo listener
  const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
    const isConnected = !!state.isConnected;
    setOffline(!isConnected);
    
    if (isConnected && lastConnected === false) {
      console.log('App back online - re-syncing...');
    }
    lastConnected = isConnected;
  });

  // AppState listener
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // Background to foreground sync
      console.log('App active - checking connectivity');
    }
  };

  const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  return () => {
    unsubscribeNetInfo();
    appStateSubscription.remove();
  };
}
