import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { BloodType } from '../../types';

interface BloodTypeSelectorProps {
  value: BloodType | '';
  onChange: (value: BloodType) => void;
}

const BLOOD_TYPES = Object.values(BloodType);

export function BloodTypeSelector({ value, onChange }: BloodTypeSelectorProps) {
  return (
    <View className="flex-row flex-wrap gap-3 justify-between">
      {BLOOD_TYPES.map((type) => {
        const isSelected = value === type;
        return (
          <Pressable
            key={type}
            onPress={() => onChange(type)}
            className={`w-[22%] aspect-square items-center justify-center rounded-2xl border-2 ${
              isSelected ? 'bg-primary border-primary' : 'bg-muted/30 border-transparent'
            }`}
          >
            <Text className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-foreground'}`}>
              {type}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
