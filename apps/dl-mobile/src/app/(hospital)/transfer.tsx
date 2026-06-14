import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  Route, 
  Check,
  MapPin,
  Truck,
  Droplet,
  Info,
  XCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FACILITIES = [
  { name: "St. Paul's Hospital", dist: "1.2 km", units: 12 },
  { name: "Zewditu Memorial", dist: "3.8 km", units: 5 },
];

export default function TransferScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Top Bar */}
      <View className="px-4 py-3 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()} className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
             <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgMur00E3VwS8dwOhxmkpNVnYECjpBtXCW99B1uKYMjVJED0EkU6wbODYcvUGnJ-nlyKvbg0byNi3UWn1tnY5_iaBeyDWkNwM9lsypB-KuLgzaCybQh35wL6h32CuAU40R2cf1BKpziZz9n5A_nHjCsqrxmY9Dk6kHLyO8bmJRdlyCbY8GOkhO4bxUyclORigprBTEIK15POWYbTTp3tYkpkLYYHg-x7DII2ohRRIvCzkGEmCjmZhordtIZoLKNjozbgUUr1Da_9s' }} 
              className="w-full h-full"
            />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <RefreshCw size={20} color="#93000b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Header & Priority */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">Request #TR-8921</Text>
            <View className="flex-row items-center gap-1.5">
               <Clock size={12} color="#666" />
               <Text className="text-xs text-gray-500">Requested 12 mins ago</Text>
            </View>
          </View>
          <View className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-full flex-row items-center gap-1.5">
             <AlertTriangle size={14} color="#ba1a1a" fill="#ba1a1a" />
             <Text className="text-[10px] font-black text-red-700 uppercase tracking-tighter">STAT Priority</Text>
          </View>
        </View>

        {/* Requirements Card */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6 overflow-hidden">
           <View className="absolute top-0 left-0 w-full h-1 bg-red-600" />
           <Text className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">Blood Requirements</Text>
           
           <View className="flex-row flex-wrap justify-between gap-y-4 mb-4">
              <View className="w-[48%]">
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Group Needed</Text>
                 <View className="bg-gray-50 px-2 py-1.5 rounded border border-gray-100 self-start">
                    <Text className="text-xs font-bold text-gray-800 font-mono">O Negative (O-)</Text>
                 </View>
              </View>
              <View className="w-[48%]">
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Quantity</Text>
                 <Text className="text-lg font-bold text-gray-900">4 Units</Text>
              </View>
              <View className="w-[48%]">
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Component</Text>
                 <Text className="text-xs font-bold text-gray-700">Packed RBCs</Text>
              </View>
              <View className="w-[48%]">
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Cross-match</Text>
                 <View className="flex-row items-center gap-1">
                    <Clock size={12} color="#ba1a1a" />
                    <Text className="text-xs font-bold text-red-600">Pending</Text>
                 </View>
              </View>
           </View>

           <View className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Clinical Indication</Text>
              <Text className="text-xs text-gray-700 leading-relaxed">
                 Severe trauma case in ER. Massive transfusion protocol initiated. Immediate dispatch required.
              </Text>
           </View>
        </View>

        {/* Logistics Mini Map */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6">
           <View className="flex-row items-center gap-2 mb-4">
              <Route size={18} color="#00497f" />
              <Text className="text-lg font-bold text-gray-900">Logistics Route</Text>
           </View>
           
           <View className="h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr_y4hm-mRK_KlRedjiaj2JceJlIo4xRp7MoIrIn8_GonDW547gmxBJerd-S8G3BL-Col0K5V9bo-6237nksLUHawUUQRX_MdjF8V0OvGjQsPoeBMoDw25M8nTO25UHsE6-EDQr_DBEeBO6mKLvI7kAseH0YOSf6taBsp2hw109C-j_WQii1-QllGjOLvjsPex78Zr9urHkV7Q6SIqUJa9G5D-5SpfBT-4kXdHcxDzv4MzK7MtjgnsVS9ag-POqAln3ttGlHunO0M' }}
                className="w-full h-full"
              />
              <View style={StyleSheet.absoluteFillObject} className="bg-white/10" />
              
              {/* Markers */}
              <View className="absolute top-[25%] left-[25%] bg-white p-1 rounded-full shadow-sm">
                 <AlertTriangle size={14} color="#ba1a1a" fill="#ba1a1a" />
              </View>
              <View className="absolute bottom-[25%] right-[25%] bg-white p-1 rounded-full shadow-sm">
                 <Check size={14} color="#00497f" />
              </View>
           </View>

           <View className="flex-row justify-between items-end pt-2 border-t border-gray-50">
              <View>
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Est. Arrival</Text>
                 <View className="flex-row items-end gap-2">
                    <Text className="text-2xl font-bold font-mono text-red-800">14 mins</Text>
                    <Text className="text-[10px] text-gray-500 mb-1">via Unit D-42</Text>
                 </View>
              </View>
              <View className="items-end">
                 <Text className="text-[10px] font-bold text-gray-400 mb-1 uppercase">Distance</Text>
                 <Text className="text-sm font-bold font-mono text-gray-700">4.2 km</Text>
              </View>
           </View>
        </View>

        {/* Timeline */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-6">
           <Text className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-widest">Transfer Timeline</Text>
           
           <View className="pl-4">
              <View className="relative pl-8 pb-8 border-l border-gray-100">
                 <View className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-white border-2 border-red-800 items-center justify-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-red-800" />
                 </View>
                 <Text className="text-xs font-bold text-gray-900">Request Initiated</Text>
                 <Text className="text-[10px] text-gray-500">Central Blood Bank • 10:42 AM</Text>
              </View>
              <View className="relative pl-8 pb-8 border-l border-gray-100">
                 <View className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-800 items-center justify-center">
                    <Check size={10} color="#fff" />
                 </View>
                 <Text className="text-xs font-bold text-gray-900">Transfer Approved</Text>
                 <Text className="text-[10px] text-gray-500">Dr. Abebe • 10:45 AM</Text>
              </View>
              <View className="relative pl-8">
                 <View className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-gray-50 border-2 border-gray-200" />
                 <Text className="text-xs font-bold text-gray-400">Dispatching</Text>
                 <Text className="text-[10px] text-gray-400">Awaiting vehicle assignment</Text>
              </View>
           </View>
        </View>

        {/* Nearby Facilities */}
        <View className="mb-10">
           <Text className="text-sm font-bold text-gray-900 mb-1">Nearby Facilities with Stock</Text>
           <Text className="text-[10px] text-gray-500 mb-4">Alternative sourcing options based on current O- inventory.</Text>
           
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-4">
              {FACILITIES.map((fac, idx) => (
                <View key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 w-64 shadow-sm mr-4">
                   <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-xs font-bold text-gray-900">{fac.name}</Text>
                      <View className="bg-gray-100 px-2 py-0.5 rounded">
                         <Text className="text-[9px] font-bold text-gray-600 font-mono">{fac.dist}</Text>
                      </View>
                   </View>
                   <View className="flex-row items-center gap-2 mb-4">
                      <Droplet size={18} color="#ba1a1a" fill="#ba1a1a" />
                      <Text className="text-xl font-bold text-gray-900">{fac.units} <Text className="text-sm font-normal text-gray-500">Units O-</Text></Text>
                   </View>
                   <TouchableOpacity className="border border-red-800 py-2.5 rounded-xl items-center">
                      <Text className="text-red-800 font-bold text-[10px] uppercase">Request Transfer</Text>
                   </TouchableOpacity>
                </View>
              ))}
           </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 pt-6 border-t border-gray-100 pb-10">
           <TouchableOpacity className="flex-1 bg-white border border-gray-200 h-14 rounded-2xl flex-row items-center justify-center gap-2">
              <XCircle size={20} color="#ba1a1a" />
              <Text className="text-red-800 font-bold text-xs uppercase">Reject</Text>
           </TouchableOpacity>
           <TouchableOpacity className="flex-1 bg-red-800 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-lg shadow-red-800/20">
              <Truck size={20} color="#fff" />
              <Text className="text-white font-bold text-xs uppercase">Confirm Dispatch</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
