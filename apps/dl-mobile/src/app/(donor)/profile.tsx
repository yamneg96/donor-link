import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  HelpCircle, 
  RefreshCw, 
  Droplet, 
  CheckCircle2, 
  Heart, 
  Calendar, 
  Clock, 
  ChevronRight,
  Verified,
  MapPin,
  History
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DONATION_HISTORY = [
  { 
    id: '1', 
    type: 'Whole Blood Donation', 
    location: "St. Paul's Hospital Millennium", 
    date: '14 Nov 2023', 
    status: 'Completed' 
  },
  { 
    id: '2', 
    type: 'Mobile Drive Donation', 
    location: 'Meskel Square Blood Drive', 
    date: '02 Jun 2023', 
    status: 'Completed' 
  },
];

export default function DonorProfileScreen() {
  const [isEmergencyAvailable, setIsEmergencyAvailable] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Header (Mobile) */}
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8Tbhvn4euB3voTYkUcoYKvBdo_HeYoRhBcTMCOVKSnDvaiHZMFeEmaVL_Mw2Rwkc0XGvqET5ir9eJx8az-5JndE7lL9BdB8nRyA9vXGV4F0BPlOD6u8QwB0GLj3s-ZhsbcwJTvD-ahmxK0dNDTukdBDpjciGmZ0h5aDG86yebtIMOngzYob9ZMJTnwAlJ9VGE1gGTFrlYdCzOi37TyBPSI6SR0xPzrECWqxjWICZXwIczxhZgg9FRpJF8iJqh384t1vC9lRIiSFU' }} 
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <RefreshCw size={20} color="#93000b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Core Identity Card */}
        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
           <View className="h-20 bg-red-800/10" />
           <View className="px-4 pb-6 items-center -mt-10">
              <View className="relative">
                 <View className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <Image 
                      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyyBIHaDuYK1D21tGgguZ4-mcdW1PehcE96Jd6hXGyxOI3knqH1PuiAMOujDt1PLlMZzTD5JNZC-6lLkngnMqvf-NM95VBGrLFRVzGZCLu8oEvNfI-mSDyod9p-j266N34jZ6h0svbkKa-v_Q3eL2GWrDZ3yC_CInmRCQfNvtDRspmsWVEYnCN8m7pSX97mMvEa8jSieJpq5VI2Z2Bpr_3bJZjAaYQDtudx71o1HberzRwL5fcF-KebttchmM6iplQSDhhfmwr7BI' }} 
                      className="w-full h-full"
                    />
                 </View>
                 <View className="absolute bottom-0 right-0 bg-blue-600 rounded-full w-7 h-7 items-center justify-center border-2 border-white">
                    <Verified size={14} color="#fff" fill="#fff" />
                 </View>
              </View>

              <Text className="text-2xl font-bold text-gray-900 mt-4">Abeba Tadesse</Text>
              <Text className="text-sm text-gray-500 mb-6">Addis Ababa, Ethiopia</Text>

              <View className="bg-red-50 border border-red-100 flex-row items-center gap-3 px-6 py-3 rounded-full mb-6">
                 <Droplet size={24} color="#ba1a1a" fill="#ba1a1a" />
                 <Text className="text-2xl font-black text-red-900">O-</Text>
                 <View className="w-[1px] h-6 bg-red-200 mx-1" />
                 <Text className="text-xs font-bold text-red-700 uppercase tracking-widest">Universal</Text>
              </View>

              <View className="w-full gap-2">
                 <View className="flex-row justify-between py-3 border-b border-gray-50">
                    <Text className="text-xs text-gray-400 font-bold uppercase">Donor ID</Text>
                    <Text className="text-xs font-bold font-mono text-gray-700">#B8492-ET</Text>
                 </View>
                 <View className="flex-row justify-between py-3">
                    <Text className="text-xs text-gray-400 font-bold uppercase">Registration</Text>
                    <Text className="text-xs font-bold font-mono text-gray-700">12 Aug 2021</Text>
                 </View>
              </View>
           </View>
        </View>

        {/* Eligibility & Impact */}
        <View className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm mb-6">
           <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center gap-2">
                 <CheckCircle2 size={18} color="#0061a6" fill="#0061a6" />
                 <Text className="text-lg font-bold text-gray-900">Currently Eligible</Text>
              </View>
              <View className="bg-gray-50 px-2 py-1 rounded-lg">
                 <Text className="text-[10px] font-bold text-gray-400 uppercase">Updated Today</Text>
              </View>
           </View>
           
           <Text className="text-sm text-gray-600 leading-relaxed mb-6">
              Your last donation was 90 days ago. You are now eligible for whole blood donation.
           </Text>

           <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                 <Text className="text-sm font-bold text-gray-900 mb-0.5">Emergency Call List</Text>
                 <Text className="text-xs text-gray-500">Available for urgent O- requests</Text>
              </View>
              <Switch 
                value={isEmergencyAvailable} 
                onValueChange={setIsEmergencyAvailable}
                trackColor={{ false: '#767577', true: '#00497f' }}
                thumbColor={isEmergencyAvailable ? '#fff' : '#f4f3f4'}
              />
           </View>
        </View>

        {/* Impact Stats */}
        <View className="flex-row gap-4 mb-6">
           <View className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 items-center shadow-sm">
              <Heart size={32} color="#ba1a1a" fill="#ba1a1a" className="mb-2" />
              <Text className="text-3xl font-bold text-gray-900">12</Text>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mt-1">Lives Saved</Text>
           </View>
           <View className="flex-1 bg-white rounded-3xl border border-gray-100 p-6 items-center shadow-sm">
              <Droplet size={32} color="#0061a6" fill="#0061a6" className="mb-2" />
              <Text className="text-3xl font-bold text-gray-900">4</Text>
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mt-1">Donations</Text>
           </View>
        </View>

        {/* History */}
        <View className="bg-white rounded-3xl border border-gray-100 shadow-sm mb-10">
           <View className="p-5 border-b border-gray-50 flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-900">Donation History</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                 <Text className="text-xs font-bold text-red-800">View All</Text>
                 <ChevronRight size={14} color="#93000b" />
              </TouchableOpacity>
           </View>

           <View className="p-2">
              {DONATION_HISTORY.map((item, idx) => (
                <TouchableOpacity key={idx} className="flex-row items-center gap-4 p-3 rounded-2xl hover:bg-gray-50">
                   <View className="w-12 h-12 rounded-xl bg-gray-50 items-center justify-center">
                      <Calendar size={20} color="#666" />
                   </View>
                   <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-900 mb-0.5">{item.type}</Text>
                      <Text className="text-[10px] text-gray-500">{item.location}</Text>
                   </View>
                   <View className="items-end">
                      <Text className="text-[10px] font-bold text-gray-900 font-mono">{item.date}</Text>
                      <View className="flex-row items-center gap-1 mt-1">
                         <CheckCircle2 size={10} color="#0061a6" />
                         <Text className="text-[10px] font-bold text-blue-800">Completed</Text>
                      </View>
                   </View>
                </TouchableOpacity>
              ))}
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
