import * as SecureStore from "expo-secure-store";
import { IUser, UserRole } from "@donorlink/types";

interface AuthState {
  user: Omit<IUser, "passwordHash"> | null;
  accessToken: string | null;
  refreshToken: string | null;
}

let state: AuthState = { user: null, accessToken: null, refreshToken: null };
const listeners = new Set<() => void>();

export const mobileAuthStore = {
  getState: () => state,

  async init() {
    try {
      const [user, at, rt] = await Promise.all([
        SecureStore.getItemAsync("user"),
        SecureStore.getItemAsync("accessToken"),
        SecureStore.getItemAsync("refreshToken"),
      ]);
      state = {
        user: user ? JSON.parse(user) : null,
        accessToken: at,
        refreshToken: rt,
      };
      listeners.forEach(l => l());
    } catch { /* ignore */ }
  },

  async setAuth(user: Omit<IUser, "passwordHash">, accessToken: string, refreshToken: string) {
    state = { user, accessToken, refreshToken };
    await Promise.all([
      SecureStore.setItemAsync("user", JSON.stringify(user)),
      SecureStore.setItemAsync("accessToken", accessToken),
      SecureStore.setItemAsync("refreshToken", refreshToken),
    ]);
    listeners.forEach(l => l());
  },

  async clearAuth() {
    state = { user: null, accessToken: null, refreshToken: null };
    await Promise.all([
      SecureStore.deleteItemAsync("user"),
      SecureStore.deleteItemAsync("accessToken"),
      SecureStore.deleteItemAsync("refreshToken"),
    ]);
    listeners.forEach(l => l());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  isAuthenticated: () => !!state.accessToken && !!state.user,
  hasRole: (...roles: UserRole[]) => state.user ? roles.includes(state.user.role as UserRole) : false,
};