import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: string;
}

export function StatCard({ title, value, icon: Icon, subtitle, trend }: StatCardProps) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center">
            <Icon size={20} className="text-primary" />
          </View>
          {trend && (
            <Text variant="small" className="text-success font-bold">{trend}</Text>
          )}
        </View>
        <Text variant="small" className="text-muted-foreground font-medium mb-1">{title}</Text>
        <Text className="text-2xl font-bold">{value}</Text>
        {subtitle && (
          <Text variant="small" className="text-muted-foreground mt-1">{subtitle}</Text>
        )}
      </CardContent>
    </Card>
  );
}
