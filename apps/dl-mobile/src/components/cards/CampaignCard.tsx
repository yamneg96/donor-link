import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '../ui/text';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Campaign } from '../../types';
import { Calendar, MapPin, Droplet } from 'lucide-react-native';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="mb-4 overflow-hidden">
        {campaign.imageUrl && (
          <Image 
            source={{ uri: campaign.imageUrl }} 
            className="w-full h-40 object-cover"
          />
        )}
        <CardContent className="p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="font-bold text-lg flex-1 mr-2">{campaign.title}</Text>
            <Badge variant="outline" className="border-secondary text-secondary">
              Active
            </Badge>
          </View>
          
          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-row items-center gap-1">
              <Calendar size={14} className="text-muted-foreground" />
              <Text variant="small" className="text-muted-foreground">
                {new Date(campaign.startDate).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MapPin size={14} className="text-muted-foreground" />
              <Text variant="small" className="text-muted-foreground">
                {campaign.location}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {campaign.bloodTypesNeeded?.map(type => (
              <View key={type} className="flex-row items-center gap-1 bg-muted px-2 py-1 rounded-md">
                <Droplet size={10} className="text-primary" />
                <Text className="text-[10px] font-bold">{type}</Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </Pressable>
  );
}
