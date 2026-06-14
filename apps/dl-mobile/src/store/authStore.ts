import * as SecureStore from "expo-secure-store";
import { IUser, UserRole } from "@/src/types/index";
import { useState, useEffect } from "react";

interface AuthState {
  user: Omit<IUser, "passwordHash"> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  isLocked: boolean;
}

let authState: AuthState = { 
  user: null, 
  accessToken: null, 
  refreshToken: null, 
  isInitialized: false,
  isLocked: true // Default to locked for safety
};

const listeners = new Set<() => void>();

export const authStore = {
  getState: () => authState,

  async init() {
    try {
      const [user, at, rt] = await Promise.all([
        SecureStore.getItemAsync("user"),
        SecureStore.getItemAsync("accessToken"),
        SecureStore.getItemAsync("refreshToken"),
      ]);
      authState = {
        ...authState,
        user: user ? JSON.parse(user) : null,
        accessToken: at,
        refreshToken: rt,
        isInitialized: true,
      };
      listeners.forEach(l => l());
    } catch {
      authState = { ...authState, isInitialized: true };
      listeners.forEach(l => l());
    }
  },

  setLocked(locked: boolean) {
    authState = { ...authState, isLocked: locked };
    listeners.forEach(l => l());
  },

  async setAuth(user: Omit<IUser, "passwordHash">, accessToken: string, refreshToken: string) {
    authState = { ...authState, user, accessToken, refreshToken };
    await Promise.all([
      SecureStore.setItemAsync("user", JSON.stringify(user)),
      SecureStore.setItemAsync("accessToken", accessToken),
      SecureStore.setItemAsync("refreshToken", refreshToken),
    ]);
    listeners.forEach(l => l());
  },

  async clearAuth() {
    authState = { ...authState, user: null, accessToken: null, refreshToken: null };
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

  isAuthenticated: () => !!authState.accessToken && !!authState.user,
  hasRole: (...roles: UserRole[]) => authState.user ? roles.includes(authState.user.role as UserRole) : false,
};

// Hook-based access
export function useAuthStore() {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => setState(authStore.getState()));
    return () => { unsubscribe(); };
  }, []);

  return {
    ...state,
    init: authStore.init,
    setAuth: authStore.setAuth,
    clearAuth: authStore.clearAuth,
    setLocked: authStore.setLocked,
    isAuthenticated: authStore.isAuthenticated,
    hasRole: authStore.hasRole,
  };
}