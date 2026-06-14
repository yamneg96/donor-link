import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Droplet, 
  RefreshCw, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  Clock,
  FlaskConical,
  Plus
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BLOOD_TYPES = [
  { type: 'O+', units: 420, percentage: 75, status: 'Optimal', color: 'bg-red-600' },
  { type: 'A+', units: 310, percentage: 60, status: 'Optimal', color: 'bg-red-600' },
  { type: 'B-', units: 12, percentage: 15, status: 'Critical Shortage', color: 'bg-red-600' }, // The design has bg-error, but typically it maps to primary
  { type: 'AB-', units: 45, percentage: 30, status: 'Low', color: 'bg-blue-600' },
];

const EXPIRY_WARNINGS = [
  { id: '#BL-8892', type: 'O-', expires: '12 hrs', critical: true },
  { id: '#BL-8841', type: 'A+', expires: '24 hrs', critical: false },
];

const RESERVATIONS = [
  { 
    id: 1, 
    hospital: 'Tikur Anbessa Hospital', 
    units: '4x O+ Units', 
    priority: 'Stat Priority', 
    status: 'In Transit', 
    eta: '15 mins',
    progress: 100,
    type: 'stat'
  },
  { 
    id: 2, 
    hospital: "St. Paul's Hospital", 
    units: '2x A- Units', 
    priority: 'Routine', 
    status: 'Pending Pickup', 
    eta: 'Delayed 10m',
    progress: 50,
    type: 'routine',
    delayed: true
  },
];

export default function InventoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100 bg-white">
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClm-MX2HGKkq6m6kiVXMnDMQs43MedqMMf3YoGMAyW611U9PVyrW1CYxihjiGxgPeuzAWp8G49PJFdT3uX8sYZRuvJSZGIc5lcvKpb4vg01N9JXnX9MaDo_Cptfi22RUr7Jw0oWFc-FgNMfdMWuu55bmjsd-qV4RKmec-n1f8oJ-3LhJ_vue_IQCU6f8dDlFVWHkd_JRjtJ2fsSjFjDrTpF51bLkTk27cFNZ7tSU7GORV83e-rI47otP_XTvnX6cz9-0HK7gFxY3k' }} 
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-gray-50">
          <RefreshCw size={20} color="#93000b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Context Header */}
        <View className="px-4 py-6">
          <Text className="text-2xl font-bold text-gray-900">Inventory Overview</Text>
          <Text className="text-gray-500 text-sm mt-1">Addis Ababa Central Hub • Real-time status</Text>
        </View>

        {/* Summary Status Card */}
        <View className="mx-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center border-b border-gray-50 pb-3 mb-4">
            <View className="flex-row items-center gap-2">
              <Droplet size={18} color="#93000b" />
              <Text className="font-semibold text-gray-800">Total Available Units</Text>
            </View>
            <Text className="text-xs text-gray-400">Just now</Text>
          </View>
          
          <View className="flex-row items-end gap-2 mb-6">
            <Text className="text-4xl font-bold text-gray-900">1,248</Text>
            <Text className="text-sm font-semibold text-blue-600 mb-1">+45 since morning</Text>
          </View>

          {/* Visual Inventory Bars */}
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {BLOOD_TYPES.map((item, index) => (
              <View key={index} style={{ width: (SCREEN_WIDTH - 64) / 2 }} className="gap-1.5">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-gray-800 text-sm">{item.type}</Text>
                  <Text className={`text-xs font-bold ${item.type === 'B-' ? 'text-red-600' : 'text-gray-500'}`}>{item.units}</Text>
                </View>
                <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View 
                    className={`h-full ${item.type === 'B-' ? 'bg-red-600' : item.type === 'AB-' ? 'bg-blue-600' : 'bg-red-800'}`} 
                    style={{ width: `${item.percentage}%` }} 
                  />
                </View>
                <Text style={{ fontSize: 10 }} className={`font-bold uppercase tracking-wider ${item.type === 'B-' ? 'text-red-500' : item.type === 'AB-' ? 'text-gray-400' : 'text-blue-500'}`}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expiry Warnings Card */}
        <View className="mx-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-center border-b border-gray-50 pb-3 mb-4">
            <View className="flex-row items-center gap-2">
              <AlertTriangle size={18} color="#ba1a1a" />
              <Text className="font-semibold text-red-600">Expiry Warnings</Text>
            </View>
            <View className="bg-red-50 px-2 py-1 rounded">
              <Text className="text-xs font-bold text-red-700">14 Units</Text>
            </View>
          </View>

          <View className="gap-3">
            {EXPIRY_WARNINGS.map((warning, index) => (
              <View key={index} className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <View className="flex-row items-center gap-3">
                  <View className={`px-2 py-1 rounded ${warning.critical ? 'bg-red-600' : 'bg-gray-200'}`}>
                    <Text className={`text-xs font-bold ${warning.critical ? 'text-white' : 'text-gray-700'}`}>{warning.type}</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-gray-800">{warning.id}</Text>
                    <Text className={`text-[10px] font-bold ${warning.critical ? 'text-red-500' : 'text-gray-500'}`}>
                      Expires in {warning.expires}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Text className="text-xs font-bold text-red-800">Route</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Active Reservations */}
        <View className="px-4 mb-8">
          <Text className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Active Reservations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {RESERVATIONS.map((res, index) => (
              <View 
                key={index} 
                style={{ width: SCREEN_WIDTH * 0.75 }} 
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mr-4"
              >
                <View className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mb-3">
                  <View 
                    style={{ width: `${res.progress}%` }} 
                    className={`h-full ${res.type === 'stat' ? 'bg-blue-600' : 'bg-red-600'}`} 
                  />
                </View>
                
                <View className="flex-row justify-between items-start mb-3">
                  <View className={`${res.type === 'stat' ? 'bg-blue-100' : 'bg-gray-100'} px-2 py-1 rounded`}>
                    <Text className={`text-[10px] font-bold ${res.type === 'stat' ? 'text-blue-700' : 'text-gray-600'}`}>
                      {res.priority}
                    </Text>
                  </View>
                  <Text className="text-[10px] font-bold text-gray-400">{res.status}</Text>
                </View>

                <View className="mb-4">
                  <Text className="font-bold text-gray-900 text-sm">{res.hospital}</Text>
                  <Text className="text-xs text-gray-500 mt-0.5">{res.units}</Text>
                </View>

                <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                  <View className="flex-row items-center gap-1">
                    {res.delayed ? <AlertTriangle size={12} color="#ba1a1a" /> : <Clock size={12} color="#666" />}
                    <Text className={`text-[10px] font-bold ${res.delayed ? 'text-red-500' : 'text-gray-500'}`}>
                      ETA: {res.eta}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Text className="text-[10px] font-bold text-red-800 uppercase tracking-wider">
                      {res.type === 'stat' ? 'Track' : 'Assign'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
