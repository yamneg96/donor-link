import React from 'react';
import { View, ScrollView, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useEmergency } from '../../queries/emergencyQueries';
import { 
  ChevronLeft, Droplet, MapPin, 
  Clock, AlertCircle, Share2,
  Navigation, Phone, Info
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { formatDistanceToNow } from 'date-fns';

export default function RequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: requestResponse, isLoading } = useEmergency(id);

  if (isLoading && !requestResponse) return <PageLoader message="Fetching request details..." />;

  const request = requestResponse?.data;

  if (!request) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text variant="h3">Request not found</Text>
        <Button onPress={() => router.back()} className="mt-4">
          <Text className="text-white">Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const urgencyColors = {
    LOW: 'text-info',
    NORMAL: 'text-success',
    URGENT: 'text-warning',
    CRITICAL: 'text-primary',
  };

  const urgencyBg = {
    LOW: 'bg-info/10',
    NORMAL: 'bg-success/10',
    URGENT: 'bg-warning/10',
    CRITICAL: 'bg-primary/10',
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-border/50">
        <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <Text variant="h3" className="font-bold">Urgent Request</Text>
        <Pressable className="w-10 h-10 items-center justify-center">
          <Share2 size={20} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`${urgencyBg[request.urgency]} px-6 py-10 items-center`}>
          <View className="w-24 h-24 bg-white rounded-full items-center justify-center shadow-lg mb-6 relative">
            <Droplet size={48} className={urgencyColors[request.urgency]} />
            <View className="absolute -top-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                <AlertCircle size={20} className={urgencyColors[request.urgency]} />
            </View>
          </View>
          
          <View className={`${urgencyBg[request.urgency]} border border-white px-4 py-1.5 rounded-full mb-4`}>
            <Text className={`${urgencyColors[request.urgency]} font-bold text-xs uppercase tracking-widest`}>
              {request.urgency} REQUIREMENT
            </Text>
          </View>

          <Text variant="h1" className="text-4xl font-bold mb-1">{request.bloodType}</Text>
          <Text className="text-muted-foreground font-medium">
            {request.unitsRequested} Units Needed • {request.unitsFulfilled} Fulfilled
          </Text>
        </View>

        <View className="px-6 py-8">
          <View className="flex-row items-center gap-3 mb-8 p-4 bg-muted/10 rounded-2xl">
            <Clock size={16} className="text-muted-foreground" />
            <Text variant="small" className="text-muted-foreground">
                Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </Text>
          </View>

          <Text variant="h3" className="font-bold mb-4">Patient Information</Text>
          <View className="bg-white border border-border/50 rounded-3xl p-6 mb-8">
            <Text className="text-muted-foreground leading-relaxed italic">
              "{request.reason || "Urgently needed for a surgical procedure. Any contribution is highly appreciated."}"
            </Text>
            {request.patientInfo && (
              <View className="mt-4 pt-4 border-t border-border/30">
                <Text variant="small" className="text-muted-foreground font-medium uppercase tracking-wider mb-1">Details</Text>
                <Text className="font-medium text-foreground/80">{request.patientInfo}</Text>
              </View>
            )}
          </View>

          <Text variant="h3" className="font-bold mb-4">Hospital Location</Text>
          <View className="bg-secondary/5 rounded-3xl p-6 mb-8 border border-secondary/10">
            <View className="flex-row items-start gap-4">
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                <MapPin size={24} className="text-secondary" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-lg">{request.hospitalName || "St. Paul Hospital"}</Text>
                <Text className="text-muted-foreground mb-4">Addis Ababa, Ethiopia</Text>
                
                <View className="flex-row gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-secondary/20"
                    onPress={() => Linking.openURL(`tel:+251911234567`)}
                  >
                    <Phone size={18} className="text-secondary mr-2" />
                    <Text className="text-secondary font-bold">Call</Text>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-xl border-secondary/20"
                  >
                    <Navigation size={18} className="text-secondary mr-2" />
                    <Text className="text-secondary font-bold">Map</Text>
                  </Button>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-4 mb-24 flex-row gap-4">
             <Button 
                variant="outline" 
                className="flex-1 h-16 rounded-2xl border-primary/20"
              >
                <Info size={20} className="text-primary mr-2" />
                <Text className="text-primary font-bold text-lg">Check Status</Text>
              </Button>
              <Button 
                className="flex-[1.5] h-16 rounded-2xl shadow-lg shadow-primary/20"
                onPress={() => router.push({ pathname: '/appointment/book', params: { centerId: request.hospitalId, centerName: request.hospitalName || "St. Paul Hospital" } })}
              >
                <Droplet size={20} className="text-white mr-2" />
                <Text className="text-white font-bold text-lg">Donate Now</Text>
              </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
