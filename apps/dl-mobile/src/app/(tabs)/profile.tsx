import React, { useState } from 'react';
import { View, ScrollView, Pressable, Switch } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/authStore';
import { 
  User, Mail, Phone, MapPin, Droplet, 
  Settings, Shield, Bell, HelpCircle, 
  LogOut, ChevronRight, Edit2, Camera
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ConfirmModal } from '../../components/shared/ConfirmModal';
import Constants from 'expo-constants';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const sections = [
    {
      title: 'Preferences',
      items: [
        { id: 'notifications', label: 'Push Notifications', icon: Bell, type: 'switch', value: notifications, onValueChange: setNotifications },
        { id: 'privacy', label: 'Privacy Settings', icon: Shield, type: 'link' },
      ]
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: HelpCircle, type: 'link' },
        { id: 'terms', label: 'Terms & Conditions', icon: Shield, type: 'link' },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header / Brand Profile Area */}
        <View className="px-6 pt-6 pb-10 bg-primary/5 rounded-b-[40px] items-center">
          <View className="relative">
            <View className="w-28 h-28 bg-white rounded-full items-center justify-center border-4 border-white shadow-lg overflow-hidden">
              <User size={60} className="text-primary/20" />
            </View>
            <Pressable className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-background">
              <Camera size={16} className="text-white" />
            </Pressable>
          </View>
          <Text className="text-2xl font-bold mt-4">{user?.firstName} {user?.lastName}</Text>
          <View className="flex-row items-center gap-1.5 mt-1">
            <View className="w-2 h-2 rounded-full bg-success" />
            <Text className="text-muted-foreground font-medium">Regular Donor</Text>
          </View>

          <View className="flex-row gap-8 mt-8">
            <View className="items-center">
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm mb-2">
                <Droplet size={24} className="text-primary" />
              </View>
              <Text className="font-bold text-lg">{user?.bloodType || '--'}</Text>
              <Text variant="small" className="text-muted-foreground">Type</Text>
            </View>
            <View className="items-center">
               <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm mb-2">
                <MapPin size={24} className="text-primary" />
              </View>
              <Text className="font-bold text-lg">{user?.region || 'Addis'}</Text>
              <Text variant="small" className="text-muted-foreground">Region</Text>
            </View>
          </View>
        </View>

        {/* Action Items */}
        <View className="px-6 py-8">
          <View className="flex-row justify-between items-center mb-6">
            <Text variant="h3" className="font-bold">Account Settings</Text>
            <Pressable className="bg-primary/10 px-4 py-2 rounded-full flex-row items-center gap-2">
              <Edit2 size={14} className="text-primary" />
              <Text className="text-primary font-bold">Edit Profile</Text>
            </Pressable>
          </View>

          {sections.map((section, idx) => (
            <View key={idx} className="mb-8">
              <Text variant="small" className="text-muted-foreground uppercase tracking-widest font-bold mb-4 ml-2">
                {section.title}
              </Text>
              <View className="bg-muted/20 rounded-3xl overflow-hidden">
                {section.items.map((item, i) => (
                  <Pressable 
                    key={item.id} 
                    className={`flex-row items-center p-5 active:bg-muted/40 ${i !== section.items.length - 1 ? 'border-b border-border/50' : ''}`}
                  >
                    <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4">
                      <item.icon size={20} className="text-foreground/70" />
                    </View>
                    <Text className="flex-1 font-bold text-lg">{item.label}</Text>
                    {item.type === 'switch' ? (
                      <Switch 
                        value={item.value} 
                        onValueChange={item.onValueChange} 
                        trackColor={{ false: 'hsl(var(--muted))', true: 'hsl(var(--primary))' }}
                      />
                    ) : (
                      <ChevronRight size={20} className="text-muted-foreground" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          <Button 
            variant="outline" 
            className="border-destructive/20 h-14 rounded-2xl flex-row items-center justify-center bg-destructive/5"
            onPress={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} className="text-destructive mr-2" />
            <Text className="text-destructive font-bold text-lg">Log Out Session</Text>
          </Button>
        </View>

        <View className="items-center pb-20">
          <Text variant="small" className="text-muted-foreground">DonorLink Mobile v{Constants.expoConfig?.version || '1.0.0'}</Text>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={showLogoutModal}
        title="Log Out Account?"
        message="Are you sure you want to log out? You will need to sign back in to access your donation history."
        confirmText="Log Out"
        isDestructive={true}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </SafeAreaView>
  );
}
