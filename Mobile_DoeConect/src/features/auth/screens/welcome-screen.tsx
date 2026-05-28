import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/layout/parallax-scroll-view';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useResponsive } from '@/hooks/use-responsive';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width, height } = useResponsive();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('../../../../assets/images/mock/foto3.jpg')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={{ alignItems: 'center', marginTop: height * 0.04 }}>
        <Image
          source={require('../../../../assets/images/mock/foto2.jpg')}
          style={{
            width: width * 0.45,
            height: width * 0.45,
            borderRadius: width * 0.225,
            borderWidth: 1.5,
            borderColor: '#000',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
            elevation: 8,
          }}
        />
      </ThemedView>

      <ThemedView style={{ alignItems: 'center', justifyContent: 'center', marginTop: height * 0.02 }}>
        <ThemedText style={{ fontSize: width * 0.055, textAlign: 'center', fontWeight: 'bold' }}>
          SEJA BEM-VINDO(A)
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ marginTop: 16, paddingHorizontal: width * 0.04, marginBottom: width * 0.08 }}>
        <ThemedText
          style={{
            fontSize: width * 0.038,
            textAlign: 'justify',
            lineHeight: width * 0.058,
            fontWeight: 'bold',
            width: '100%',
          }}>
          CONECTAMOS DOADORES E QUEM PRECISA DE ROUPAS. AQUI VOCÊ PODE DOAR, RECEBER, TROCAR ROUPAS E
          AINDA FAZER NOVAS AMIZADES. FAÇA PARTE DESSA REDE DE SOLIDARIEDADE E EMPATIA COM RESPEITO E
          SEGURANÇA.
        </ThemedText>
      </ThemedView>

      <ThemedView style={{ alignItems: 'center', marginBottom: width * 0.08 }}>
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: '#5C3317',
            borderRadius: 8,
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.07,
          }}
          onPress={() => router.push('/login')}>
          <Text style={{ color: '#5C3317', fontSize: width * 0.038, fontWeight: '600' }}>
            Entrar
          </Text>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
});
