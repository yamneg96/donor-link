import React, { useState } from 'react';
import { View, Image, Dimensions, Pressable, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { router } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { Heart, Activity, MapPin, ChevronRight, Droplet } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Safe Lives, Give Blood',
    description: 'Every donation can save up to three lives. Join our community of heroes today.',
    icon: Heart,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    title: 'Emergency Alerts',
    description: 'Receive real-time notifications for critical blood needs in your immediate area.',
    icon: Activity,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    title: 'Find Centers',
    description: 'Locate the nearest donation centers and community blood drives with ease.',
    icon: MapPin,
    color: 'text-info',
    bg: 'bg-info/10',
  },
];

export default function Onboarding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const setOnboarded = useAppStore((state) => state.setOnboarded);

  const handleNext = () => {
    if (activeSlide < SLIDES.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    setOnboarded(true);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="items-center mt-10">
          <View className="flex-row items-center gap-2">
            <Droplet size={32} className="text-primary" />
            <Text variant="h2" className="font-black text-primary">DonorLink</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-10">
          <View className={`w-64 h-64 rounded-full ${SLIDES[activeSlide].bg} items-center justify-center mb-10`}>
            {React.createElement(SLIDES[activeSlide].icon, {
              size: 120,
              className: SLIDES[activeSlide].color
            })}
          </View>
          
          <Text variant="h1" className="text-center mb-4 font-bold">
            {SLIDES[activeSlide].title}
          </Text>
          <Text className="text-center text-muted-foreground text-lg leading-6">
            {SLIDES[activeSlide].description}
          </Text>
        </View>

        <View className="p-10">
          <View className="flex-row justify-center gap-2 mb-10">
            {SLIDES.map((_, i) => (
              <View 
                key={i} 
                className={`h-2 rounded-full ${i === activeSlide ? 'w-8 bg-primary' : 'w-2 bg-muted'}`} 
              />
            ))}
          </View>

          <View className="flex-row gap-4">
            <Button 
              variant="ghost" 
              className="flex-1 h-14 rounded-2xl" 
              onPress={finish}
            >
              <Text className="font-bold text-muted-foreground">Skip</Text>
            </Button>
            <Button 
              className="flex-[2] h-14 rounded-2xl" 
              onPress={handleNext}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-bold text-lg">
                  {activeSlide === SLIDES.length - 1 ? 'Start' : 'Next'}
                </Text>
                <ChevronRight size={20} color="white" />
              </View>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
