import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Droplet, 
  Hospital, 
  ShieldCheck, 
  ArrowRight, 
  Fingerprint, 
  Eye, 
  EyeOff, 
  BadgeCheck, 
  Lock,
  UserCheck
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Role = 'Donor' | 'Staff' | 'Admin';

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('Staff');
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('ETH-882');

  const handleLogin = () => {
    if (role === 'Staff') {
      router.replace('/(hospital)/dashboard');
    } else if (role === 'Donor') {
      router.replace('/(donor)/profile');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6fafe]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 py-10 justify-center">
            {/* Logo Section */}
            <View className="items-center mb-12">
               <View className="w-20 h-20 bg-red-800 rounded-3xl items-center justify-center shadow-xl shadow-red-800/30 mb-6">
                  <Droplet size={40} color="#fff" fill="#fff" />
               </View>
               <Text className="text-3xl font-black text-red-900 tracking-tight">DonorLink</Text>
               <Text className="text-gray-500 font-bold uppercase tracking-[4px] mt-1">Ethiopia</Text>
            </View>

            <View className="mb-8">
               <Text className="text-2xl font-bold text-gray-900">Secure Login</Text>
               <Text className="text-sm text-gray-500 mt-1">Select your operational role to continue.</Text>
            </View>

            {/* Role Selection */}
            <View className="flex-row gap-3 mb-8">
               {(['Donor', 'Staff', 'Admin'] as Role[]).map((r) => (
                  <TouchableOpacity 
                    key={r}
                    onPress={() => setRole(r)}
                    className={`flex-1 py-4 rounded-2xl border-2 items-center justify-center gap-2 ${role === r ? 'bg-red-800 border-red-900' : 'bg-white border-gray-100'}`}
                  >
                     {r === 'Donor' && <UserCheck size={20} color={role === r ? '#fff' : '#666'} />}
                     {r === 'Staff' && <Hospital size={20} color={role === r ? '#fff' : '#666'} />}
                     {r === 'Admin' && <ShieldCheck size={20} color={role === r ? '#fff' : '#666'} />}
                     <Text className={`text-[10px] font-black uppercase tracking-widest ${role === r ? 'text-white' : 'text-gray-500'}`}>{r}</Text>
                     {role === r && (
                        <View className="absolute -top-2 -right-2 bg-red-600 rounded-full p-0.5 border border-white">
                           <BadgeCheck size={12} color="#fff" fill="#fff" />
                        </View>
                     )}
                  </TouchableOpacity>
               ))}
            </View>

            {/* Form */}
            <View className="gap-4">
               <View>
                  <Text className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Staff ID / Email</Text>
                  <View className="bg-white border border-gray-100 rounded-2xl flex-row items-center px-4 h-14">
                     <BadgeCheck size={20} color="#666" />
                     <TextInput 
                        className="flex-1 ml-3 font-bold text-gray-900"
                        placeholder="e.g. HOSP-1234"
                        value={identifier}
                        onChangeText={setIdentifier}
                     />
                  </View>
               </View>

               <View>
                  <View className="flex-row justify-between items-center mb-2 px-1">
                     <Text className="text-xs font-black text-gray-400 uppercase tracking-widest">Password</Text>
                     <TouchableOpacity>
                        <Text className="text-xs font-bold text-red-800">Forgot?</Text>
                     </TouchableOpacity>
                  </View>
                  <View className="bg-white border border-gray-100 rounded-2xl flex-row items-center px-4 h-14">
                     <Lock size={20} color="#666" />
                     <TextInput 
                        className="flex-1 ml-3 font-bold text-gray-900"
                        placeholder="••••••••"
                        secureTextEntry={!showPassword}
                     />
                     <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                     </TouchableOpacity>
                  </View>
               </View>

               {/* OTP Info */}
               <View className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex-row gap-3">
                  <ShieldCheck size={20} color="#00497f" />
                  <Text className="flex-1 text-xs text-blue-900 leading-relaxed font-medium">
                     A One-Time Password (OTP) will be sent to your registered device upon clicking continue.
                  </Text>
               </View>

               {/* Actions */}
               <View className="mt-4 gap-3">
                  <TouchableOpacity 
                    onPress={handleLogin}
                    className="bg-red-800 h-16 rounded-2xl flex-row items-center justify-center gap-2 shadow-xl shadow-red-800/20"
                  >
                     <Text className="text-white font-black uppercase tracking-widest">Continue</Text>
                     <ArrowRight size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity className="border border-gray-200 h-16 rounded-2xl flex-row items-center justify-center gap-2">
                     <Fingerprint size={20} color="#666" />
                     <Text className="text-gray-700 font-bold uppercase tracking-widest text-[11px]">Biometric Login</Text>
                  </TouchableOpacity>
               </View>
            </View>

            <View className="mt-12 items-center">
               <Text className="text-[10px] text-gray-400 text-center font-bold">
                  By logging in, you agree to the {'\n'}
                  <Text className="text-red-800">Terms of Service</Text> & <Text className="text-red-800">Privacy Policy</Text>
               </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
