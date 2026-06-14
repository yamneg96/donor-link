import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  RefreshCw, 
  Hospital, 
  Warehouse, 
  Truck, 
  Plus, 
  Minus, 
  AlertCircle,
  Bell
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OperationsMapScreen() {
  return (
    <View className="flex-1 bg-[#f6fafe]">
      {/* Header */}
      <SafeAreaView className="z-50 bg-white border-b border-gray-100 shadow-sm">
        <View className="px-4 py-3 flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
               <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC2Lv-hSKfpIhVLXm-ca3mJ5KZT1BqtLNDLcbKTkhdJxUY9YVm7f3D5LctLC5cwVHsQbHxpZdXenwsELczDcSZXfpnNRojXxCrc15e4rKoZOwwVxh3K80lZx6kzVUz36Fm_I-owdIFw4tQ7GWFCEB5tWIebku3_8S8B-06LE_gkLf0EEmAZbhZb2GVH8Y4QZ9_3g9qHaE2O6KlxZBaROBpWijwMqWane9bHcL-zvkE3R94RAnlbLcxRNdfFot85VMnqZcC3sSwTh4' }} 
                className="w-full h-full"
              />
            </View>
            <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
            <RefreshCw size={20} color="#93000b" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Map Content */}
      <View className="flex-1 relative">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000' }}
          className="w-full h-full opacity-80"
          resizeMode="cover"
        />
        <View style={StyleSheet.absoluteFillObject} className="bg-white/10" />

        {/* Global Status Overlay */}
        <View className="absolute top-4 left-4 right-4 z-40 gap-3">
          <View className="bg-white/95 border border-gray-100 rounded-2xl p-4 shadow-xl">
             <Text className="text-sm font-bold text-gray-900 mb-2">Network Status</Text>
             <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-xs text-gray-500">Active Transfers</Text>
                <Text className="text-xs font-bold text-red-800 font-mono">14</Text>
             </View>
             <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xs text-gray-500">Critical Shortages</Text>
                <Text className="text-xs font-bold text-red-600 font-mono">3</Text>
             </View>
             <View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                <View className="bg-red-800 h-full w-[85%]" />
             </View>
             <Text className="text-[10px] text-gray-400 font-bold text-right">85% CAPACITY</Text>
          </View>

          <TouchableOpacity className="bg-red-800 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-red-800/30">
             <Bell size={18} color="#fff" fill="#fff" />
             <Text className="text-white font-bold text-sm uppercase tracking-widest">Dispatch Emergency Unit</Text>
          </TouchableOpacity>
        </View>

        {/* Map Markers (Absolute positioned) */}
        {/* Black Lion Hospital */}
        <View className="absolute top-[35%] left-[55%] items-center">
           <View className="bg-white border border-gray-100 p-2 rounded-xl shadow-lg mb-1">
              <Text className="text-[10px] font-bold text-gray-900">Black Lion Hosp.</Text>
              <View className="flex-row items-center gap-1 mt-1">
                 <View className="w-1.5 h-1.5 rounded-full bg-red-600" />
                 <Text className="text-[9px] font-black text-red-600 uppercase">O- Critical</Text>
              </View>
           </View>
           <View className="w-10 h-10 rounded-full bg-red-600 items-center justify-center border-2 border-white shadow-xl">
              <Hospital size={18} color="#fff" />
           </View>
        </View>

        {/* Central Hub */}
        <View className="absolute top-[50%] left-[30%] items-center">
           <View className="w-12 h-12 rounded-full bg-red-800 items-center justify-center border-2 border-white shadow-xl">
              <Warehouse size={22} color="#fff" />
           </View>
           <View className="mt-2 bg-red-800 px-3 py-1 rounded-full border border-red-900 shadow-md">
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider">Central Hub</Text>
           </View>
        </View>

        {/* Vehicle in Transit */}
        <View className="absolute top-[42%] left-[42%]">
           <View className="bg-white px-2 py-1 rounded-full border border-gray-100 flex-row items-center gap-1.5 shadow-xl">
              <Truck size={14} color="#93000b" />
              <Text className="text-[10px] font-bold text-red-800 font-mono">T-04m</Text>
           </View>
        </View>

        {/* Map Controls */}
        <View className="absolute bottom-10 right-4 gap-2">
           <TouchableOpacity className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-gray-100 shadow-xl">
              <Plus size={20} color="#666" />
           </TouchableOpacity>
           <TouchableOpacity className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-gray-100 shadow-xl">
              <Minus size={20} color="#666" />
           </TouchableOpacity>
        </View>

        {/* Legend */}
        <View className="absolute bottom-10 left-4 bg-white/95 p-3 rounded-2xl border border-gray-100 shadow-xl">
           <Text className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Legend</Text>
           <View className="gap-2">
              <View className="flex-row items-center gap-2">
                 <View className="w-2.5 h-2.5 rounded-full bg-red-600" />
                 <Text className="text-[10px] font-bold text-gray-700">Critical Shortage</Text>
              </View>
              <View className="flex-row items-center gap-2">
                 <View className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                 <Text className="text-[10px] font-bold text-gray-700">Stock Adequate</Text>
              </View>
              <View className="flex-row items-center gap-2">
                 <Truck size={12} color="#93000b" />
                 <Text className="text-[10px] font-bold text-gray-700">In Transit</Text>
              </View>
           </View>
        </View>
      </View>
    </View>
  );
}
