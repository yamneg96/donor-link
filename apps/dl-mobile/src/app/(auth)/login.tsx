import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AdaptiveRow } from '@/src/components/Icon';
import {useAuthStore} from '@/src/store/authStore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context'

type Role = 'donor' | 'staff' | 'admin';

const LoginScreen = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('staff');
  const [staffId, setStaffId] = useState('ETH-882');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const { login } = useAuthStore();

  const handleLogin = async() => {
    console.log(`Submitting tracking role target: ${selectedRole}`);
    // login(staffId, password);
    await AsyncStorage.setItem('@has_onboarded', 'false');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="p-margin"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Element */}
          <View className="w-full bg-card border border-border rounded-lg p-lg shadow-sm">
            
            {/* Branding Block */}
            <View className="items-center mb-xl">
              <View className="w-16 h-16 bg-primary-container rounded-full items-center justify-center mb-sm shadow-inner">
                <MaterialIcons name="water-drop" size={32} color="hsl(var(--primary))" />
              </View>
              <Text className="text-2xl font-bold text-foreground text-center">
                DonorLink Ethiopia
              </Text>
              <Text className="text-sm text-muted-foreground text-center mt-2 px-4">
                Secure national blood coordination platform. Ensuring vital resources reach their destination efficiently.
              </Text>
            </View>

            {/* Prompt */}
            <View className="mb-md">
              <Text className="text-lg font-semibold text-foreground">Secure Login</Text>
              <Text className="text-sm text-muted-foreground">Select your operational role to continue.</Text>
            </View>

            {/* Role Tab Grid Layout using AdaptiveRow blocks */}
            <View className="flex-row gap-2 mb-lg">
              
              {/* Option: Donor */}
              <AdaptiveRow
                title="Donor"
                leftIconFamily="MaterialIcons"
                leftIconName="volunteer-activism"
                leftIconSize={22}
                leftIconColor={selectedRole === 'donor' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                onPress={() => setSelectedRole('donor')}
                textClassName={`text-xs font-semibold mt-1 ${selectedRole === 'donor' ? 'text-primary' : 'text-foreground'}`}
                className={`flex-1 h-16 flex-col items-center justify-center p-0 rounded-md border bg-background ${
                  selectedRole === 'donor' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
              />

              {/* Option: Staff */}
              <AdaptiveRow
                title="Staff"
                leftIconFamily="MaterialIcons"
                leftIconName="local-hospital"
                leftIconSize={22}
                leftIconColor={selectedRole === 'staff' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                onPress={() => setSelectedRole('staff')}
                textClassName={`text-xs font-semibold mt-1 ${selectedRole === 'staff' ? 'text-primary' : 'text-foreground'}`}
                className={`flex-1 h-16 flex-col items-center justify-center p-0 rounded-md border bg-background relative ${
                  selectedRole === 'staff' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
              >
                {/* Embedded Custom Node for Selected Status Indicators */}
                <View className="items-center justify-center">
                  {selectedRole === 'staff' && (
                    <View className="absolute -top-7 -right-10 bg-primary w-4 h-4 rounded-full items-center justify-center z-10">
                      <MaterialIcons name="check" size={10} color="hsl(var(--primary-foreground))" />
                    </View>
                  )}
                  <MaterialIcons
                    name="local-hospital"
                    size={22}
                    color={selectedRole === 'staff' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                  />
                  <Text className={`text-xs font-semibold mt-1 ${selectedRole === 'staff' ? 'text-primary' : 'text-foreground'}`}>
                    Staff
                  </Text>
                </View>
              </AdaptiveRow>

              {/* Option: Admin */}
              <AdaptiveRow
                title="Admin"
                leftIconFamily="MaterialIcons"
                leftIconName="admin-panel-settings"
                leftIconSize={22}
                leftIconColor={selectedRole === 'admin' ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                onPress={() => setSelectedRole('admin')}
                textClassName={`text-xs font-semibold mt-1 ${selectedRole === 'admin' ? 'text-primary' : 'text-foreground'}`}
                className={`flex-1 h-16 flex-col items-center justify-center p-0 rounded-md border bg-background ${
                  selectedRole === 'admin' ? 'border-primary border-2 bg-primary/10' : 'border-border'
                }`}
              />
            </View>

            {/* Inputs Group */}
            <View className="gap-md">
              {/* Field: ID Form */}
              <View className="gap-1.5">
                <Text className="text-sm font-semibold text-foreground">Staff ID / Email</Text>
                <View className="flex-row items-center h-touch-target bg-background border border-border rounded-md px-3 focus:border-ring">
                  <MaterialIcons name="badge" size={20} color="hsl(var(--muted-foreground))" className="mr-2" />
                  <TextInput
                    className="flex-1 h-full text-base text-foreground"
                    placeholder="e.g. HOSP-1234"
                    placeholderTextColor="hsl(var(--muted-foreground))"
                    value={staffId}
                    onChangeText={setStaffId}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Field: Security Access */}
              <View className="gap-1.5">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold text-foreground">Password</Text>
                  <TouchableOpacity activeOpacity={0.6}>
                    <Text className="text-sm font-medium text-primary">Forgot?</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center h-touch-target bg-background border border-border rounded-md px-3 focus:border-ring">
                  <MaterialIcons name="lock" size={20} color="hsl(var(--muted-foreground))" className="mr-2" />
                  <TextInput
                    className="flex-1 h-full text-base text-foreground"
                    placeholder="••••••••"
                    placeholderTextColor="hsl(var(--muted-foreground))"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} activeOpacity={0.7}>
                    <MaterialIcons
                      name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                      size={20}
                      color="hsl(var(--muted-foreground))"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* OTP Notification Banner using an asset-less AdaptiveRow layout */}
              <AdaptiveRow
                leftIconFamily="MaterialIcons"
                leftIconName="security"
                leftIconSize={20}
                leftIconColor="hsl(var(--primary))"
                className="bg-alert border-l-4 border-primary p-3 rounded-none rounded-r-md min-h-0 items-start"
              >
                <Text className="flex-1 text-xs leading-normal text-muted-foreground ml-0.5">
                  A One-Time Password (OTP) will be sent to your registered device upon clicking continue.
                </Text>
              </AdaptiveRow>

              {/* Action Buttons */}
              <View className="gap-2.5 mt-2">
                <TouchableOpacity
                  className="h-touch-target bg-primary rounded-md flex-row items-center justify-center gap-1.5 shadow-sm"
                  onPress={handleLogin}
                  activeOpacity={0.8}
                >
                  <Text className="text-primary-foreground font-semibold text-base">Continue</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="hsl(var(--primary-foreground))" />
                </TouchableOpacity>

                {/* Biometric Trigger converted directly into a single clean AdaptiveRow call */}
                <AdaptiveRow
                  title="Biometric Login"
                  leftIconFamily="MaterialIcons"
                  leftIconName="fingerprint"
                  leftIconSize={20}
                  leftIconColor="hsl(var(--secondary-foreground))"
                  className="h-touch-target bg-secondary rounded-md border border-border justify-center items-center"
                  textClassName="text-secondary-foreground font-semibold text-base flex-none"
                  onPress={() => console.log('Triggering device biometrics...')}
                />
              </View>
            </View>

            {/* Regulatory Footer */}
            <Text className="text-[11px] text-center text-muted-foreground mt-6 leading-relaxed">
              By logging in, you agree to the{' '}
              <Text className="text-primary underline">Terms of Service</Text> &{' '}
              <Text className="text-primary underline">Privacy Policy</Text>.
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;