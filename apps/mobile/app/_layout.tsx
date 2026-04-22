import "../global.css";
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { mobileAuthStore } from "../store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
    mutations: { retry: 0 },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    mobileAuthStore.init().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    const isAuth = mobileAuthStore.isAuthenticated();
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuth && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuth && inAuthGroup) {
      router.replace("/(donor)/home");
    }
  }, [ready, segments]);

  if (!ready) return <View className="flex-1 bg-[#FFF8F7]" />;
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGuard>
    </QueryClientProvider>
  );
}