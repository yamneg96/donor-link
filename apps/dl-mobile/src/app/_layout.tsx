import "@/global.css";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/config/queryClient";
import { useAuthStore, authStore } from "@/src/store/authStore";
import { ThemeProvider } from "@react-navigation/native";
import { NAV_THEME } from "@/src/lib/theme";
import { useColorScheme } from "nativewind";
import { PortalHost } from "@rn-primitives/portal";
import { Sun, Moon } from "lucide-react-native";
import { Pressable, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { BiometricLock } from "@/src/components/auth/BiometricLock";
import AsyncStorage from "@react-native-async-storage/async-storage";

export { ErrorBoundary } from "expo-router";

function AuthHandler() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [isSplashTiming, setIsSplashTiming] = useState(true);

  // Initialization Logic (Splash timing)
  useEffect(() => {
    const initApp = async () => {
      const timer = new Promise((resolve) => setTimeout(resolve, 3000));
      const auth = authStore.init(); 
      
      await Promise.all([timer, auth]);
      setIsSplashTiming(false);
    };
    initApp();
  }, []);

  useEffect(() => {
    // Wait for everything to be ready to avoid context errors
    if (!navigationState?.key || !isInitialized || isSplashTiming) return;

    const performRouting = () => {
      const currentSegment = segments[0] as string | undefined;

      // Auth Boundaries
      const inAuthGroup = currentSegment === "(auth)";
      const isPublicRoot = !currentSegment || currentSegment === "index" || currentSegment === "";

      if (!isAuthenticated() && !inAuthGroup && !isPublicRoot) {
        router.replace("/(auth)/login");
      } else if (isAuthenticated() && (inAuthGroup || (isPublicRoot && currentSegment !== ""))) {
        // Redirect to role-based home if on index (but not during initial onboarding phase)
        router.replace("/(donor)/home");
      }
    };

    const routeTimeout = setTimeout(performRouting, 0);
    return () => clearTimeout(routeTimeout);
  }, [isAuthenticated, isInitialized, segments, isSplashTiming, navigationState?.key]);

  return null;
}

function RootNavigation() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const { isAuthenticated, isLocked } = useAuthStore();

  // 1. Native Bar Syncing
  useEffect(() => {
    async function syncNativeBars() {
      if (Platform.OS === "android") {
        const barColor = isDark ? "#191b23" : "#faf8ff";
        const barStyle = isDark ? "light" : "dark";
        const navBar = NavigationBar as any;
        if (navBar && typeof navBar.setBackgroundColorAsync === 'function') {
           await navBar.setBackgroundColorAsync(barColor);
        }
        if (navBar && typeof navBar.setButtonStyleAsync === 'function') {
           await navBar.setButtonStyleAsync(barStyle);
        }
      }
    }
    syncNativeBars();
  }, [isDark]);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
      <AuthHandler />
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(donor)" />
        <Stack.Screen name="(hospital)" />
      </Stack>

      <View
        pointerEvents="box-none"
        style={{ top: insets.top > 0 ? insets.top + 8 : 16 }}
        className="absolute right-4 top-4 z-50"
      >
        <Pressable
          onPress={toggleColorScheme}
          className="h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-black/10 dark:bg-white/10 shadow-sm active:scale-90 transition-transform"
        >
          {isDark ? (
            <Sun size={20} color="#ffb865" strokeWidth={2.5} />
          ) : (
            <Moon size={20} color="#434655" strokeWidth={2.5} />
          )}
        </Pressable>
      </View>

      <PortalHost />
      {isAuthenticated() && isLocked && <BiometricLock />}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigation />
    </QueryClientProvider>
  );
}
