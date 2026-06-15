import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { LucideIcon, Search, BellOff, CalendarX, Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  type?: 'search' | 'notifications' | 'appointments' | 'general';
}

export function EmptyState({ title, message, icon: CustomIcon, actionText, onAction, type = 'general' }: EmptyStateProps) {
  const getIcon = () => {
    if (CustomIcon) return <CustomIcon size={64} className="text-muted-foreground/30" />;
    switch (type) {
      case 'search': return <Search size={64} className="text-muted-foreground/30" />;
      case 'notifications': return <BellOff size={64} className="text-muted-foreground/30" />;
      case 'appointments': return <CalendarX size={64} className="text-muted-foreground/30" />;
      default: return <Inbox size={64} className="text-muted-foreground/30" />;
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-8">
      <View className="mb-6 p-6 rounded-full bg-muted/20">
        {getIcon()}
      </View>
      <Text variant="h3" className="text-center mb-2">{title}</Text>
      <Text className="text-center text-muted-foreground mb-8">
        {message}
      </Text>
      {actionText && onAction && (
        <Button variant="outline" onPress={onAction} className="rounded-xl px-8 h-12">
          <Text className="font-bold text-base">{actionText}</Text>
        </Button>
      )}
    </View>
  );
}
