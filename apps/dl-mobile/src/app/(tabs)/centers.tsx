import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, RefreshControl } from 'react-native';
import { Text } from '../../components/ui/text';
import { CenterCard } from '../../components/cards/CenterCard';
import { useCenters } from '../../queries/centerQueries'; // Assuming this exists or will be created
import { Search, MapPin, Navigation, Phone, Clock, Filter, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageLoader } from '../../components/shared/PageLoader';
import { router } from 'expo-router';

export default function Centers() {
  const [search, setSearch] = useState('');
  const { data: centers, isLoading, refetch } = useCenters();

  const filteredCenters = centers?.data?.filter((center: any) => {
    const name = center.name || '';
    const address = center.address || '';
    const searchTerm = (search || '').toLowerCase().trim();
    return name.toLowerCase().includes(searchTerm) || 
           address.toLowerCase().includes(searchTerm);
  });

  if (isLoading && !centers) return <PageLoader message="Finding nearby centers..." />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="px-6 py-4">
        <Text variant="h1" className="font-bold mb-6">Donation Centers</Text>
        
        <View className="flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-muted/40 rounded-2xl px-4 h-14 border border-transparent focus:border-primary">
            <Search size={20} className="text-muted-foreground mr-3" />
            <TextInput 
              placeholder="Search by city or center name..." 
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
      </View>

      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="hsl(var(--primary))" />}
      >
        <View className="pb-24 mt-4">
          {filteredCenters?.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 bg-muted/20 rounded-full items-center justify-center mb-6">
                <MapPin size={40} className="text-muted-foreground/30" />
              </View>
              <Text variant="h3" className="text-muted-foreground">No centers found</Text>
            </View>
          ) : (
            filteredCenters?.map((center: any) => (
              <View key={center.id} className="mb-4">
                <CenterCard 
                  center={center}
                  onPress={() => router.push({ pathname: '/center/[id]', params: { id: center.id } })}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
