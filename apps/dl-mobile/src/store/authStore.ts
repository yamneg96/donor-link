import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '../types/auth';
import { storage as storageService, StorageKeys } from '../services/storage';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  biometricEnabled: boolean;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setBiometricEnabled: (enabled: boolean) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,
      biometricEnabled: false,

      setUser: (user) => set({ user }),
      setTokens: (tokens) => set({ tokens, isAuthenticated: !!tokens }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setBiometricEnabled: (enabled) => set({ biometricEnabled: enabled }),

      logout: async () => {
        await storageService.removeItem(StorageKeys.ACCESS_TOKEN);
        await storageService.removeItem(StorageKeys.REFRESH_TOKEN);
        await storageService.removeItem(StorageKeys.USER);
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      hydrate: async () => {
        set({ isLoading: true });
        try {
          const accessToken = await storageService.getItem<string>(StorageKeys.ACCESS_TOKEN);
          const refreshToken = await storageService.getItem<string>(StorageKeys.REFRESH_TOKEN);
          const user = await storageService.getItem<User>(StorageKeys.USER);

          if (accessToken && refreshToken && user) {
            set({
              tokens: { accessToken, refreshToken },
              user,
              isAuthenticated: true,
            });
          }
        } catch (error) {
          console.error('Failed to hydrate auth state', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        biometricEnabled: state.biometricEnabled,
        user: state.user, // Persist user for quick access
      }),
    }
  )
);
