import React from 'react';
import { View, ScrollView, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { useNotifications, useMarkAsRead } from '../../queries/notificationQueries';
import { 
  ChevronLeft, Bell, BellOff, 
  Droplet, Calendar, AlertTriangle,
  Circle, CheckCircle2
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/src/components/ui/button';

export default function NotificationCenter() {
  const { data: notificationsResponse, isLoading, refetch, isRefetching } = useNotifications();
  const markAsRead = useMarkAsRead();

  if (isLoading && !notificationsResponse) return <PageLoader message="Fetching notifications..." />;

  const notifications = notificationsResponse?.data || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY_REQUEST': return <AlertTriangle size={20} className="text-primary" />;
      case 'APPOINTMENT_REMINDER': return <Calendar size={20} className="text-secondary" />;
      case 'CAMPAIGN_UPDATE': return <Droplet size={20} className="text-info" />;
      default: return <Bell size={20} className="text-muted-foreground" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'EMERGENCY_REQUEST': return 'bg-primary/10';
      case 'APPOINTMENT_REMINDER': return 'bg-secondary/10';
      case 'CAMPAIGN_UPDATE': return 'bg-info/10';
      default: return 'bg-muted/10';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-border/50">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
            <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text variant="h3" className="font-bold">Notifications</Text>
        </View>
        <Pressable className="w-10 h-10 items-center justify-center">
           <Text className="text-primary font-bold text-xs">Clear</Text>
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-40 px-10">
            <View className="w-24 h-24 bg-muted/10 rounded-full items-center justify-center mb-6">
              <BellOff size={40} className="text-muted-foreground/30" />
            </View>
            <Text variant="h3" className="text-center font-bold mb-2">No notifications yet</Text>
            <Text className="text-muted-foreground text-center">
              We'll notify you when there are new blood requests or updates on your appointments.
            </Text>
          </View>
        ) : (
          <View className="py-4">
            {notifications.map((notification: any) => (
              <Pressable 
                key={notification.id}
                onPress={() => {
                  if (!notification.isRead) markAsRead.mutate(notification.id);
                  if (notification.data?.screen) {
                    router.push({ pathname: notification.data.screen, params: notification.data.params });
                  }
                }}
                className={`px-6 py-5 flex-row gap-4 border-b border-border/30 ${notification.isRead ? 'bg-transparent' : 'bg-primary/5'}`}
              >
                <View className={`w-12 h-12 rounded-2xl items-center justify-center ${getBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </View>
                
                <View className="flex-1">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className={`font-bold text-base flex-1 mr-2 ${notification.isRead ? 'text-foreground/80' : 'text-foreground'}`}>
                      {notification.title}
                    </Text>
                    {!notification.isRead && (
                      <Circle size={8} className="text-primary fill-primary mt-2" />
                    )}
                  </View>
                  
                  <Text className="text-muted-foreground leading-snug mb-2">
                    {notification.message}
                  </Text>
                  
                  <Text variant="small" className="text-muted-foreground/60 font-medium">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {notifications.length > 0 && (
        <View className="p-6 bg-white border-t border-border/50">
            <Button variant="outline" className="h-12 rounded-xl border-primary/20">
                <CheckCircle2 size={18} className="text-primary mr-2" />
                <Text className="text-primary font-bold">Mark all as read</Text>
            </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
