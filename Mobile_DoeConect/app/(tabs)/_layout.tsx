import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useFavoritosContext } from '@/context/favoritos-context';

export default function TabLayout() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const { carregarDoBackend } = useFavoritosContext();

  const isDark = theme === 'dark';
  const tabBg = isDark ? '#1E1E1E' : '#FFFFFF';
  const tabBorder = isDark ? '#2A2A2A' : '#F0E8E0';
  const activeColor = isDark ? '#C47A45' : '#8B4A1E';
  const inactiveColor = isDark ? '#6A6A6A' : '#B0A090';

  useEffect(() => {
    if (usuario?.id) carregarDoBackend(usuario.id);
  }, [usuario?.id]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: tabBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="solicitacoes"
        options={{
          title: 'Solicitações',
          tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="anuncios"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
