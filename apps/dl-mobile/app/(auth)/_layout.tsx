import React from 'react';
import { Tabs } from 'expo-router';
import { NavTabItem } from '@/components/NavTabItem';

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen 
        name="login" 
        options={{
          tabBarIcon: ({ focused }) => (
            <NavTabItem label="Login" iconName="login" focused={focused} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="register" 
        options={{
          tabBarIcon: ({ focused }) => (
            <NavTabItem label="Register" iconName="person-add" focused={focused} />
          ),
        }} 
      />
    </Tabs>
  );
}