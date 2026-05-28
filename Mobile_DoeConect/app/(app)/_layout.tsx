import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="anuncios/[id]" options={{ title: 'Detalhes', headerBackTitle: 'Voltar' }} />
      <Stack.Screen name="perfil/index" options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="favoritos/index" options={{ title: 'Favoritos' }} />
    </Stack>
  );
}
