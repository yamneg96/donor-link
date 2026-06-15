import React from 'react';
import { View, Modal, Pressable, Animated } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export type StatusType = 'success' | 'error' | 'info';

interface StatusModalProps {
  visible: boolean;
  type: StatusType;
  title: string;
  message: string;
  onClose: () => void;
  actionText?: string;
  onAction?: () => void;
}

export function StatusModal({ visible, type, title, message, onClose, actionText, onAction }: StatusModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={48} className="text-success" />;
      case 'error': return <AlertCircle size={48} className="text-destructive" />;
      case 'info': return <Info size={48} className="text-info" />;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center px-6">
        <BlurView intensity={20} tint="dark" className="absolute inset-0" />
        
        <View className="bg-white dark:bg-card w-full rounded-3xl p-6 shadow-2xl items-center border border-border">
          <Pressable 
            onPress={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-muted"
          >
            <X size={16} className="text-muted-foreground" />
          </Pressable>

          <View className="mb-6 mt-4">
            {getIcon()}
          </View>

          <Text variant="h2" className="text-center mb-2 font-bold">{title}</Text>
          <Text className="text-center text-muted-foreground mb-8 line-height-24">
            {message}
          </Text>

          <Button 
            className="w-full h-14 rounded-2xl"
            onPress={onAction || onClose}
          >
            <Text className="text-white font-bold text-lg">{actionText || 'Continue'}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
