import React from 'react';
import { Tabs } from 'expo-router';
import { 
  LayoutDashboard, 
  Package, 
  AlertTriangle, 
  Map as MapIcon, 
  Bell,
  ArrowLeftRight
} from 'lucide-react-native';

export default function HospitalLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#93000b',
      tabBarInactiveTintColor: '#666',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        height: 60,
        paddingBottom: 8,
      },
      headerShown: false
    }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Command',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="inventory" 
        options={{ 
          title: 'Inventory',
          tabBarIcon: ({ color }) => <Package size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="alerts" 
        options={{ 
          title: 'Alerts',
          tabBarIcon: ({ color }) => <AlertTriangle size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map',
          tabBarIcon: ({ color }) => <MapIcon size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: 'Updates',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="transfer" 
        options={{ 
          href: null, // Hidden from tab bar but accessible via navigation
        }} 
      />
      <Tabs.Screen 
        name="index" 
        options={{ 
          href: null,
        }} 
      />
    </Tabs>
  );
}