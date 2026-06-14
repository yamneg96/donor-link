import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  navigation?: any; // Add your router/navigation typing depending on Expo Router or React Navigation
};

const SplashScreen = ({ navigation }: Props) => {
  const handleAuthenticate = () => {
    console.log('Navigating securely to login authentication sequence...');
    if (navigation) {
      navigation.navigate('login'); // Fallback trigger target
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="hsl(var(--background))" />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        className="w-full h-full"
      >
        {/* Top Split Visual Container (Bento Visual Layout) */}
        <View className="w-full h-[40%] md:h-[50%] relative overflow-hidden bg-muted/40">
          
          {/* Abstract Medical Grid Dot Background Layer */}
          <View className="absolute inset-0 bg-dot-matrix pointer-events-none" />

          {/* Hero Image Component Mapping */}
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-bteTBQdOfc1Itov_MJJfi2WKkHD9uXiemCF4D7CtIOUglABB5ha2wUbGRNkkPyUYRC2Jr5npDW7n2cy6S9eC5KLVTqPW55BtNbclUTSEdtz0fCSn4D4J1x-8ABxdm7CRsKXZU9guUa3QrYPYFxlXhYdHAUj0_cdGT38-TRFwYUU1dVbj_RPi6w4PNeX0h6eSn4XHyqL5GP9qfq700yF_MrXKPHycuFPbiCY1bGapyuU4ZswNJZm30NdYRjnKMFVnCuHueE4W5MM' }}
            alt="Healthcare Professional"
            className="w-full h-full object-cover opacity-80"
            resizeMode="cover"
          />

          {/* Bottom Fade Gradient for Smooth Composition transitions */}
          <View className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

          {/* Floating Operational Badge: Top Left */}
          <View className="absolute top-margin left-margin bg-card/90 border border-border px-3 py-1.5 rounded-lg shadow-sm flex-row items-center gap-1.5 backdrop-blur-md">
            <MaterialIcons name="verified" size={16} color="hsl(var(--primary))" />
            <Text className="text-[11px] font-bold text-foreground tracking-wide">
              MOH CERTIFIED
            </Text>
          </View>

          {/* Floating Operational Badge: Bottom Right */}
          <View className="absolute bottom-4 right-margin bg-card/90 border border-border px-3 py-1.5 rounded-lg shadow-sm flex-row items-center gap-2 backdrop-blur-md">
            <View className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Text className="text-[11px] font-mono font-semibold text-foreground tracking-tight">
              SYS ONLINE
            </Text>
          </View>
        </View>

        {/* Bottom Area: Typography and Interface Triggers */}
        <View className="flex-1 justify-between p-margin md:p-xl gap-6">
          
          {/* Top Level Brand Identity Row */}
          <View className="flex-row items-center gap-2.5 mt-2">
            <View className="w-10 h-10 bg-primary-container rounded-lg items-center justify-center shadow-sm">
              <MaterialIcons name="water-drop" size={22} color="hsl(var(--primary))" />
            </View>
            <Text className="text-xl font-bold tracking-tight text-foreground">
              DonorLink Ethiopia
            </Text>
          </View>

          {/* Value Proposition Description Block */}
          <View className="my-auto gap-4">
            <View>
              <Text className="text-2xl font-bold text-foreground tracking-tight leading-tight">
                National Blood{'\n'}
                <Text className="text-primary text-3xl">Coordination Network</Text>
              </Text>
              <Text className="text-sm leading-relaxed text-muted-foreground mt-3 max-w-sm">
                Mission-critical logistics and real-time inventory management for emergency dispatchers and healthcare professionals.
              </Text>
            </View>

            {/* Micro Bento Features Status Info Grid */}
            <View className="flex-row gap-2 max-w-md mt-1">
              
              {/* Feature Module: Rapid Routing */}
              <View className="flex-1 bg-muted/50 border border-border/40 p-3 rounded-lg gap-1">
                <MaterialIcons name="speed" size={20} color="hsl(var(--secondary-foreground))" />
                <Text className="text-xs font-bold text-foreground mt-0.5">Rapid Dispatch</Text>
                <Text className="text-[11px] text-muted-foreground">Real-time routing</Text>
              </View>

              {/* Feature Module: Chain Traceability */}
              <View className="flex-1 bg-muted/50 border border-border/40 p-3 rounded-lg gap-1">
                <MaterialIcons name="security" size={20} color="hsl(var(--primary))" />
                <Text className="text-xs font-bold text-foreground mt-0.5">Secure Trace</Text>
                <Text className="text-[11px] text-muted-foreground">End-to-end tracking</Text>
              </View>
              
            </View>
          </View>

          {/* Interface Submission Footer Buttons Group */}
          <View className="w-full max-w-md mb-2">
            <TouchableOpacity
              onPress={handleAuthenticate}
              activeOpacity={0.8}
              className="w-full h-touch-target bg-primary rounded-lg flex-row items-center justify-center gap-1.5 shadow-sm"
            >
              <Text className="text-primary-foreground font-semibold text-base">
                Authenticate Securely
              </Text>
              <MaterialIcons name="arrow-forward" size={18} color="hsl(var(--primary-foreground))" />
            </TouchableOpacity>
            
            <Text className="text-[10px] font-medium text-muted-foreground text-center mt-3 tracking-wide">
              AUTHORIZED PERSONNEL ONLY. MONITORED BY ET-NBB.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplashScreen;