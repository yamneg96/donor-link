import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  ONBOARDED: 'onboarded',
  THEME: 'theme',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

export const storage = {
  getItem: async <T>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (e) {}
  },
};
