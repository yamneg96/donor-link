import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NavTabItemProps {
  label: string;
  iconName: React.ComponentProps<typeof MaterialIcons>['name'];
  focused: boolean;
}

export const NavTabItem = ({ label, iconName, focused }: NavTabItemProps) => {
  return (
    <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-transparent">
      <MaterialIcons 
        name={iconName} 
        size={20} 
        color={focused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} 
      />
      <Text 
        className={`font-semibold text-sm ${
          focused ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </Text>
    </View>
  );
};