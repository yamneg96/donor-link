import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { AlertCircle } from 'lucide-react-native';

interface BloodStatusProps {
  type: string;
  percentage: number;
  status: 'Critical' | 'Low' | 'Stable' | 'Good';
  isUserType?: boolean;
}

export function BloodStatusCard({ type, percentage, status, isUserType }: BloodStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Critical': return 'text-destructive';
      case 'Low': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getProgressColor = () => {
    if (status === 'Critical') return 'bg-primary';
    if (status === 'Low') return 'bg-warning';
    return 'bg-success';
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="font-semibold">
          {type}{isUserType ? ' (Your Type)' : ''}
        </Text>
        <Text className={`font-medium ${getStatusColor()}`}>
          {status}
        </Text>
      </View>
      <Progress 
        value={percentage} 
        className="h-2 bg-muted" 
        indicatorClassName={getProgressColor()} 
      />
    </View>
  );
}
