import type { IUser, UserRole } from "../types";

interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

function loadFromStorage(): AuthState {
  try {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "null"),
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

let state = loadFromStorage();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export const authStore = {
  getState: () => state,

  setAuth(user: IUser, accessToken: string, refreshToken: string) {
    state = { user, accessToken, refreshToken };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    notify();
  },

  clearAuth() {
    state = { user: null, accessToken: null, refreshToken: null };
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  isAuthenticated: () => !!state.accessToken && !!state.user,

  hasRole: (...roles: UserRole[]) =>
    state.user ? roles.includes(state.user.role) : false,
};