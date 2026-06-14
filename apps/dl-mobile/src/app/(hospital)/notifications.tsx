import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Truck, 
  History, 
  Filter,
  CheckCheck,
  ChevronRight,
  Database,
  Smartphone,
  ShieldCheck
} from 'lucide-react-native';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'critical',
    title: 'CRITICAL SHORTAGE: O- NEGATIVE',
    desc: 'Black Lion Hospital reporting critically low levels of O- blood. Immediate dispatch required.',
    time: '2 min ago',
    action: 'Initiate Transfer',
    icon: <AlertTriangle size={20} color="#fff" fill="#ba1a1a" />
  },
  {
    id: '2',
    type: 'warning',
    title: 'TRANSIT DELAY ALERT',
    desc: "Dispatch #TR-9942 to St. Paul's Hospital is 10 minutes behind schedule.",
    time: '15 min ago',
    delay: '+10m',
    eta: '14:30',
    icon: <Clock size={20} color="#b45309" fill="#fef3c7" />
  },
  {
    id: '3',
    type: 'success',
    title: 'DELIVERY CONFIRMED',
    desc: 'Transfer #TR-9940 (4 units A+) successfully delivered to Zewditu Hospital.',
    time: '1 hr ago',
    icon: <CheckCircle2 size={20} color="#0061a6" fill="#0061a6" />
  }
];

const LOGS = [
  { time: '14:02', title: 'New Request Logged', meta: 'Yekatit 12 | Priority: High' },
  { time: '13:45', title: 'Driver Assigned', meta: 'Vehicle: AM-442 | ID: 104' },
  { time: '13:10', title: 'Inventory Update', meta: '+12 Units at Hub A' },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-8 bg-white border-b border-gray-100">
         <View className="flex-row justify-between items-end mb-2">
            <View>
               <Text className="text-3xl font-bold text-gray-900">Notifications</Text>
               <Text className="text-sm text-gray-500 mt-1">System logs and operational alerts.</Text>
            </View>
            <TouchableOpacity className="bg-gray-50 p-2 rounded-full border border-gray-100">
               <Filter size={18} color="#666" />
            </TouchableOpacity>
         </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
         <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
               <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">Action Required</Text>
               <TouchableOpacity className="flex-row items-center gap-1.5">
                  <CheckCheck size={14} color="#00497f" />
                  <Text className="text-xs font-bold text-blue-900">Mark All Read</Text>
               </TouchableOpacity>
            </View>

            <View className="gap-4">
               {NOTIFICATIONS.map((item) => (
                  <View key={item.id} className={`rounded-3xl border p-4 shadow-sm relative overflow-hidden ${item.type === 'critical' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>
                     {item.type === 'critical' && <View className="absolute top-0 left-0 w-1.5 h-full bg-red-600" />}
                     {item.type === 'warning' && <View className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />}
                     
                     <View className="flex-row gap-3">
                        <View className="mt-1">{item.icon}</View>
                        <View className="flex-1">
                           <View className="flex-row justify-between items-start mb-1">
                              <Text className={`text-[10px] font-black uppercase tracking-wider ${item.type === 'critical' ? 'text-red-900' : 'text-gray-400'}`}>
                                 {item.title}
                              </Text>
                              <Text className="text-[9px] font-mono text-gray-400">{item.time}</Text>
                           </View>
                           <Text className="text-sm text-gray-800 leading-tight mb-4">{item.desc}</Text>
                           
                           {item.delay && (
                              <View className="bg-amber-50 rounded-xl p-3 border border-amber-100 mb-4">
                                 <View className="flex-row justify-between items-center">
                                    <Text className="text-[10px] font-mono text-amber-700">ETA: {item.eta}</Text>
                                    <Text className="text-[10px] font-black text-amber-800">{item.delay} Delay</Text>
                                 </View>
                                 <View className="w-full h-1 bg-amber-200/50 rounded-full mt-2 overflow-hidden">
                                    <View className="bg-amber-500 h-full w-[85%]" />
                                 </View>
                              </View>
                           )}

                           {item.action && (
                              <View className="flex-row gap-2">
                                 <TouchableOpacity className="bg-red-800 px-4 py-2 rounded-lg flex-row items-center gap-2">
                                    <Truck size={12} color="#fff" />
                                    <Text className="text-white font-bold text-[10px] uppercase">Initiate</Text>
                                 </TouchableOpacity>
                                 <TouchableOpacity className="border border-red-800 px-4 py-2 rounded-lg">
                                    <Text className="text-red-800 font-bold text-[10px] uppercase">Broadcast</Text>
                                 </TouchableOpacity>
                              </View>
                           )}
                        </View>
                     </View>
                  </View>
               ))}
            </View>

            {/* System Status */}
            <View className="mt-10 mb-6 bg-gray-50 rounded-3xl p-5 border border-gray-100">
               <Text className="text-lg font-bold text-gray-900 mb-4">System Status</Text>
               <View className="gap-3">
                  <View className="flex-row justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                     <View className="flex-row items-center gap-3">
                        <Database size={16} color="#10b981" />
                        <Text className="text-xs font-bold text-gray-700 uppercase">Database</Text>
                     </View>
                     <View className="w-2 h-2 rounded-full bg-green-500 shadow-sm" />
                  </View>
                  <View className="flex-row justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                     <View className="flex-row items-center gap-3">
                        <Smartphone size={16} color="#ba1a1a" />
                        <Text className="text-xs font-bold text-gray-700 uppercase">SMS Gateway</Text>
                     </View>
                     <View className="bg-red-50 px-2 py-0.5 rounded">
                        <Text className="text-[8px] font-black text-red-700 uppercase">Degraded</Text>
                     </View>
                  </View>
               </View>
            </View>

            {/* Logs */}
            <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Logs</Text>
            <View className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               {LOGS.map((log, idx) => (
                  <View key={idx} className={`flex-row items-center gap-4 p-4 ${idx !== LOGS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                     <Text className="text-[10px] font-mono text-gray-400 w-10">{log.time}</Text>
                     <View className="flex-1">
                        <Text className="text-xs font-bold text-gray-800">{log.title}</Text>
                        <Text className="text-[9px] text-gray-500 mt-0.5">{log.meta}</Text>
                     </View>
                     <ChevronRight size={14} color="#eee" />
                  </View>
               ))}
            </View>
         </View>
      </ScrollView>
    </SafeAreaView>
  );
}
