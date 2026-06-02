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
import { usuarioService } from '@/features/usuarios/services/usuario-service';
import { useAuth } from '@/context/auth-context';
import { useResponsive } from '@/hooks/use-responsive';
import type { ApiError } from '@/types';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();
  const { width, height } = useResponsive();

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Nome, e-mail e senha são obrigatórios.');
      return;
    }
    if (senha.length > 6) {
      Alert.alert('Atenção', 'A senha deve ter no máximo 6 caracteres.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await usuarioService.criar({ nome, email, senha, nivelAcesso: 'DONATARIO' });
      await signIn({ email, senha });
      router.replace('/(tabs)');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
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
              onPress={() => router.back()}
              style={{ alignSelf: 'flex-start', marginBottom: height * 0.01 }}>
              <Text style={{ color: '#D4956A', fontSize: width * 0.04, fontWeight: '600' }}>
                ← Voltar
              </Text>
            </TouchableOpacity>

            <Text style={{ color: '#F5C5A0', fontSize: width * 0.055, fontWeight: 'bold', marginBottom: 4 }}>
              Criar conta
            </Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}

            <Text style={{ color: '#fff', fontSize: width * 0.038, marginBottom: 4, fontWeight: '600' }}>
              Nome completo
            </Text>
            <TextInput
              style={inputStyle(width, height)}
              placeholder="Seu nome"
              placeholderTextColor="#ccc"
              maxLength={30}
              value={nome}
              onChangeText={setNome}
              editable={!isLoading}
            />

            <Text style={{ color: '#fff', fontSize: width * 0.038, marginBottom: 4, fontWeight: '600' }}>
              E-mail
            </Text>
            <TextInput
              style={inputStyle(width, height)}
              placeholder="seu@email.com"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />

            <Text style={{ color: '#fff', fontSize: width * 0.038, marginBottom: 4, fontWeight: '600' }}>
              Senha (máx. 6 caracteres)
            </Text>
            <TextInput
              style={inputStyle(width, height)}
              placeholder="••••••"
              placeholderTextColor="#ccc"
              secureTextEntry
              maxLength={6}
              value={senha}
              onChangeText={setSenha}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, { paddingVertical: height * 0.018 }, isLoading && { opacity: 0.6 }]}
              onPress={handleCadastro}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: width * 0.042, textAlign: 'center' }}>
                  Criar conta
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

function inputStyle(width: number, height: number) {
  return {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 8,
    padding: width * 0.035,
    color: '#fff',
    fontSize: width * 0.038,
    marginBottom: height * 0.018,
  };
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
  button: {
    backgroundColor: '#5C3317',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#8B4814',
    marginTop: 4,
  },
});
