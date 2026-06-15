import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { FormInput } from '../../components/forms/FormInput';
import { BloodTypeSelector } from '../../components/forms/BloodTypeSelector';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { router } from 'expo-router';
import { User, Mail, Phone, Lock, ChevronLeft, Droplet, MapPin, Eye, EyeOff } from 'lucide-react-native';
import { useRegister } from '../../queries/authQueries';
import { StatusModal } from '../../components/shared/StatusModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BloodType } from '../../types';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  bloodType: z.nativeEnum(BloodType, { message: 'Please select a blood type' }),
  region: z.string().min(2, 'Please enter your region'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [step, setStep] = useState(1);
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      bloodType: '' as any,
    }
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const registerMutation = useRegister();
  const [statusModal, setStatusModal] = useState<{
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({ visible: false, type: 'success', title: '', message: '' });

  const selectedBloodType = watch('bloodType');

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        setStatusModal({
          visible: true,
          type: 'success',
          title: 'Registration Successful',
          message: 'Please verify your email with the OTP sent to you.',
        });
      },
      onError: (error: any) => {
        setStatusModal({
          visible: true,
          type: 'error',
          title: 'Registration Failed',
          message: error.response?.data?.message || 'Something went wrong. Please try again.',
        });
      }
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-row items-center mt-6 mb-8">
            <Pressable onPress={() => step > 1 ? prevStep() : router.back()} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-foreground" />
            </Pressable>
            <View className="flex-1 items-center mr-8">
              <Text variant="h3" className="font-bold">Create Account</Text>
            </View>
          </View>

          <View className="flex-row gap-2 mb-8">
            {[1, 2].map((i) => (
              <View key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </View>

          {step === 1 ? (
            <View className="gap-2">
              <Text variant="h2" className="mb-6 font-bold">Personal Details</Text>
              
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <FormInput
                    name="firstName"
                    control={control as any}
                    label="First Name"
                    placeholder="John"
                    icon={User}
                    error={errors.firstName?.message}
                  />
                </View>
                <View className="flex-1">
                  <FormInput
                    name="lastName"
                    control={control as any}
                    label="Last Name"
                    placeholder="Doe"
                    icon={User}
                    error={errors.lastName?.message}
                  />
                </View>
              </View>

              <FormInput
                name="phone"
                control={control as any}
                label="Phone Number"
                placeholder="+251 ..."
                icon={Phone}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />

              <FormInput
                name="region"
                control={control as any}
                label="Region / City"
                placeholder="Addis Ababa"
                icon={MapPin}
                error={errors.region?.message}
              />

              <View className="mb-4">
                <Text variant="small" className="mb-3 font-bold text-muted-foreground ml-1">
                  Blood Type
                </Text>
                <BloodTypeSelector 
                  value={selectedBloodType} 
                  onChange={(val) => setValue('bloodType', val, { shouldValidate: true })} 
                />
                {errors.bloodType && (
                  <Text variant="small" className="text-primary mt-2 ml-1 font-medium">
                    {errors.bloodType.message}
                  </Text>
                )}
              </View>

              <Button className="h-14 rounded-2xl mt-6" onPress={nextStep}>
                <Text className="text-white font-bold">Next Step</Text>
              </Button>
            </View>
          ) : (
            <View className="gap-2">
              <Text variant="h2" className="mb-6 font-bold">Secure Account</Text>
              
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

              <Button 
                className="h-14 rounded-2xl mt-8" 
                onPress={handleSubmit(onSubmit)}
                disabled={registerMutation.isPending}
              >
                <Text className="text-white font-bold text-lg">
                  {registerMutation.isPending ? 'Creating Account...' : 'Complete Register'}
                </Text>
              </Button>
            </View>
          )}

          <View className="flex-row justify-center items-center mt-12 pb-8 gap-1">
            <Text className="text-muted-foreground">Already have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-bold">Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusModal
        visible={statusModal.visible}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => {
          setStatusModal({ ...statusModal, visible: false });
          if (statusModal.type === 'success') {
            router.push({ pathname: '/(auth)/otp', params: { email: watch('email') } });
          }
        }}
      />
    </SafeAreaView>
  );
}
