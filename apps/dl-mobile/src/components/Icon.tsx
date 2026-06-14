import React from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  GestureResponderEvent, 
  StyleProp, 
  ViewStyle 
} from 'react-native';
import * as Icons from '@expo/vector-icons';

// Restrict icon keys to valid Expo Vector Icons familias
export type IconFamily = keyof typeof Icons;

export interface AdaptiveRowProps<F extends IconFamily> {
  // Center Content
  title?: string;
  children?: React.ReactNode;
  
  // Custom Styling
  className?: string;
  textClassName?: string;
  style?: StyleProp<ViewStyle>;
  
  // Left Icon Configurations
  leftIconFamily?: F;
  leftIconName?: React.ComponentProps<typeof Icons[F]>['name'];
  leftIconSize?: number;
  leftIconColor?: string;
  
  // Right Icon Configurations
  rightIconFamily?: F;
  rightIconName?: React.ComponentProps<typeof Icons[F]>['name'];
  rightIconSize?: number;
  rightIconColor?: string;
  
  // Interaction Triggers
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export const AdaptiveRow = <F extends IconFamily>({
  title,
  children,
  className = '',
  textClassName = '',
  style,
  leftIconFamily,
  leftIconName,
  leftIconSize = 22,
  leftIconColor = 'hsl(var(--foreground))',
  rightIconFamily,
  rightIconName,
  rightIconSize = 22,
  rightIconColor = 'hsl(var(--muted-foreground))',
  onPress,
  disabled = false,
}: AdaptiveRowProps<F>) => {
  
  // Dynamic component resolving function for chosen icon set
  const renderIcon = (
    family?: F, 
    name?: any, 
    size?: number, 
    color?: string
  ) => {
    if (!family || !name) return null;
    const IconComponent = Icons[family] as React.ComponentType<any>;
    return <IconComponent name={name} size={size} color={color} />;
  };

  // Base shell swaps to interactive element seamlessly if onPress callback is active
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={disabled ? undefined : onPress}
      style={style}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ disabled }}
      className={`flex-row items-center justify-between p-3 rounded-md min-h-touch-target ${
        onPress && !disabled ? 'active:opacity-70' : ''
      } ${disabled ? 'opacity-40' : ''} ${className}`}
    >
      {/* Left Decoration Composite Context */}
      <View className="flex-row items-center flex-1 pr-2">
        {leftIconFamily && leftIconName && (
          <View className="mr-3 items-center justify-center">
            {renderIcon(leftIconFamily, leftIconName, leftIconSize, leftIconColor)}
          </View>
        )}

        {/* Core Payload: Prioritize raw children tree nodes over static strings */}
        {children ? (
          children
        ) : (
          <Text 
            numberOfLines={1} 
            className={`text-base font-semibold text-foreground ${textClassName}`}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Right Accessory Composite Context */}
      {rightIconFamily && rightIconName && (
        <View className="ml-2 items-center justify-center">
          {renderIcon(rightIconFamily, rightIconName, rightIconSize, rightIconColor)}
        </View>
      )}
    </Container>
  );
};