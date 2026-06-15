import React from 'react';
import { View, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/forms/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from 'expo-router';
import { Mail, Lock, Fingerprint, Droplet, Eye, EyeOff } from 'lucide-react-native';
import { useLogin } from '../../queries/authQueries';
import { useAuthStore } from '../../store/authStore';
import { StatusModal } from '../../components/shared/StatusModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useLogin();
  const { biometricEnabled } = useAuthStore();
  const [errorModal, setErrorModal] = React.useState({ visible: false, message: '' });
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        router.replace('/(tabs)/home');
      },
      onError: (error: any) => {
        setErrorModal({ 
          visible: true, 
          message: error.response?.data?.message || 'Failed to login. Please check your credentials.' 
        });
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 bg-background">
          <View className="items-center mt-12 mb-12 bg-background">
            <View className="w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4">
              <Droplet size={40} className="text-primary" />
            </View>
            <Text variant="h1" className="font-bold text-3xl">Welcome Back</Text>
            <Text className="text-muted-foreground mt-2">Sign in to continue saving lives</Text>
          </View>

          <View className="gap-2">
            <FormInput
              name="email"
              control={control as any}
              label="Email Address"
              placeholder="name@example.com"
              icon={Mail}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <FormInput
              name="password"
              control={control as any}
              label="Password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? EyeOff : Eye}
              onPressRightIcon={() => setShowPassword(!showPassword)}
            />

            <Pressable className="self-end py-2">
              <Text className="text-primary font-bold">Forgot Password?</Text>
            </Pressable>

            <Button 
              className="h-14 rounded-2xl mt-6"
              onPress={handleSubmit(onSubmit)}
              disabled={loginMutation.isPending}
            >
              <Text className="text-white font-bold text-lg">
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Text>
            </Button>

            {biometricEnabled && (
              <Button 
                variant="outline"
                className="h-14 rounded-2xl mt-4 border-muted"
                onPress={() => {}}
              >
                <View className="flex-row items-center gap-2">
                  <Fingerprint size={20} className="text-primary" />
                  <Text className="font-bold">Biometric Login</Text>
                </View>
              </Button>
            )}
          </View>

          <View className="flex-row justify-center items-center mt-auto pb-8 gap-1">
            <Text className="text-muted-foreground">Don't have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text className="text-primary font-bold">Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusModal
        visible={errorModal.visible}
        type="error"
        title="Login Failed"
        message={errorModal.message}
        onClose={() => setErrorModal({ visible: false, message: '' })}
      />
    </SafeAreaView>
  );
}
