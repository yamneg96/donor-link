import React from 'react';
import { View, ScrollView, Pressable, Share, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useCampaignById } from '../../queries/campaignQueries';
import { 
  ChevronLeft, Calendar, MapPin, 
  Users, Share2, ArrowRight,
  Heart, Droplet, Clock,
  ShieldCheck, Info
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { format } from 'date-fns';

export default function CampaignDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: campaignResponse, isLoading } = useCampaignById(id);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Join the blood donation campaign: ${campaign?.title}. Together we can save lives! at ${campaign?.location}`,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (isLoading && !campaignResponse) return <PageLoader message="Fetching campaign details..." />;

  const campaign = campaignResponse?.data;

  if (!campaign) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-8">
        <View className="w-20 h-20 bg-muted/20 rounded-full items-center justify-center mb-6">
          <Info size={40} className="text-muted-foreground" />
        </View>
        <Text variant="h3" className="font-bold text-center">Campaign Not Found</Text>
        <Text className="text-muted-foreground text-center mt-2 mb-8">This event might have ended or been moved. Check the centers for active drives.</Text>
        <Button onPress={() => router.back()} className="w-full h-14 rounded-2xl">
          <Text className="text-white font-bold">Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const isExpired = new Date(campaign.endDate) < new Date();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-background border-b border-border/10">
        <Pressable 
          onPress={() => router.back()} 
          className="w-12 h-12 items-center justify-center rounded-2xl bg-muted/20"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <Text variant="h3" className="font-bold tracking-tight">Campaign Details</Text>
        <Pressable 
          onPress={onShare} 
          className="w-12 h-12 items-center justify-center rounded-2xl bg-muted/20"
        >
          <Share2 size={20} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Premium Hero Area */}
        <View className="px-6 pt-8 pb-10">
          <View className="bg-primary/5 rounded-[40px] p-8 border border-primary/10 relative overflow-hidden">
             <View className="absolute -top-10 -right-10">
               <Heart size={200} className="text-primary/5 fill-primary/5" />
             </View>
             
             <View className="flex-row items-center gap-2 mb-4">
               <View className="px-3 py-1 bg-primary rounded-full">
                 <Text variant="small" className="text-white font-bold uppercase tracking-wider text-[10px]">
                   {isExpired ? 'Completed' : 'Upcoming Event'}
                 </Text>
               </View>
               <View className="px-3 py-1 bg-secondary/10 rounded-full">
                 <Text variant="small" className="text-secondary font-bold uppercase tracking-wider text-[10px]">
                   Trust Score: 100%
                 </Text>
               </View>
             </View>

             <Text className="text-4xl font-black text-foreground mb-4 leading-tight tracking-tighter">
               {campaign.title}
             </Text>
             
             <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1.5">
                  <Clock size={14} className="text-muted-foreground" />
                  <Text variant="small" className="text-muted-foreground font-medium">Ends {format(new Date(campaign.endDate), 'MMM dd')}</Text>
                </View>
                <View className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                <View className="flex-row items-center gap-1.5">
                  <ShieldCheck size={14} className="text-success" />
                  <Text variant="small" className="text-success font-bold">Verified Center</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="px-6 flex-row gap-4 mb-8">
          <View className="flex-1 bg-white p-5 rounded-3xl border border-border/40 shadow-sm justify-between">
            <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mb-3">
              <Droplet size={20} className="text-primary" />
            </View>
            <View>
              <Text className="text-2xl font-black text-foreground">{campaign.targetUnits}</Text>
              <Text variant="small" className="text-muted-foreground font-medium">Target Units</Text>
            </View>
          </View>
          <View className="flex-1 bg-white p-5 rounded-3xl border border-border/40 shadow-sm justify-between">
            <View className="w-10 h-10 bg-secondary/10 rounded-xl items-center justify-center mb-3">
              <Users size={20} className="text-secondary" />
            </View>
            <View>
              <Text className="text-2xl font-black text-foreground">{campaign.currentUnits || 0}</Text>
              <Text variant="small" className="text-muted-foreground font-medium">Joined Already</Text>
            </View>
          </View>
        </View>

        {/* Content Tabs/Section */}
        <View className="px-6 space-y-8">
          <View>
            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Location & Logistics</Text>
            <Pressable className="bg-muted/20 p-5 rounded-3xl border border-border/30 flex-row items-center gap-4 active:opacity-80">
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                <MapPin size={24} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg leading-tight">{campaign.location || 'Central Blood Bank'}</Text>
                <Text variant="small" className="text-muted-foreground mt-0.5">Click to view on Map</Text>
              </View>
              <ArrowRight size={20} className="text-muted-foreground" />
            </Pressable>
          </View>

          <View>
            <Text className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Event Description</Text>
            <Text className="text-lg text-foreground/80 leading-7 font-medium">
              {campaign.description || "Join our community-wide blood drive to support local hospitals. Your donation ensures a stable supply for emergencies and surgical procedures."}
            </Text>
          </View>

          {/* Guidelines Mini-Card */}
          <View className="bg-success/5 border border-success/10 p-6 rounded-3xl flex-row gap-4">
             <View className="w-10 h-10 bg-success/10 rounded-full items-center justify-center">
                <Info size={20} className="text-success" />
             </View>
             <View className="flex-1">
               <Text className="font-bold text-success text-base mb-1">Donor Guidelines</Text>
               <Text className="text-success/70 text-sm leading-5">Stay hydrated, eat a healthy meal before, and bring a valid ID.</Text>
             </View>
          </View>
        </View>

        <View className="h-32" />
      </ScrollView>

      {/* Persistent Action Bar */}
      {!isExpired && (
        <View className="px-6 py-6 border-t border-border/10 bg-white shadow-2xl absolute bottom-0 left-0 right-0">
          <Button 
            className="h-16 rounded-2xl shadow-xl shadow-primary/20"
            onPress={() => router.push({ pathname: '/appointment/book', params: { centerId: campaign.id, centerName: campaign.title } })}
          >
            <Calendar size={20} className="text-white mr-2" />
            <Text className="text-white font-bold text-lg uppercase tracking-wider">Join Campaign Now</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
