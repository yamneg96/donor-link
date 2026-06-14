import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  RefreshCw, 
  Truck, 
  Droplet, 
  AlertTriangle, 
  Microscope,
  Thermometer,
  User,
  History,
  Flag,
  Barcode,
  ChevronRight
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUALITY_DATA = [
  { label: 'HIV 1/2 Ab', value: 'Negative' },
  { label: 'HCV Ab', value: 'Negative' },
  { label: 'HBsAg', value: 'Negative' },
  { label: 'Syphilis (RPR)', value: 'Negative' },
  { label: 'Temperature Control', value: '4.2°C', icon: <Thermometer size={12} color="#666" /> },
  { label: 'Visual Inspection', value: 'Passed' },
  { label: 'Tech ID', value: 'T-8842', mono: true },
  { label: 'Test Date', value: '2023-10-25 08:30', mono: true },
];

const TIMELINE = [
  { 
    status: 'Dispatched', 
    time: '14:30 TODAY', 
    desc: 'En Route to Tikur Anbessa', 
    meta: 'Carrier ID: C-442', 
    current: true 
  },
  { 
    status: 'Inventory Release', 
    time: '14:15 TODAY', 
    desc: 'Central Blood Bank Hub' 
  },
  { 
    status: 'Testing Completed', 
    time: '2023-10-25', 
    desc: 'Lab Facility Alpha' 
  },
  { 
    status: 'Collection', 
    time: '2023-10-24', 
    desc: 'Mobile Drive: Bole Subcity', 
    meta: 'Phlebotomist ID: P-102' 
  },
];

export default function BloodUnitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Top Bar */}
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full">
            <ArrowLeft size={24} color="#171c1f" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <RefreshCw size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Unit Header Card */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Unit Identifier</Text>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text className="text-lg font-bold font-mono text-gray-900">{id || 'W2399-23-109482'}</Text>
                <View className="bg-red-50 border border-red-100 px-2 py-1 rounded-full flex-row items-center gap-1">
                  <Truck size={12} color="#ba1a1a" />
                  <Text className="text-[10px] font-bold text-red-700">In Transit</Text>
                </View>
              </View>
            </View>
            <View className="w-14 h-14 rounded-full bg-red-600 border-4 border-red-50 items-center justify-center shadow-sm">
              <Text className="text-xl font-bold text-white">O+</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-4 pt-4 border-t border-gray-50">
            <View className="w-[48%]">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Product Type</Text>
              <Text className="text-sm font-bold text-gray-800">Packed Red Blood Cells</Text>
            </View>
            <View className="w-[48%]">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Volume</Text>
              <Text className="text-sm font-bold text-gray-800">450 ml</Text>
            </View>
            <View className="w-[48%]">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Collection</Text>
              <Text className="text-sm font-bold font-mono text-gray-800">2023-10-24</Text>
            </View>
            <View className="w-[48%]">
              <View className="flex-row items-center gap-1 mb-1">
                <AlertTriangle size={12} color="#ba1a1a" />
                <Text className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Expiry</Text>
              </View>
              <Text className="text-sm font-bold font-mono text-red-600">2023-11-28</Text>
            </View>
          </View>
        </View>

        {/* Technical Data */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <View className="flex-row items-center gap-2 border-b border-gray-50 pb-3 mb-3">
            <View className="bg-blue-900/10 p-1.5 rounded-lg">
              <Microscope size={18} color="#00497f" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Quality Control</Text>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-1">
            {QUALITY_DATA.map((item, index) => (
              <View key={index} className="w-full flex-row justify-between items-center py-2 border-b border-gray-50/50">
                <Text className="text-xs text-gray-500">{item.label}</Text>
                <View className="flex-row items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                   {item.icon}
                   <Text className={`text-[10px] font-bold ${item.mono ? 'font-mono' : ''} text-gray-800`}>
                     {item.value}
                   </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <Text className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest">Quick Actions</Text>
          <View className="gap-3">
            <TouchableOpacity className="bg-red-800 h-12 rounded-xl flex-row items-center justify-center gap-2">
              <Barcode size={18} color="#fff" />
              <Text className="text-white font-bold text-sm">Scan Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-200 h-12 rounded-xl flex-row items-center justify-center gap-2">
              <History size={18} color="#666" />
              <Text className="text-gray-700 font-bold text-sm">View Full History</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-red-50 border border-red-100 h-12 rounded-xl flex-row items-center justify-center gap-2 mt-2">
              <Flag size={18} color="#ba1a1a" />
              <Text className="text-red-800 font-bold text-sm">Report Discrepancy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chain of Custody */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-8">
           <View className="flex-row items-center gap-2 border-b border-gray-50 pb-3 mb-6">
              <History size={18} color="#666" />
              <Text className="text-lg font-bold text-gray-900">Chain of Custody</Text>
           </View>

           <View className="pl-4">
              {TIMELINE.map((step, index) => (
                <View key={index} className={`relative pl-8 pb-8 ${index === TIMELINE.length - 1 ? '' : 'border-l border-gray-100'}`}>
                   {/* Timeline dot */}
                   <View className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${step.current ? 'bg-red-600 scale-125' : 'bg-gray-200'}`} />
                   
                   <View className={`${step.current ? 'bg-red-50/50 p-3 rounded-xl border border-red-50' : ''}`}>
                      <View className="flex-row justify-between items-center mb-1">
                         <Text className={`text-[10px] font-black uppercase tracking-wider ${step.current ? 'text-red-700' : 'text-gray-400'}`}>
                           {step.status}
                         </Text>
                         <Text className="text-[10px] font-mono text-gray-400">{step.time}</Text>
                      </View>
                      <Text className="text-sm font-bold text-gray-800">{step.desc}</Text>
                      {step.meta && (
                        <Text className="text-[10px] text-gray-500 mt-1">{step.meta}</Text>
                      )}
                   </View>
                </View>
              ))}
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
