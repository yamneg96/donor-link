import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { Heart } from 'lucide-react-native';

interface ImpactCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export function ImpactCard({ title, value, subtitle }: ImpactCardProps) {
  return (
    <Card className="flex-1 bg-secondary/5 border-secondary/10">
      <CardContent className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-10 h-10 bg-secondary/10 rounded-xl items-center justify-center">
            <Heart size={20} className="text-secondary fill-secondary" />
          </View>
        </View>
        <Text variant="small" className="text-muted-foreground font-medium mb-1">{title}</Text>
        <Text className="text-2xl font-bold text-secondary">{value}</Text>
        <Text variant="small" className="text-muted-foreground mt-1">{subtitle}</Text>
      </CardContent>
    </Card>
  );
}
