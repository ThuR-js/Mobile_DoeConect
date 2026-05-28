import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';

import { HapticTab } from '@/components/ui/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading]);

  const tint = Colors[colorScheme ?? 'light'].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="anuncios"
        options={{
          title: 'Anúncios',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}
