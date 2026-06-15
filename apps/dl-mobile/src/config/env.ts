import Constants from 'expo-constants';

export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  IS_DEV: __DEV__,
  APP_VERSION: Constants.expoConfig?.version || '1.0.0',
};
