import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '../../components/ui/text';
import { Card, CardContent } from '../../components/ui/card';
import { useDashboard } from '../../queries/dashboardQueries';
import { Heart, Droplet, Users, Award, ChevronRight, TrendingUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';

export default function Impact() {
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading && !dashboard) return <PageLoader message="Calculating your impact..." />;

  const stats = dashboard?.data?.stats || { totalDonations: 0, livesSaved: 0, rank: 'New Donor', nextMilestone: 5 };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text variant="h1" className="font-bold mt-4 mb-6">Your Impact</Text>

        <Card className="bg-primary/5 border-primary/10 mb-8 overflow-hidden">
          <CardContent className="p-0">
            <View className="bg-primary p-6 items-center">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4 border border-white/30">
                <Award size={40} className="text-white" />
              </View>
              <Text className="text-white font-bold text-2xl mb-1">{stats.rank}</Text>
              <Text className="text-white/80 font-medium">Hero Donor</Text>
            </View>
            <View className="p-6">
              <View className="flex-row justify-between mb-2">
                <Text className="font-bold">Next Rank Progress</Text>
                <Text className="text-primary font-bold">{stats.totalDonations}/{stats.nextMilestone}</Text>
              </View>
              <View className="h-2 bg-primary/10 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-primary" 
                  style={{ width: `${(stats.totalDonations / stats.nextMilestone) * 100}%` }} 
                />
              </View>
              <Text variant="small" className="text-muted-foreground mt-3 text-center">
                Donate {stats.nextMilestone - stats.totalDonations} more times to reach the next level!
              </Text>
            </View>
          </CardContent>
        </Card>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-secondary/5 rounded-3xl p-5 border border-secondary/10">
            <Heart size={24} className="text-secondary mb-3 fill-secondary" />
            <Text className="text-2xl font-bold text-secondary">{stats.livesSaved}</Text>
            <Text variant="small" className="text-muted-foreground font-medium">Lives Saved</Text>
          </View>
          <View className="flex-1 bg-primary/5 rounded-3xl p-5 border border-primary/10">
            <Droplet size={24} className="text-primary mb-3 fill-primary" />
            <Text className="text-2xl font-bold text-primary">{stats.totalDonations}</Text>
            <Text variant="small" className="text-muted-foreground font-medium">Total Donations</Text>
          </View>
        </View>

        <Text variant="h3" className="font-bold mb-4">Milestones</Text>
        <View className="gap-3 mb-24">
          {[
            { title: 'First Drop', desc: 'Completed first donation', date: 'Oct 12, 2023', icon: Droplet, color: 'text-primary' },
            { title: 'Life Saver', desc: 'Saved 3 lives in total', date: 'Jan 05, 2024', icon: Heart, color: 'text-secondary' },
            { title: 'Consistent Hero', desc: 'Donated 3 times in a year', date: 'In Progress', icon: Award, color: 'text-amber-500' },
          ].map((item, i) => (
            <Pressable key={i} className="flex-row items-center bg-muted/20 p-5 rounded-2xl border border-transparent active:border-primary/20">
              <View className={`w-12 h-12 bg-white rounded-xl items-center justify-center mr-4 shadow-sm`}>
                <item.icon size={22} className={item.color} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg">{item.title}</Text>
                <Text variant="small" className="text-muted-foreground">{item.desc}</Text>
              </View>
              <Text variant="small" className="text-muted-foreground">{item.date}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
