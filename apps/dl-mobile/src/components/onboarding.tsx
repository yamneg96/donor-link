import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Activity, 
  MapPin, 
  ChevronRight, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  GitMerge
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  accentTitle: string;
  description: string;
  type: 'inventory' | 'emergency' | 'logistics';
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    title: "Real-time National",
    accentTitle: "Inventory",
    description: "Gain instant visibility into blood stock levels across every hospital and hub in Ethiopia. Prevent shortages before they happen.",
    type: 'inventory'
  },
  {
    id: 2,
    title: "Critical Emergency",
    accentTitle: "Response.",
    description: "Instantly broadcast critical shortages and mobilize resources. Every second counts when lives are on the line.",
    type: 'emergency'
  },
  {
    id: 3,
    title: "AI-Powered",
    accentTitle: "Logistics",
    description: "Eliminate wastage through predictive redistribution. Our AI identifies expiring units and reroutes them to critical demand centers.",
    type: 'logistics'
  }
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const handleFinishOnboarding = async () => {
    try {
      // 1. Save onboarding completion state persistently
      await AsyncStorage.setItem('@has_onboarded', 'true');
      
      // 2. Schedule the navigation safely outside the continuous execution block 
      // to allow the native NavigationContainer context to settle completely.
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 0);
    } catch (error) {
      console.error("Failed to commit onboarding flag:", error);
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 0);
    }
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(prev => prev + 1);
    } else {
      handleFinishOnboarding();
    }
  };

  const renderVisualAsset = (type: OnboardingSlide['type']) => {
    switch (type) {
      case 'inventory':
        return (
          <View className="w-full aspect-[4/5] max-w-[340px] rounded-3xl bg-white border border-slate-100 p-6 shadow-xl relative justify-between">
            <View className="flex-row justify-between items-start w-full">
              <View className="bg-emerald-50 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">Live Tracking</Text>
              </View>
              <View className="bg-red-50 px-3 py-1.5 rounded-full">
                <Text className="text-[10px] font-bold text-red-700 uppercase">AA Hub: Optimal</Text>
              </View>
            </View>

            {/* FIXED: Swapped space-y-4 to gap-4 for uniform layout support */}
            <View className="gap-4 my-auto w-full">
              <View className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">National Pool distribution</Text>
                <Text className="text-2xl font-bold text-slate-800 mt-1">42,850 Units</Text>
                <View className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                  <View className="h-full w-3/4 bg-red-600 rounded-full" />
                </View>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 items-center">
                  <Layers size={18} color="#b91c1c" />
                  <Text className="text-slate-700 font-bold text-sm mt-1">12 Hubs</Text>
                </View>
                <View className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 items-center">
                  <Activity size={18} color="#b91c1c" />
                  <Text className="text-slate-700 font-bold text-sm mt-1">+4.2% MoM</Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 'emergency':
        return (
          <View className="w-full aspect-[4/5] max-w-[340px] rounded-3xl bg-neutral-950 p-6 shadow-2xl relative overflow-hidden justify-center items-center">
            <View className="w-[85%] aspect-[1/1.8] bg-slate-50 rounded-2xl border-[4px] border-neutral-800 overflow-hidden shadow-2xl">
              <View className="h-1 bg-red-600 w-full" />
              <View className="p-4 flex-1 justify-between">
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="w-8 h-8 rounded-lg bg-red-600 items-center justify-center shadow-md">
                    <AlertTriangle size={16} color="#ffffff" />
                  </View>
                  <View>
                    <Text className="text-[8px] font-black uppercase text-red-600 tracking-wider">Urgent Request</Text>
                    <Text className="text-xs font-bold text-slate-800">O- Negative Needed</Text>
                  </View>
                </View>

                <View className="bg-white/95 border border-slate-200 rounded-xl p-2.5 my-2 shadow-sm">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <MapPin size={12} color="#b91c1c" />
                    <Text className="text-[10px] font-bold text-slate-800" numberOfLines={1}>Tikur Anbessa Hospital</Text>
                  </View>
                  <Text className="text-[10px] text-slate-500 font-medium pl-4">4 Units Required Stat</Text>
                </View>

                <View className="flex-row gap-2 mt-auto">
                  <View className="flex-1 h-8 bg-white border border-slate-300 rounded-lg justify-center items-center">
                    <Text className="text-[10px] font-bold text-slate-600">Decline</Text>
                  </View>
                  <View className="flex-1 h-8 bg-red-600 rounded-lg justify-center items-center shadow-sm">
                    <Text className="text-[10px] font-bold text-white">Accept</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );

      case 'logistics':
        return (
          <View className="w-full aspect-[4/5] max-w-[340px] rounded-3xl bg-white border border-slate-100 p-6 shadow-xl relative justify-between">
            <View className="absolute top-4 right-4 bg-slate-50/90 border border-slate-100 px-3 py-1.5 rounded-xl flex-row items-center gap-2 shadow-sm">
              <CheckCircle2 size={14} color="#16a34a" />
              <View>
                <Text className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">AI Efficiency</Text>
                <Text className="text-xs font-mono font-bold text-slate-800">94.8%</Text>
              </View>
            </View>

            <View className="flex-1 items-center justify-center gap-4">
              <View className="bg-red-50 p-4 rounded-full border border-red-100 items-center justify-center relative">
                <GitMerge size={32} color="#b91c1c" />
                <View className="absolute -bottom-1 -right-1 bg-red-600 rounded-full w-6 h-6 items-center justify-center border-2 border-white">
                  <Text className="text-[10px] font-bold text-white">O-</Text>
                </View>
              </View>
              <View className="bg-red-50/50 px-4 py-1 rounded-full border border-red-100">
                <Text className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Re-Routing...</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
              <View className="items-center">
                <Text className="text-[9px] text-slate-400 font-bold uppercase">Hub North</Text>
                <Text className="text-xs font-bold text-red-600 mt-0.5">Surplus</Text>
              </View>
              <Text className="text-slate-300">➔</Text>
              <View className="items-center">
                <Text className="text-[9px] text-slate-400 font-bold uppercase">Clinic East</Text>
                <Text className="text-xs font-bold text-purple-600 mt-0.5">Critical</Text>
              </View>
            </View>
          </View>
        );
    }
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="w-full flex-row justify-end px-6 py-2">
        <TouchableOpacity 
          onPress={handleSkip}
          className="border border-slate-200 bg-white/80 px-4 py-1.5 rounded-full shadow-sm"
          activeOpacity={0.7}
        >
          <Text className="text-slate-600 font-semibold text-xs tracking-wide">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {renderVisualAsset(currentSlide.type)}
      </View>

      <View className="px-8 text-center items-center mb-8">
        <Text className="text-3xl font-black text-slate-900 tracking-tight leading-tight text-center">
          {currentSlide.title} <Text className="text-red-600">{currentSlide.accentTitle}</Text>
        </Text>
        <Text className="text-slate-500 font-normal text-sm text-center leading-relaxed mt-3 max-w-[310px]">
          {currentSlide.description}
        </Text>
      </View>

      <View className="px-6 pb-8 pt-4 w-full flex-row justify-between items-center">
        <View className="flex-row gap-2 items-center">
          {SLIDES.map((_, index) => (
            /* FIXED: Re-added unique identifier key element below */
            <View 
              key={index} 
              className={`h-2 rounded-full ${
                index === activeIndex ? 'w-7 bg-red-600 shadow-sm' : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleNext}
          className="bg-red-600 px-6 h-14 rounded-2xl flex-row items-center gap-2 justify-center shadow-lg shadow-red-600/30"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm uppercase tracking-wide">
            {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
          <ChevronRight size={18} color="#ffffff" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}