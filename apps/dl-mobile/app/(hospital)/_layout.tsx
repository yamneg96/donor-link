import { View, Text } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';

type Props = {};

const HospitalLayout = (props: Props) => {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
    </Tabs>
  );
};

export default HospitalLayout;