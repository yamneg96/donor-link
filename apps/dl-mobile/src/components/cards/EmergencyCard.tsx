import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { BloodRequest, RequestUrgency } from '../../types';
import { Clock, MapPin, Droplet } from 'lucide-react-native';

interface EmergencyCardProps {
  request: BloodRequest;
  onPress: () => void;
}

export function EmergencyCard({ request, onPress }: EmergencyCardProps) {
  const isCritical = request.urgency === RequestUrgency.CRITICAL;

  return (
    <Pressable onPress={onPress}>
      <Card className={`mb-4 ${isCritical ? 'border-primary/20 bg-primary/5' : ''}`}>
        <CardContent className="p-4">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center gap-2">
              <View className={`w-10 h-10 rounded-full items-center justify-center ${isCritical ? 'bg-primary' : 'bg-muted'}`}>
                <Text className={`font-bold ${isCritical ? 'text-white' : 'text-primary'}`}>
                  {request.bloodType}
                </Text>
              </View>
              <View>
                <Text className="font-bold">{request.hospitalName || 'Health Center'}</Text>
                <View className="flex-row items-center gap-1">
                  <MapPin size={12} className="text-muted-foreground" />
                  <Text variant="small" className="text-muted-foreground">Addis Ababa</Text>
                </View>
              </View>
            </View>
            <Badge variant={isCritical ? 'destructive' : 'secondary'}>
              {request.urgency}
            </Badge>
          </View>
          
          <View className="flex-row justify-between items-center mt-2">
            <View className="flex-row items-center gap-1">
              <Droplet size={14} className="text-primary" />
              <Text variant="small" className="font-medium">
                {request.unitsRequested} units needed
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={14} className="text-muted-foreground" />
              <Text variant="small" className="text-muted-foreground">2h ago</Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
