import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  RefreshCw, 
  Megaphone, 
  PlusCircle, 
  History, 
  AlertTriangle, 
  Calendar,
  Users,
  MapPin,
  Send,
  Filter,
  Clock
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DRIVES = [
  { 
    id: '1', 
    title: 'AAU Main Campus Drive', 
    tag: 'University', 
    timer: 'Ends in 4 hours', 
    collected: 145, 
    target: 200,
    color: '#0061a6'
  },
  { 
    id: '2', 
    title: 'Mercato District Drive', 
    tag: 'Community', 
    timer: 'Tomorrow, 08:00 AM', 
    rsvp: 42,
    color: '#712ae2'
  },
];

export default function DonorRecruitmentScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
             <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKzvKlUjAfahAhnmSxYVQSBUkBlykro9_JYx_AhswXEkfP1KK_RauyyE4830na7KU_wBVlTxIPGnyZLAEtCaiAReRKm_TYAoErm3vnAo0OM4cKIcXc6i416MfxRPjfIQaGSpHSxEDx3ZFNgIQkwjrwznqsjdenig69scBbEA6Yty4D18cYOCwqJFvhC7MYcCb5vB06GyIf-VNlKJT_JqyAsy3ENPC6Qz8vkw6HyRbKyt9_Ddj7xh2NcDSyxsMUhz1WSQigE1FksXA' }} 
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <RefreshCw size={20} color="#93000b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View className="px-4 py-8 bg-[#f6fafe] border-b border-gray-100">
           <Text className="text-3xl font-bold text-gray-900 leading-tight">Donor Mobilization</Text>
           <Text className="text-base text-gray-500 mt-2">Active campaigns and recruitment operations in Addis Ababa.</Text>
           
           <View className="flex-row gap-2 mt-6">
              <TouchableOpacity className="bg-gray-100 px-4 py-3 rounded-full flex-row items-center gap-2">
                 <History size={16} color="#666" />
                 <Text className="font-bold text-xs text-gray-700">Past Drives</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-800 px-6 py-3 rounded-full flex-row items-center gap-2 shadow-lg shadow-red-800/20">
                 <PlusCircle size={16} color="#fff" />
                 <Text className="font-bold text-xs text-white uppercase tracking-widest">New Campaign</Text>
              </TouchableOpacity>
           </View>
        </View>

        <View className="p-4 gap-8">
           {/* Critical Section */}
           <View className="bg-red-50 border border-red-100 rounded-3xl p-5 relative overflow-hidden">
              <View className="absolute top-0 right-0 w-32 h-32 bg-red-800/5 rounded-bl-full" />
              <View className="flex-row items-start gap-4">
                 <View className="bg-red-700 p-2 rounded-full">
                    <AlertTriangle size={20} color="#fff" fill="#fff" />
                 </View>
                 <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1.5">
                       <Text className="text-lg font-bold text-red-950">Critical: O-Negative</Text>
                       <View className="bg-red-700 px-1.5 py-0.5 rounded">
                          <Text className="text-[8px] font-black text-white uppercase">Stat</Text>
                       </View>
                    </View>
                    <Text className="text-sm text-red-900 leading-relaxed mb-4">
                       Yekatit 12 Hospital Blood Bank reserves below 5% capacity. Immediate mobilization required.
                    </Text>
                    
                    <View className="w-full h-2 bg-red-100 rounded-full overflow-hidden mb-2">
                       <View className="bg-red-700 h-full w-[15%]" />
                    </View>
                    <Text className="text-[10px] font-bold text-red-800 font-mono">12 / 80 Units Filled</Text>
                 </View>
              </View>

              <TouchableOpacity className="mt-6 bg-red-700 w-full py-4 rounded-2xl items-center shadow-sm">
                 <Text className="text-white font-bold text-xs uppercase tracking-widest">Broadcast Request</Text>
              </TouchableOpacity>
           </View>

           {/* Active Drives */}
           <View>
              <Text className="text-xl font-bold text-gray-900 mb-4">Active Drives</Text>
              <View className="flex-row flex-wrap gap-4">
                 {DRIVES.map((drive, idx) => (
                    <TouchableOpacity key={idx} style={{ width: (SCREEN_WIDTH - 48) / 1 }} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                       <View className="flex-row justify-between items-start mb-4">
                          <View style={{ backgroundColor: drive.color + '20' }} className="px-2 py-1 rounded">
                             <Text style={{ color: drive.color }} className="text-[10px] font-bold uppercase tracking-wider">{drive.tag}</Text>
                          </View>
                          <Calendar size={18} color="#666" />
                       </View>
                       <Text className="text-lg font-bold text-gray-900 leading-tight mb-2">{drive.title}</Text>
                       <View className="flex-row items-center gap-1.5 mb-6">
                          <Clock size={12} color="#666" />
                          <Text className="text-[10px] text-gray-500">{drive.timer}</Text>
                       </View>
                       
                       {drive.collected ? (
                          <View className="mt-auto">
                             <View className="flex-row justify-between mb-1.5">
                                <Text className="text-[10px] text-gray-400 font-bold uppercase">Target: {drive.target}</Text>
                                <Text style={{ color: drive.color }} className="text-[10px] font-bold font-mono">{drive.collected} Collected</Text>
                             </View>
                             <View className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                <View style={{ width: `${(drive.collected / drive.target) * 100}%`, backgroundColor: drive.color }} className="h-full rounded-full" />
                             </View>
                          </View>
                       ) : (
                          <View className="flex-row items-center justify-between mt-auto">
                             <View className="flex-row -space-x-3">
                                {[1,2,3].map(i => (
                                   <View key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" />
                                ))}
                                <View className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 items-center justify-center">
                                   <Text className="text-[8px] font-bold text-gray-600">+{drive.rsvp}</Text>
                                </View>
                             </View>
                             <Text style={{ color: drive.color }} className="text-[10px] font-bold uppercase underline">Manage Roster</Text>
                          </View>
                       )}
                    </TouchableOpacity>
                 ))}
              </View>
           </View>

           {/* Outreach Area */}
           <View className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
              <Text className="text-xl font-bold text-gray-900 mb-2">Targeted Outreach</Text>
              <Text className="text-sm text-gray-500 mb-6">Quickly message eligible donors based on recent activity and blood type.</Text>
              
              <View className="gap-3">
                 <TouchableOpacity className="flex-row items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                       <Users size={18} color="#666" />
                    </View>
                    <View className="flex-1">
                       <Text className="text-xs font-bold text-gray-900">Eligible O- Donors</Text>
                       <Text className="text-[9px] text-gray-500">Last donation &gt; 90 days</Text>
                    </View>
                    <Text className="text-xs font-bold text-red-800 font-mono">1,204</Text>
                 </TouchableOpacity>
                 <TouchableOpacity className="flex-row items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                       <MapPin size={18} color="#666" />
                    </View>
                    <View className="flex-1">
                       <Text className="text-xs font-bold text-gray-900">Near Yekatit 12</Text>
                       <Text className="text-[9px] text-gray-500">Within 5km radius</Text>
                    </View>
                    <Text className="text-xs font-bold text-blue-900 font-mono">850</Text>
                 </TouchableOpacity>
              </View>

              <TouchableOpacity className="mt-6 bg-gray-100 w-full py-4 rounded-2xl flex-row items-center justify-center gap-2">
                 <Send size={16} color="#666" />
                 <Text className="text-gray-700 font-bold text-xs uppercase tracking-widest">Compose Message</Text>
              </TouchableOpacity>
           </View>

           {/* Zone Map */}
           <View className="rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-80 relative mb-10">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7oqvriDz07SQlGEFk60001WoHeCKU3i4rtcG5EjWof34a_Ad56yRG5hvzN6Iw6oTM_OBdeiRR7XOhvtZazx7ihp6NMSJOUrmJSurZ7MOiZ6rhGIl_DD4vjMb7OXGJRRz_j6E1ZAobsRIEYJOb284GFHZr-QlPrcDDc7rjmZR6y-Zcee59Kyobk64Dot1Gcx4M15c80GQRWUk1FVuNGyYvShRGUChTb6-wQY0-zfivpI6-QvBURMhlAc-JzUtooQuwZP3B6vaIXzM' }}
                className="w-full h-full"
              />
              <View style={StyleSheet.absoluteFillObject} className="bg-white/10" />
              
              <View className="absolute top-0 left-0 right-0 p-4 flex-row justify-between items-center bg-white/90 border-b border-gray-100">
                 <Text className="text-sm font-bold text-gray-900">Mobilization Zones</Text>
                 <TouchableOpacity className="px-3 py-1.5 bg-gray-100 rounded-lg flex-row items-center gap-1.5 border border-gray-200">
                    <Filter size={12} color="#666" />
                    <Text className="text-[10px] font-bold text-gray-600">Filters</Text>
                 </TouchableOpacity>
              </View>

              {/* Pulsing Marker */}
              <View className="absolute top-[40%] left-[45%] items-center">
                 <View className="w-8 h-8 rounded-full bg-red-600 items-center justify-center border-2 border-white shadow-xl">
                    <AlertTriangle size={14} color="#fff" fill="#fff" />
                 </View>
              </View>
           </View>
        </View>
      </ScrollView>

      {/* Bottom Nav Mock (Mobile) */}
      <View className="absolute bottom-6 left-6 right-6 h-16 bg-blue-900 rounded-2xl shadow-xl flex-row justify-around items-center px-4">
         <TouchableOpacity>
            <History size={20} color="#fff" />
         </TouchableOpacity>
         <TouchableOpacity className="bg-white w-12 h-12 rounded-full items-center justify-center -mt-10 border-4 border-blue-900">
            <Megaphone size={24} color="#00497f" fill="#00497f" />
         </TouchableOpacity>
         <TouchableOpacity>
            <Users size={20} color="#fff" />
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
