import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { MapPin, Phone, Clock, ChevronRight } from 'lucide-react-native';

interface CenterCardProps {
  center: any;
  onPress: () => void;
}

export function CenterCard({ center, onPress }: CenterCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="mb-4">
        <CardContent className="p-4 flex-row items-center gap-4">
          <View className="bg-secondary/10 p-3 rounded-2xl">
            <MapPin size={24} className="text-secondary" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-base mb-1">{center.name}</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Clock size={12} className="text-muted-foreground" />
                <Text variant="small" className="text-muted-foreground">8 AM - 6 PM</Text>
              </View>
              {center.distance && (
                <Text variant="small" className="text-secondary font-medium">{center.distance} km away</Text>
              )}
            </View>
            <View className="flex-row items-center gap-1 mt-1">
              <Phone size={12} className="text-muted-foreground" />
              <Text variant="small" className="text-muted-foreground">+251 911 234 567</Text>
            </View>
          </View>
          <ChevronRight size={20} className="text-muted-foreground" />
        </CardContent>
      </Card>
    </Pressable>
  );
}
