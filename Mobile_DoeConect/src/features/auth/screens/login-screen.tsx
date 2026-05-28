import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useResponsive } from '@/hooks/use-responsive';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { signIn, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  const { width, height } = useResponsive();

  async function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    try {
      await signIn({ email: email.trim(), senha });
      router.replace('/(tabs)');
    } catch {
      // erro já está no context
    }
  }

  return (
    <ImageBackground
      source={require('../../../../assets/images/mock/foto1.jpg')}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 0.9 }}>
      <View style={styles.overlay} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: height * 0.06,
          }}
          keyboardShouldPersistTaps="handled">
          <View
            style={{
              width: width * 0.88,
              backgroundColor: 'rgba(92, 51, 23, 0.85)',
              borderRadius: 16,
              padding: width * 0.06,
              borderWidth: 1,
              borderColor: 'rgba(92, 51, 23, 0.6)',
              gap: 4,
            }}>
            <TouchableOpacity
              onPress={() => router.push('/')}
              style={{ alignSelf: 'flex-start', marginBottom: height * 0.01 }}>
              <Text style={{ color: '#D4956A', fontSize: width * 0.04, fontWeight: '600' }}>
                ← Voltar
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                color: '#F5C5A0',
                fontSize: width * 0.058,
                fontWeight: 'bold',
                fontFamily: 'Times New Roman',
              }}>
              DoeConect+
            </Text>
            <Text style={{ color: '#fff', fontSize: width * 0.032, marginBottom: height * 0.02 }}>
              Faça login para continuar
            </Text>

            {error && (
              <TouchableOpacity onPress={clearError}>
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>⚠️ {error}</Text>
                </View>
              </TouchableOpacity>
            )}

            <Text style={{ color: '#fff', fontSize: width * 0.04, marginBottom: 6, fontWeight: '600' }}>
              E-mail
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
                borderRadius: 8,
                padding: width * 0.035,
                color: '#fff',
                fontSize: width * 0.04,
                marginBottom: height * 0.02,
              }}
              placeholder="seu@email.com"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            <Text style={{ color: '#fff', fontSize: width * 0.04, marginBottom: 6, fontWeight: '600' }}>
              Senha
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
                borderRadius: 8,
                padding: width * 0.035,
                color: '#fff',
                fontSize: width * 0.04,
                marginBottom: height * 0.025,
              }}
              placeholder="••••••••"
              placeholderTextColor="#ccc"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[
                styles.loginButton,
                { paddingVertical: height * 0.018 },
                isLoading && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: width * 0.042, textAlign: 'center' }}>
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 12, alignSelf: 'center' }}
              onPress={() => router.push('/(auth)/cadastro')}>
              <Text style={{ color: '#D4956A', fontSize: width * 0.036 }}>
                Não tem conta? <Text style={{ fontWeight: '700' }}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  container: { flex: 1 },
  flex: { flex: 1 },
  errorBox: {
    backgroundColor: 'rgba(220,53,69,0.25)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(220,53,69,0.5)',
  },
  errorText: { color: '#ffb3b3', fontSize: 13 },
  loginButton: {
    backgroundColor: '#5C3317',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#8B4814',
  },
});
