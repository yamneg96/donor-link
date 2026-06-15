import React from 'react';
import { View, TextInput, TextInputProps, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { LucideIcon } from 'lucide-react-native';
import { Controller, Control } from 'react-hook-form';

interface FormInputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label?: string;
  icon?: LucideIcon;
  rightIcon?: LucideIcon;
  onPressRightIcon?: () => void;
  error?: string;
}

export function FormInput({ 
  name, 
  control, 
  label, 
  icon: Icon, 
  rightIcon: RightIcon,
  onPressRightIcon,
  error, 
  ...props 
}: FormInputProps) {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text variant="small" className="mb-1.5 font-bold text-muted-foreground ml-1">
          {label}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className={`flex-row items-center bg-muted/30 rounded-2xl px-4 h-14 border ${error ? 'border-primary' : 'border-transparent'}`}>
            {Icon && <Icon size={20} className="text-muted-foreground mr-3" />}
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="hsl(var(--muted-foreground))"
              className="flex-1 text-foreground font-medium"
              {...props}
            />
            {RightIcon && (
              <Pressable onPress={onPressRightIcon} className="ml-2">
                <RightIcon size={20} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
        )}
      />
      {error && (
        <Text variant="small" className="text-primary mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
