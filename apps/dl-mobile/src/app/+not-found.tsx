import { Link, Stack } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { Button } from '@/src/components/ui/button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: 'Lost in the Network', headerShown: false }} />
      
      <View className="flex-1 px-8 items-center justify-center">
        <View className="w-40 h-40 bg-primary/5 rounded-full items-center justify-center mb-8 border border-primary/10">
          <View className="w-32 h-32 bg-primary/10 rounded-full items-center justify-center">
            <FileQuestion size={64} className="text-primary opacity-80" strokeWidth={1.5} />
          </View>
        </View>

        <Text variant="h1" className="text-4xl font-black text-center mb-4 tracking-tighter">
          404
        </Text>
        
        <Text variant="h3" className="text-center font-bold mb-3">
          Screen Not Found
        </Text>
        
        <Text className="text-muted-foreground text-center text-lg leading-6 mb-10 px-4">
          The screen you're looking for seems to have disconnected. Would you like to head back?
        </Text>

        <View className="w-full gap-4">
          <Button 
            className="h-16 rounded-2xl flex-row items-center justify-center bg-primary"
            onPress={() => router.replace('/')}
          >
            <Home size={20} className="text-white mr-2" />
            <Text className="text-white font-bold text-lg">Return to Dashboard</Text>
          </Button>

          <Pressable 
            className="h-14 rounded-2xl items-center justify-center flex-row gap-2 active:bg-muted/30"
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
            <Text className="text-muted-foreground font-bold">Go Back</Text>
          </Pressable>
        </View>
      </View>

      <View className="p-8 items-center">
        <Text variant="small" className="text-muted-foreground/40 font-medium">
          DonorLink Protection System
        </Text>
      </View>
    </SafeAreaView>
  );
}
