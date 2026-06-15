import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/src/hooks/useColorScheme';
import { NAV_THEME } from '@/lib/theme';
import { useAuthStore } from '@/src/store/authStore';
import { setupNotificationHandlers } from '@/src/notifications/notificationHandler';
import { setupOfflineManager } from '@/src/offline/offlineManager';
import { AnimatedSplash } from '@/src/components/shared/AnimatedSplash';
import { FloatingThemeToggle } from '@/src/components/shared/FloatingThemeToggle';
import '../../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { hydrate, isLoading } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    let cleanupNotifications: (() => void) | undefined;
    let cleanupOffline: (() => void) | undefined;

    async function prepare() {
      try {
        await hydrate();
        // Initialize services
        cleanupNotifications = setupNotificationHandlers();
        cleanupOffline = setupOfflineManager();
        
        setIsReady(true);
      } catch (e) {
        console.warn('Initialization error:', e);
        setIsReady(true);
      }
    }

    prepare();
    
    console.log('[RootLayout] Initial colorScheme:', colorScheme);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => {
      cleanupNotifications?.();
      cleanupOffline?.();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.log('[RootLayout] colorScheme changed to:', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (isReady && !isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isReady, isLoading]);

  if (!isReady || isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme as 'light' | 'dark']}>
        <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
          {showSplash && <AnimatedSplash />}
          {!showSplash && <FloatingThemeToggle />}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          </Stack>
          <PortalHost />
        </View>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
