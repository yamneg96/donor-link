import { Tabs } from 'expo-router';
import { Home, Droplet, MapPin, BarChart3, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { THEME } from '../../../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const activeColor = THEME[colorScheme as 'light' | 'dark'].primary;
  const inactiveColor = THEME[colorScheme as 'light' | 'dark'].mutedForeground;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: activeColor,
      tabBarInactiveTintColor: inactiveColor,
      tabBarStyle: {
        height: 56 + insets.bottom,
        paddingBottom: insets.bottom + 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: THEME[colorScheme as 'light' | 'dark'].border,
        backgroundColor: THEME[colorScheme as 'light' | 'dark'].card,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      }
    }}>
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="requests" 
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, size }) => <Droplet size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="centers" 
        options={{
          title: 'Centers',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="impact" 
        options={{
          title: 'Impact',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }} 
      />
    </Tabs>
  );
}
