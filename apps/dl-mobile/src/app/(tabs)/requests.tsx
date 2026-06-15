import React, { useState } from 'react';
import { View, ScrollView, Pressable, RefreshControl, TextInput } from 'react-native';
import { Text } from '../../components/ui/text';
import { EmergencyCard } from '../../components/cards/EmergencyCard';
import { useEmergencies } from '../../queries/emergencyQueries';
import { Search, Filter, Droplet, MapPin, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { router } from 'expo-router';
import { BloodType } from '../../types';

export default function Requests() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<BloodType | null>(null);
  const { data: requests, isLoading, refetch } = useEmergencies();

  const filteredRequests = requests?.data?.filter((req: any) => {
    const patientName = req.patientName || '';
    const hospital = req.hospital || '';
    const searchTerm = (search || '').toLowerCase().trim();

    const matchesSearch = patientName.toLowerCase().includes(searchTerm) || 
                         hospital.toLowerCase().includes(searchTerm);
    const matchesType = !selectedType || req.bloodType === selectedType;
    return matchesSearch && matchesType;
  });

  if (isLoading && !requests) return <PageLoader message="Finding blood requests..." />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="px-6 py-4">
        <Text variant="h1" className="font-bold mb-6">Blood Requests</Text>
        
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 flex-row items-center bg-muted/40 rounded-2xl px-4 h-14 border border-transparent focus:border-primary">
            <Search size={20} className="text-muted-foreground mr-3" />
            <TextInput 
              placeholder="Search hospital or patient..." 
              className="flex-1 text-foreground font-medium"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')}>
                <X size={18} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
          <Pressable className="w-14 h-14 bg-primary/10 rounded-2xl items-center justify-center">
            <Filter size={24} className="text-primary" />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-6 px-6 h-10">
          <Pressable 
            onPress={() => setSelectedType(null)}
            className={`px-6 h-10 rounded-full items-center justify-center mr-2 border ${!selectedType ? 'bg-primary border-primary' : 'bg-muted/20 border-border'}`}
          >
            <Text className={`font-bold ${!selectedType ? 'text-white' : 'text-foreground'}`}>All Types</Text>
          </Pressable>
          {Object.values(BloodType).map((type) => (
            <Pressable 
              key={type}
              onPress={() => setSelectedType(type)}
              className={`px-6 h-10 rounded-full items-center justify-center mr-2 border ${selectedType === type ? 'bg-primary border-primary' : 'bg-muted/20 border-border'}`}
            >
              <Text className={`font-bold ${selectedType === type ? 'text-white' : 'text-foreground'}`}>{type}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="hsl(var(--primary))" />}
      >
        <View className="pb-24">
          {filteredRequests?.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 bg-muted/20 rounded-full items-center justify-center mb-6">
                <Droplet size={40} className="text-muted-foreground/30" />
              </View>
              <Text variant="h3" className="text-muted-foreground">No requests found</Text>
              <Text className="text-muted-foreground text-center mt-2 px-10">
                Try adjusting your search or filters to find more blood requests.
              </Text>
            </View>
          ) : (
            filteredRequests?.map((request: any, index: number) => (
              <View key={request.id || `${request.patientName}-${index}`} className="mb-4">
                <EmergencyCard 
                  request={request}
                  onPress={() => router.push({ pathname: '/request/[id]', params: { id: request.id } })}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
