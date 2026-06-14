import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Fingerprint } from 'lucide-react-native';

export function BiometricLock() {
  return (
    <Modal visible={true} transparent={false} animationType="fade">
      <View className="flex-1 bg-background items-center justify-center p-xl">
        <View className="items-center gap-6">
          <View className="w-24 h-24 bg-primary-container rounded-full items-center justify-center shadow-xl">
             <Fingerprint size={48} color="#93000b" />
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-foreground">App Locked</Text>
            <Text className="text-sm text-muted-foreground mt-2 text-center">
              Please authenticate using biometrics to continue.
            </Text>
          </View>
          <TouchableOpacity className="mt-8 bg-primary h-14 px-10 rounded-2xl items-center justify-center shadow-lg">
             <Text className="text-white font-bold uppercase tracking-widest">Unlock</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
