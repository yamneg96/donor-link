import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  PlaneTakeoff, 
  ChevronUp, 
  ShieldAlert,
  ArrowRight,
  MapPin,
  RefreshCw,
  Cpu
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EMERGENCY_ALERTS = [
  { 
    id: 'Req-9942', 
    type: 'O-', 
    hospital: 'Tikur Anbessa Hospital', 
    units: 3, 
    timer: '08:42', 
    progress: 80,
    urgent: true 
  },
  { 
    id: 'Req-9945', 
    type: 'A+', 
    hospital: "St. Paul's Millennium", 
    units: 1, 
    timer: '22:15', 
    progress: 40,
    urgent: false 
  },
];

const EXPIRY_ALERTS = [
  { id: 'UNIT-8824A', type: 'O-', name: 'Whole Blood', location: 'Central Bank', timer: '02:14:00', critical: true },
  { id: 'UNIT-9102B', type: 'A+', name: 'Red Blood Cells', location: 'North Hub', timer: '08:45:00', critical: false },
];

export default function AlertsScreen() {
  const [activeTab, setActiveTab] = useState<'emergency' | 'expiry'>('emergency');

  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      {/* Header */}
      <View className="px-4 py-6 border-b border-gray-100 bg-white">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <View className="flex-row items-center gap-2">
              <ShieldAlert size={24} color="#ba1a1a" fill="#ba1a1a" />
              <Text className="text-2xl font-bold text-red-800">Critical Alerts</Text>
            </View>
            <Text className="text-gray-500 text-sm mt-1">Real-time emergency & expiry monitoring</Text>
          </View>
          <View className="bg-red-50 px-3 py-2 rounded-2xl border border-red-100">
             <Text className="text-lg font-bold text-red-600 font-mono">02:14:00</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row bg-gray-50 p-1 rounded-xl">
          <TouchableOpacity 
            onPress={() => setActiveTab('emergency')}
            className={`flex-1 py-3 rounded-lg flex-row items-center justify-center gap-2 ${activeTab === 'emergency' ? 'bg-white shadow-sm' : ''}`}
          >
            <AlertTriangle size={16} color={activeTab === 'emergency' ? '#ba1a1a' : '#666'} />
            <Text className={`font-bold text-sm ${activeTab === 'emergency' ? 'text-gray-900' : 'text-gray-500'}`}>Emergency</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('expiry')}
            className={`flex-1 py-3 rounded-lg flex-row items-center justify-center gap-2 ${activeTab === 'expiry' ? 'bg-white shadow-sm' : ''}`}
          >
            <Clock size={16} color={activeTab === 'expiry' ? '#ba1a1a' : '#666'} />
            <Text className={`font-bold text-sm ${activeTab === 'expiry' ? 'text-gray-900' : 'text-gray-500'}`}>Expiry</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {activeTab === 'emergency' ? (
          <View className="gap-4">
             {/* Critical Banner */}
             <View className="bg-red-50 border border-red-200 rounded-2xl p-4 flex-row gap-4 mb-2">
                <AlertTriangle size={24} color="#ba1a1a" fill="#ba1a1a" />
                <View className="flex-1">
                  <Text className="text-lg font-bold text-red-900 mb-1 leading-tight uppercase">CRITICAL SHORTAGE</Text>
                  <Text className="text-sm text-gray-700 leading-relaxed">
                    Type O- blood units are critically low at Tikur Anbessa Hospital. Immediate action required.
                  </Text>
                </View>
             </View>

             <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Pending Requests</Text>

             {EMERGENCY_ALERTS.map((alert, index) => (
                <View key={index} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm overflow-hidden">
                   <View className={`absolute top-0 left-0 w-full h-1 ${alert.urgent ? 'bg-red-600' : 'bg-amber-500'}`} />
                   <View className="flex-row justify-between items-start mb-4">
                      <View>
                         <View className="flex-row items-center gap-2 mb-2">
                            <View className={`${alert.urgent ? 'bg-red-100' : 'bg-blue-100'} px-2 py-0.5 rounded`}>
                               <Text className={`text-xs font-black ${alert.urgent ? 'text-red-700' : 'text-blue-700'}`}>{alert.type}</Text>
                            </View>
                            <Text className="text-lg font-bold text-gray-900">{alert.id}</Text>
                         </View>
                         <View className="flex-row items-center gap-1">
                            <MapPin size={12} color="#666" />
                            <Text className="text-xs text-gray-500">{alert.hospital}</Text>
                         </View>
                      </View>
                      <View className="items-end">
                         <Text className="text-xl font-bold text-red-800 font-mono">{alert.units} Units</Text>
                         <View className="flex-row items-center gap-1 mt-1">
                            <Clock size={12} color="#ba1a1a" />
                            <Text className="text-xs font-bold text-red-600">{alert.timer}</Text>
                         </View>
                      </View>
                   </View>

                   <View className="w-full h-2 bg-gray-50 rounded-full overflow-hidden mb-4">
                      <View style={{ width: `${alert.progress}%` }} className={`h-full ${alert.urgent ? 'bg-red-600' : 'bg-amber-500'}`} />
                   </View>

                   {alert.urgent ? (
                     <View className="flex-row gap-3">
                        <TouchableOpacity className="flex-1 bg-red-800 h-12 rounded-xl flex-row items-center justify-center gap-2">
                           <CheckCircle size={18} color="#fff" />
                           <Text className="text-white font-bold text-xs uppercase tracking-widest">Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 border border-red-800 h-12 rounded-xl flex-row items-center justify-center gap-2">
                           <PlaneTakeoff size={18} color="#93000b" />
                           <Text className="text-red-800 font-bold text-xs uppercase tracking-widest">Dispatch</Text>
                        </TouchableOpacity>
                     </View>
                   ) : (
                      <TouchableOpacity className="w-full border border-gray-200 h-12 rounded-xl flex-row items-center justify-center gap-2">
                         <ChevronUp size={18} color="#D97706" />
                         <Text className="text-amber-600 font-bold text-xs uppercase tracking-widest">Escalate</Text>
                      </TouchableOpacity>
                   )}
                </View>
             ))}
          </View>
        ) : (
          <View className="gap-6">
             {/* Summary Section */}
             <View className="flex-row gap-3">
                <View className="flex-1 bg-white border border-gray-100 rounded-2xl p-4">
                   <View className="flex-row items-center gap-1.5 text-red-600 mb-2">
                      <AlertTriangle size={14} color="#ba1a1a" fill="#ba1a1a" />
                      <Text className="text-[10px] font-bold uppercase tracking-widest text-red-600">{"< 12 Hours"}</Text>
                   </View>
                   <Text className="text-3xl font-bold text-gray-900 font-mono">3 <Text className="text-sm font-normal text-gray-400">Units</Text></Text>
                </View>
                <View className="flex-1 bg-white border border-gray-100 rounded-2xl p-4">
                   <View className="flex-row items-center gap-1.5 text-amber-600 mb-2">
                      <Clock size={14} color="#D97706" />
                      <Text className="text-[10px] font-bold uppercase tracking-widest text-amber-600">{"< 24 Hours"}</Text>
                   </View>
                   <Text className="text-3xl font-bold text-gray-900 font-mono">5 <Text className="text-sm font-normal text-gray-400">Units</Text></Text>
                </View>
             </View>

             <View className="bg-blue-900 rounded-2xl p-4 shadow-lg shadow-blue-900/20">
                <View className="flex-row items-center gap-2 mb-3">
                   <Cpu size={18} color="#fff" />
                   <Text className="text-xs font-bold text-blue-100 uppercase tracking-widest">AI Recommendation</Text>
                </View>
                <Text className="text-white font-medium text-sm leading-relaxed">
                   Route O- units to <Text className="font-bold">Black Lion Hospital</Text>. High demand predicted next 6 hours.
                </Text>
                <TouchableOpacity className="mt-4 bg-white/10 border border-white/20 py-3 rounded-xl flex-row items-center justify-center gap-2">
                   <Text className="text-white font-bold text-xs uppercase">Apply Suggestion</Text>
                   <ArrowRight size={14} color="#fff" />
                </TouchableOpacity>
             </View>

             <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Action Required</Text>

             {EXPIRY_ALERTS.map((item, index) => (
                <View key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                   <View className={`h-1 w-full ${item.critical ? 'bg-red-600' : 'bg-amber-500'}`} />
                   <View className="p-4">
                      <View className="flex-row items-start gap-4 mb-4">
                         <View className={`w-12 h-12 rounded-xl items-center justify-center border font-bold ${item.critical ? 'bg-red-50 border-red-100 text-red-700' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                            <Text className="text-lg font-bold">{item.type}</Text>
                         </View>
                         <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-1">
                               <Text className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.critical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                                  {item.critical ? 'Critical' : 'Warning'}
                               </Text>
                               <Text className="text-[10px] font-bold text-gray-400 font-mono">{item.id}</Text>
                            </View>
                            <Text className="text-sm font-bold text-gray-900">{item.name}</Text>
                            <View className="flex-row items-center gap-1 mt-1">
                               <MapPin size={10} color="#666" />
                               <Text className="text-[10px] text-gray-500">Current: {item.location}</Text>
                            </View>
                         </View>
                      </View>

                      <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
                         <View>
                            <View className="flex-row items-center gap-1.5">
                               <Clock size={16} color={item.critical ? '#ba1a1a' : '#D97706'} />
                               <Text className="text-xl font-bold font-mono text-gray-900">{item.timer}</Text>
                            </View>
                            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Until Expiry</Text>
                         </View>
                         <View className="flex-row gap-2">
                            <TouchableOpacity className="px-4 py-2 bg-gray-50 rounded-lg">
                               <Text className="text-xs font-bold text-gray-600">Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="px-4 py-2 bg-red-800 rounded-lg">
                               <Text className="text-xs font-bold text-white">Route</Text>
                            </TouchableOpacity>
                         </View>
                      </View>
                   </View>
                </View>
             ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
