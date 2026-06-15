import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, Pressable, TextInput } from 'react-native';
import { Text } from '../../components/ui/text';
import { Button } from '../../components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useVerifyOtp } from '../../queries/authQueries';
import { StatusModal } from '../../components/shared/StatusModal';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Otp() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const verifyOtpMutation = useVerifyOtp();
  const [statusModal, setStatusModal] = useState({ visible: false, type: 'error' as const, message: '' });

  const inputs = React.useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) return;

    verifyOtpMutation.mutate({ email: email!, otp: code }, {
      onSuccess: () => {
        router.replace('/(tabs)/home');
      },
      onError: (error: any) => {
        setStatusModal({
          visible: true,
          type: 'error',
          message: error.response?.data?.message || 'Invalid verification code.',
        });
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6">
          <View className="flex-row items-center mt-6 mb-12">
            <Pressable onPress={() => router.back()} className="p-2 -ml-2">
              <ChevronLeft size={24} className="text-foreground" />
            </Pressable>
            <View className="flex-1 items-center mr-8">
              <Text variant="h3" className="font-bold">Verification</Text>
            </View>
          </View>

          <View className="items-center mb-10">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
              <ShieldCheck size={40} className="text-primary" />
            </View>
            <Text variant="h2" className="font-bold text-center mb-2">Check your email</Text>
            <Text className="text-center text-muted-foreground px-4">
              We've sent a 6-digit verification code to {'\n'}
              <Text className="font-bold text-foreground">{email}</Text>
            </Text>
          </View>

          <View className="flex-row justify-between mb-10">
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => { inputs.current[i] = ref; }}
                className="w-[14%] aspect-square bg-muted/30 rounded-2xl text-center text-2xl font-bold border border-transparent focus:border-primary text-foreground"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
              />
            ))}
          </View>

          <Button 
            className="h-14 rounded-2xl" 
            onPress={handleVerify}
            disabled={verifyOtpMutation.isPending || otp.join('').length < 6}
          >
            <Text className="text-white font-bold text-lg">
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Code'}
            </Text>
          </Button>

          <View className="mt-8 items-center">
            {timer > 0 ? (
              <Text className="text-muted-foreground">
                Resend code in <Text className="text-primary font-bold">{timer}s</Text>
              </Text>
            ) : (
              <Pressable className="flex-row items-center gap-2">
                <RefreshCw size={16} className="text-primary" />
                <Text className="text-primary font-bold">Resend Verification Code</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <StatusModal
        visible={statusModal.visible}
        type="error"
        title="Verification Failed"
        message={statusModal.message}
        onClose={() => setStatusModal({ ...statusModal, visible: false })}
      />
    </SafeAreaView>
  );
}
