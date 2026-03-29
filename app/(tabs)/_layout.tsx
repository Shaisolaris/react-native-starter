import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { COLORS } from '../src/utils/theme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? COLORS.dark : COLORS.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor:  colors.tabBar,
          borderTopColor:   colors.tabBarBorder,
          borderTopWidth:   1,
          paddingBottom:    8,
          paddingTop:       8,
          height:           64,
        },
        tabBarLabelStyle: {
          fontSize:   11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title:    'Home',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="⌂" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title:    'Portfolio',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="◈" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title:    'Activity',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="↕" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title:    'Settings',
          tabBarIcon: ({ color, size }) => (
            <TabIcon icon="⚙" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color, size }: { icon: string; color: string; size: number }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: size * 0.8, color }}>{icon}</Text>;
}
