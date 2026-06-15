import React, { useEffect, useState } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onRemove: (id: string) => void;
}

export function Toast({ id, type, message, onRemove }: ToastProps) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(id));
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-success" />;
      case 'error': return <AlertCircle size={18} className="text-destructive" />;
      case 'info': return <Info size={18} className="text-info" />;
    }
  };

  return (
    <Animated.View 
      style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}
      className="bg-card w-full max-w-[90%] flex-row items-center gap-3 p-4 rounded-2xl shadow-lg border border-border mt-3"
    >
      {getIcon()}
      <Text className="flex-1 font-medium">{message}</Text>
      <Pressable onPress={() => onRemove(id)}>
        <X size={16} className="text-muted-foreground" />
      </Pressable>
    </Animated.View>
  );
}
