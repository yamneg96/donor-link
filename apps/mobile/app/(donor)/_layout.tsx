import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { Home, Heart, Bell, User } from "lucide-react-native";

function TabIcon({ icon, label, focused }: { icon: React.ReactNode; label: string; focused: boolean }) {
  return (
    <View className="items-center gap-1 pt-1">
      <View className={focused ? "text-[#D32F2F]" : "text-[#271816]/30"}>{icon}</View>
      <Text className={`text-xs font-bold ${focused ? "text-[#D32F2F]" : "text-[#271816]/30"}`}>{label}</Text>
    </View>
  );
}

export default function DonorTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "rgba(39,24,22,0.06)",
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<Home color={focused ? "#D32F2F" : "rgba(39,24,22,0.3)"} size={22} />} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<Bell color={focused ? "#D32F2F" : "rgba(39,24,22,0.3)"} size={22} />} label="Alerts" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="donations"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<Heart color={focused ? "#D32F2F" : "rgba(39,24,22,0.3)"} size={22} />} label="Donations" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={<User color={focused ? "#D32F2F" : "rgba(39,24,22,0.3)"} size={22} />} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}