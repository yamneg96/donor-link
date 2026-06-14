import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className='flex text-center items-center justify-center'>
        <Text className='text-2xl font-bold text-destructive'>This screen doesn't exist.</Text>

        <Link href="/">
          <Text className='italic text-xl text-primary'>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
