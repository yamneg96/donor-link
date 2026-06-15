import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
  setBiometricEnabled: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      biometricEnabled: false,
      notificationsEnabled: true,
      language: 'en',
      theme: 'system',
      setBiometricEnabled: (biometricEnabled) => set({ biometricEnabled }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
