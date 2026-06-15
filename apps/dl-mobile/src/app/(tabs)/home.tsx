import React from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Text } from '../../components/ui/text';
import { StatCard } from '../../components/cards/StatCard';
import { ImpactCard } from '../../components/cards/ImpactCard';
import { EmergencyCard } from '../../components/cards/EmergencyCard';
import { CampaignCard } from '../../components/cards/CampaignCard';
import { BloodStatusCard } from '../../components/cards/BloodStatusCard';
import { useDashboard } from '../../queries/dashboardQueries';
import { useCampaigns } from '../../queries/campaignQueries';
import { useEmergencies } from '../../queries/emergencyQueries';
import { useAuthStore } from '../../store/authStore';
import { Bell, Search, Droplet, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { PageLoader } from '../../components/shared/PageLoader';

export default function Home() {
  const { user } = useAuthStore();
  const { data: dashboard, isLoading: dashLoading, refetch: refetchDash } = useDashboard();
  const { data: campaigns, isLoading: campLoading, refetch: refetchCamp } = useCampaigns({ active: true });
  const { data: emergencies, isLoading: emerLoading, refetch: refetchEmer } = useEmergencies();

  const isRefreshing = dashLoading || campLoading || emerLoading;

  const onRefresh = () => {
    refetchDash();
    refetchCamp();
    refetchEmer();
  };

  if (dashLoading && !dashboard) return <PageLoader message="Loading your dashboard..." />;

  const stats = dashboard?.data?.stats || { totalDonations: 0, livesSaved: 0, rank: 'New Donor' };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="px-6 py-4 flex-row justify-between items-center bg-background">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
            <User size={24} className="text-primary" />
          </View>
          <View>
            <Text className="text-muted-foreground text-xs font-medium">Welcome back,</Text>
            <Text className="font-bold text-lg">{user?.firstName || 'Hero'}</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable className="p-2.5 bg-muted/40 rounded-2xl">
            <Search size={22} className="text-foreground" />
          </Pressable>
          <Pressable className="p-2.5 bg-muted/40 rounded-2xl" onPress={() => router.push('/notifications')}>
            <Bell size={22} className="text-foreground" />
          </Pressable>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="hsl(var(--primary))" />
        }
      >
        <View className="px-6 pb-24">
          {/* Emergency Section */}
          {emergencies?.data && emergencies.data.length > 0 && (
            <View className="mt-4">
              <Text variant="h3" className="mb-4 font-bold">Urgent Needs</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                {emergencies.data.map((request: any, index: number) => (
                  <View key={request.id || `emergency-${index}`} className="mr-4 w-[300px]">
                    <EmergencyCard 
                      request={request}
                      onPress={() => router.push({ pathname: '/request/[id]', params: { id: request.id } })}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Quick Stats Grid */}
          <View className="flex-row gap-4 mt-6">
            <View className="flex-1">
              <StatCard 
                title="Donations"
                value={stats.totalDonations.toString()}
                icon={Droplet}
                trend="+1 this month"
              />
            </View>
            <View className="flex-1">
              <ImpactCard 
                title="Lives Saved"
                value={stats.livesSaved.toString()}
                subtitle="Community Impact"
              />
            </View>
          </View>

          {/* Blood Stock Status (Optional/Placeholder based on design) */}
          <View className="mt-6">
            <BloodStatusCard 
              type="O+"
              status="Critical"
              percentage={15}
            />
          </View>

          {/* Active Campaigns */}
          <View className="mt-8">
            <View className="flex-row justify-between items-end mb-4">
              <Text variant="h3" className="font-bold">Events & Drives</Text>
              <Pressable onPress={() => router.push('/(tabs)/centers')}>
                <Text className="text-primary font-bold">See All</Text>
              </Pressable>
            </View>
            {campaigns?.data?.map((campaign: any, index: number) => (
              <CampaignCard 
                key={campaign.id || `campaign-${index}`} 
                campaign={campaign}
                onPress={() => router.push({ pathname: '/campaign/[id]', params: { id: campaign.id } })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
