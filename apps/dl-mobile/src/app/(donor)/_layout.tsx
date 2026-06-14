import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Home, 
  User, 
  Megaphone, 
  Bell,
  Map as MapIcon
} from 'lucide-react-native';

export default function DonorLayout() {
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
        name="home" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="recruitment" 
        options={{ 
          title: 'Mobilize',
          tabBarIcon: ({ color }) => <Megaphone size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="alerts" 
        options={{ 
          title: 'Alerts',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}