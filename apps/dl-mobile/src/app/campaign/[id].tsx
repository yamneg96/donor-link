import React from 'react';
import { View, ScrollView, Pressable, Image, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useCampaignById } from '../../queries/campaignQueries';
import { 
  ChevronLeft, Calendar, MapPin, 
  Users, Share2, Info, ArrowRight,
  Heart, Droplet
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { format } from 'date-fns';

export default function CampaignDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaignResponse, isLoading } = useCampaignById(id);

  if (isLoading && !campaignResponse) return <PageLoader message="Loading campaign details..." />;

  const campaign = campaignResponse?.data;

  if (!campaign) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text variant="h3">Campaign not found</Text>
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
        <Text variant="h3" className="font-bold">Campaign</Text>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Share2 size={20} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Placeholder Hero Image or Brand Area */}
        <View className="h-64 bg-primary/10 relative">
          <View className="absolute inset-0 items-center justify-center">
            <Heart size={80} className="text-primary/10 fill-primary/5" />
          </View>
          <View className="absolute bottom-6 left-6 right-6">
            <View className="bg-primary px-3 py-1.5 rounded-lg self-start mb-3">
              <Text variant="small" className="text-white font-bold uppercase tracking-wider">Active Event</Text>
            </View>
            <Text variant="h1" className="text-foreground font-bold text-3xl shadow-sm">{campaign.title}</Text>
          </View>
        </View>

        <View className="px-6 py-8">
          <View className="flex-row justify-between mb-8">
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                <Calendar size={22} className="text-primary" />
              </View>
              <View>
                <Text variant="small" className="text-muted-foreground">Date</Text>
                <Text className="font-bold">{format(new Date(campaign.startDate), 'MMM dd, yyyy')}</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-12 h-12 bg-secondary/10 rounded-2xl items-center justify-center">
                <Users size={22} className="text-secondary" />
              </View>
              <View>
                <Text variant="small" className="text-muted-foreground">Target</Text>
                <Text className="font-bold">{campaign.targetUnits} Donors</Text>
              </View>
            </View>
          </View>

          <Text variant="h3" className="font-bold mb-4">About Campaign</Text>
          <Text className="text-muted-foreground leading-relaxed mb-8">
            {campaign.description || "Join us in this mission to ensure no patient goes without blood. This campaign aims to gather donors for emergency supplies in the regional hospital center. Your single contribution can save up to 3 lives."}
          </Text>

          <View className="bg-muted/20 rounded-3xl p-6 mb-8 border border-border/50">
            <View className="flex-row items-start gap-4 mb-6">
               <View className="w-10 h-10 bg-white rounded-xl items-center justify-center">
                <MapPin size={20} className="text-foreground/70" />
              </View>
              <View className="flex-1">
                <Text className="font-bold">Location</Text>
                <Text className="text-muted-foreground">{campaign.location || "Central Hospital Park, Addis Ababa"}</Text>
                <Text className="text-primary font-bold mt-1">Open in Maps</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between p-4 bg-white rounded-2xl">
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 bg-success/10 rounded-full items-center justify-center">
                  <Droplet size={16} className="text-success" />
                </View>
                <Text className="font-medium">{campaign.currentUnits || 0} Donors Joined</Text>
              </View>
              <ArrowRight size={18} className="text-muted-foreground" />
            </View>
          </View>

          <Button 
            className="h-16 rounded-2xl shadow-lg shadow-primary/20 mb-20"
            onPress={() => router.push({ pathname: '/appointment/book', params: { centerId: campaign.centerId || campaign.id, centerName: campaign.title } })}
          >
            <Calendar size={20} className="text-white mr-2" />
            <Text className="text-white font-bold text-lg">Join Campaign</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
