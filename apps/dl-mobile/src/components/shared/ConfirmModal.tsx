import React from 'react';
import { View, Modal, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmModal({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = false
}: ConfirmModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center px-6">
        <BlurView intensity={20} tint="dark" className="absolute inset-0" />
        <View className="bg-white dark:bg-card rounded-3xl p-6 shadow-2xl border border-border">
          <View className="flex-row items-center gap-3 mb-4">
            <View className={`p-2 rounded-full ${isDestructive ? 'bg-destructive/10' : 'bg-primary/10'}`}>
              <AlertTriangle size={20} className={isDestructive ? 'text-destructive' : 'text-primary'} />
            </View>
            <Text variant="h3" className="font-bold">{title}</Text>
          </View>
          
          <Text className="text-muted-foreground mb-8 text-base">
            {message}
          </Text>

          <View className="flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onPress={onCancel}
            >
              <Text className="font-bold">{cancelText}</Text>
            </Button>
            <Button 
              variant={isDestructive ? 'destructive' : 'default'}
              className="flex-1 h-12 rounded-xl"
              onPress={onConfirm}
            >
              <Text className="text-white font-bold">{confirmText}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
