import React from 'react';
import { View, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useCenter } from '../../queries/centerQueries';
import { 
  MapPin, Phone, Clock, Info, 
  ChevronLeft, Navigation, Globe, 
  Calendar, Droplet, Share2
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';

export default function CenterDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: centerResponse, isLoading } = useCenter(id);

  if (isLoading && !centerResponse) return <PageLoader message="Loading center details..." />;

  const center = centerResponse?.data;

  if (!center) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text variant="h3">Center not found</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <Text className="text-white">Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-border/50">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <Text variant="h3" className="font-bold">Center Details</Text>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Share2 size={20} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 px-6 py-10 items-center">
          <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-sm mb-6">
            <Droplet size={40} className="text-primary" />
          </View>
          <Text variant="h2" className="text-center font-bold mb-2">{center.name}</Text>
          <View className="flex-row items-center gap-1">
            <MapPin size={14} className="text-muted-foreground" />
            <Text className="text-muted-foreground font-medium text-center">{center.address}</Text>
          </View>
        </View>

        <View className="px-6 py-8">
          <View className="flex-row gap-4 mb-8">
            <Button 
              className="flex-1 h-14 bg-primary rounded-2xl flex-row items-center justify-center"
              onPress={() => router.push({ pathname: '/appointment/book', params: { centerId: center.id, centerName: center.name } })}
            >
              <Calendar size={20} className="text-white mr-2" />
              <Text className="text-white font-bold text-lg">Book Slot</Text>
            </Button>
            <Button 
              variant="outline"
              className="w-14 h-14 rounded-2xl border-primary/20 bg-primary/5 items-center justify-center"
              onPress={() => Linking.openURL(`tel:${center.phone || '+251911234567'}`)}
            >
              <Phone size={24} className="text-primary" />
            </Button>
          </View>

          <Text variant="h3" className="font-bold mb-4">Location Info</Text>
          <View className="bg-muted/20 rounded-3xl p-5 gap-6">
            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                <Clock size={20} className="text-foreground/70" />
              </View>
              <View>
                <Text className="font-bold">Working Hours</Text>
                <Text className="text-muted-foreground">Mon - Sat: 8:00 AM - 6:00 PM</Text>
                <Text className="text-muted-foreground text-xs mt-0.5">Closed on Sundays & holidays</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                <Navigation size={20} className="text-foreground/70" />
              </View>
              <View className="flex-1">
                <Text className="font-bold">Directions</Text>
                <Text className="text-muted-foreground">{center.city}, {center.region}</Text>
                <Text className="text-primary font-bold mt-1">Open in Maps</Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                <Info size={20} className="text-foreground/70" />
              </View>
              <View className="flex-1">
                <Text className="font-bold">Donation Types</Text>
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {['Whole Blood', 'Plasma', 'Platelets'].map((type) => (
                    <View key={type} className="bg-primary/10 px-3 py-1.5 rounded-full">
                      <Text variant="small" className="text-primary font-bold">{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View className="mt-8 mb-20 bg-secondary/5 rounded-3xl p-6 border border-secondary/10">
            <Text className="text-secondary font-bold text-lg mb-2">Did you know?</Text>
            <Text className="text-muted-foreground leading-relaxed">
              One donation can save up to three lives. This center has helped over 5,000 donors save lives this year alone.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
