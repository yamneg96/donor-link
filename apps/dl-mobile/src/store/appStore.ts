import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  isOnboarded: boolean;
  isOffline: boolean;
  setOnboarded: (onboarded: boolean) => void;
  setOffline: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      isOffline: false,
      setOnboarded: (isOnboarded) => set({ isOnboarded }),
      setOffline: (isOffline) => set({ isOffline }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
