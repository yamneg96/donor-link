import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasShownSplashThisSession: boolean;
  isInitialized: boolean;
}

let onboardingState: OnboardingState = {
  hasCompletedOnboarding: false,
  hasShownSplashThisSession: false,
  isInitialized: false,
};

const listeners = new Set<() => void>();

export const onboardingStore = {
  getState: () => onboardingState,

  async init() {
    try {
      const value = await AsyncStorage.getItem("@has_onboarded");
      onboardingState = {
        ...onboardingState,
        hasCompletedOnboarding: value === "true",
        isInitialized: true,
      };
      listeners.forEach((l) => l());
    } catch {
      onboardingState = { ...onboardingState, isInitialized: true };
      listeners.forEach((l) => l());
    }
  },

  setHasCompletedOnboarding: async (value: boolean) => {
    onboardingState = { ...onboardingState, hasCompletedOnboarding: value };
    await AsyncStorage.setItem("@has_onboarded", value ? "true" : "false");
    listeners.forEach((l) => l());
  },

  setHasShownSplash: (value: boolean) => {
    onboardingState = { ...onboardingState, hasShownSplashThisSession: value };
    listeners.forEach((l) => l());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useOnboardingStore() {
  const [state, setState] = useState(onboardingStore.getState());

  useEffect(() => {
    return onboardingStore.subscribe(() => setState(onboardingStore.getState()));
  }, []);

  return {
    ...state,
    init: onboardingStore.init,
    setHasCompletedOnboarding: onboardingStore.setHasCompletedOnboarding,
    setHasShownSplash: onboardingStore.setHasShownSplash,
  };
}
