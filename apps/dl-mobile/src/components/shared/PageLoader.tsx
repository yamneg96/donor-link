import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '../ui/text';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <View className="p-8 rounded-3xl bg-card border border-border items-center shadow-xl">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
        <Text className="mt-4 font-semibold text-muted-foreground">{message}</Text>
      </View>
    </View>
  );
}
