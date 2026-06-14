import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Truck, 
  Hourglass,
  Cpu,
  ArrowDown,
  Send,
  X,
  Plus,
  Stethoscope
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STOCK_DATA = [
  { type: 'A+', units: '42', status: 'Optimal', statusColor: 'text-gray-500', barColor: 'bg-blue-600' },
  { type: 'O-', units: '02', status: 'Critical', statusColor: 'text-red-500', barColor: 'bg-red-600', urgent: true },
  { type: 'B+', units: '18', status: 'Stable', statusColor: 'text-gray-500', barColor: 'bg-blue-600' },
  { type: 'AB+', units: '08', status: 'Low', statusColor: 'text-gray-400', barColor: 'bg-gray-400' },
];

export default function CommandDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Top Bar (Mobile) */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b border-gray-100 bg-white">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf1FrrWuh78bFflptqluLePPu8xqwesfG7qof2dRQYAffhVzJ3r79ALxhBPImOj82DQih-jCCP7u7EqWwK1CtjFINDq74XMAnpKvmHrY4QxNUREXAWO2qbbKNM0HyrjMkS2ZcKeJTAfPsyAQYyGFT3Nvie4qNxezgXDxsHB0UXwPiSmSYatvzSBOHJEENqOAxBBVbpaxWveQdjxWHSko_v4knLBkgen72ZN9xtgEG3T9WgUZhPiX5UG0Tms79_40aKmRfC-rnhNk8' }} 
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-red-800">DonorLink Ethiopia</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
          <RefreshCw size={20} color="#93000b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Emergency Action Bar */}
        <View className="mt-4 mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-sm">
          <View className="flex-row items-start gap-3 mb-4">
            <AlertTriangle size={20} color="#ba1a1a" fill="#ba1a1a" />
            <View className="flex-1">
              <Text className="text-sm font-bold text-red-900 uppercase tracking-wide">Critical Shortage: O- Negative</Text>
              <Text className="text-xs text-gray-600 mt-1">Current stock below minimum threshold (2 units remaining).</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-red-800 w-full h-12 rounded-xl flex-row items-center justify-center gap-2">
            <Stethoscope size={18} color="#fff" />
            <Text className="text-white font-bold text-sm tracking-wide">Start Emergency Request</Text>
          </TouchableOpacity>
        </View>

        {/* Current Stock Section */}
        <View className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center border-b border-gray-50 pb-3 mb-4">
            <Text className="text-lg font-bold text-gray-900">Current Stock</Text>
            <View className="bg-gray-50 px-2 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-gray-500">Updated 2m ago</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-3">
            {STOCK_DATA.map((item, index) => (
              <View 
                key={index} 
                style={{ width: (SCREEN_WIDTH - 64) / 2 }} 
                className={`flex flex-col items-center p-3 rounded-2xl border ${item.urgent ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'} relative overflow-hidden`}
              >
                <View className={`absolute top-0 left-0 w-full h-1 ${item.barColor}`} />
                <Text className="text-xs font-bold text-gray-800 mb-1">{item.type}</Text>
                <Text className={`text-3xl font-bold font-mono ${item.urgent ? 'text-red-600' : 'text-blue-900'}`}>{item.units}</Text>
                <View className="flex-row items-center gap-1 mt-1">
                   {item.urgent && <ArrowDown size={10} color="#ba1a1a" />}
                   <Text className={`text-[10px] font-bold ${item.statusColor}`}>
                     {item.status}
                   </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="flex-row gap-3">
          {/* Expiry Alerts */}
          <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
            <View className="flex-row items-center gap-1.5 border-b border-gray-50 pb-2 mb-3">
              <Hourglass size={14} color="#666" />
              <Text className="text-xs font-bold text-gray-800 uppercase tracking-widest">Expiry Alerts</Text>
            </View>
            <View className="gap-2">
              <View className="flex-row justify-between items-center p-2 bg-gray-50 rounded-lg">
                <View className="flex-row items-center gap-2">
                  <View className="bg-blue-900 px-1.5 py-0.5 rounded-sm">
                    <Text className="text-[8px] font-black text-white">A-</Text>
                  </View>
                  <Text className="text-[10px] font-mono text-gray-800">#U-8821</Text>
                </View>
                <Text className="text-[10px] font-bold text-red-500">4 hrs</Text>
              </View>
              <View className="flex-row justify-between items-center p-2 bg-gray-50 rounded-lg">
                <View className="flex-row items-center gap-2">
                  <View className="bg-blue-900 px-1.5 py-0.5 rounded-sm">
                    <Text className="text-[8px] font-black text-white">B-</Text>
                  </View>
                  <Text className="text-[10px] font-mono text-gray-800">#U-7734</Text>
                </View>
                <Text className="text-[10px] font-bold text-gray-400">12 hrs</Text>
              </View>
            </View>
          </View>

          {/* Incoming */}
          <View className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm mb-4">
            <View className="flex-row items-center gap-1.5 border-b border-gray-50 pb-2 mb-3">
              <Truck size={14} color="#00497f" />
              <Text className="text-xs font-bold text-gray-800 uppercase tracking-widest">Incoming</Text>
            </View>
            <View className="p-2 border-l-2 border-blue-900 bg-blue-50/30 rounded-r-lg">
               <Text className="text-[9px] font-bold text-gray-600">From: Central Hub</Text>
               <Text className="text-[8px] font-mono text-gray-400 mt-0.5">5x O+, 2x A-</Text>
               <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-[10px] font-bold text-blue-900">15 min</Text>
                  <Text className="text-[8px] text-gray-400">In Transit</Text>
               </View>
            </View>
          </View>
        </View>

        {/* AI Ops Recommendations */}
        <View className="bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm mb-8">
          <View className="bg-blue-900/5 p-4 border-b border-blue-50 flex-row items-center gap-2">
            <Cpu size={18} color="#712ae2" fill="#712ae2" />
            <Text className="text-lg font-bold text-gray-900">AI Ops Recommendations</Text>
          </View>
          <View className="p-4 bg-gradient-to-b from-white to-blue-50/20">
            {/* Recommendation 1 */}
            <View className="bg-gray-50 border border-gray-100 rounded-xl p-3 relative mb-4">
              <View className="absolute -left-1 top-4 w-1.5 h-8 bg-red-600 rounded-r-full" />
              <Text className="text-xs text-gray-800 leading-relaxed pl-2 mb-3">
                Predictive model indicates high probability of O- shortage in next 12 hours based on regional trauma trends.
              </Text>
              <View className="bg-white p-3 rounded-xl border border-gray-100 mb-3">
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Action Plan:</Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs font-bold text-gray-800">Request 5 units from Hub</Text>
                  <View className="bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                    <Text className="text-[8px] font-bold text-red-600 uppercase">High Priority</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity className="flex-1 bg-red-800 h-10 rounded-lg flex-row items-center justify-center gap-1.5">
                  <Send size={14} color="#fff" />
                  <Text className="text-white font-bold text-xs uppercase">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-10 h-10 bg-white border border-gray-200 rounded-lg items-center justify-center">
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Recommendation 2 */}
            <View className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 relative opacity-70">
              <View className="absolute -left-1 top-4 w-1.5 h-8 bg-gray-300 rounded-r-full" />
              <Text className="text-xs text-gray-800 leading-relaxed pl-2 mb-2">
                Unit #U-8821 (A-) expires in 4h. Yekatit 12 Hospital has a pending routine request.
              </Text>
              <TouchableOpacity className="w-full bg-white border border-gray-200 h-10 rounded-lg items-center justify-center">
                <Text className="text-red-800 font-bold text-xs uppercase tracking-widest">Initiate Transfer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
