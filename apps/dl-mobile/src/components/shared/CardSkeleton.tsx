import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface CardSkeletonProps {
  height?: number;
}

export function CardSkeleton({ height = 120 }: CardSkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={{ opacity, height }}
      className="w-full bg-muted rounded-2xl mb-4"
    />
  );
}
