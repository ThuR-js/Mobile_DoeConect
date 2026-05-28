import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { usuarioService } from '@/features/usuarios/services/usuario-service';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useResponsive } from '@/hooks/use-responsive';
import type { ApiError } from '@/types';

export default function PerfilScreen() {
  const { usuario, signOut } = useAuth();
  const { width } = useResponsive();

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [telefone, setTelefone] = useState(usuario?.telefone ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSalvar() {
    if (!usuario) return;
    setIsSaving(true);
    setError(null);
    try {
      await usuarioService.atualizar(usuario.id, { nome, telefone: telefone || undefined });
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? 'Erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]);
  }

  if (!usuario) return null;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <ThemedView style={styles.avatar}>
        <ThemedText style={{ fontSize: 48 }}>👤</ThemedText>
      </ThemedView>

      <ThemedText style={[styles.nome, { fontSize: width * 0.055 }]}>{usuario.nome}</ThemedText>
      <ThemedText style={styles.email}>{usuario.email}</ThemedText>
      <ThemedView style={styles.badge}>
        <ThemedText style={styles.badgeText}>{usuario.role}</ThemedText>
      </ThemedView>

      {error && (
        <View style={styles.errorBox}>
          <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
        </View>
      )}

      {editando ? (
        <ThemedView style={styles.form}>
          <ThemedText style={styles.label}>Nome</ThemedText>
          <TextInput
            style={[styles.input, { fontSize: width * 0.038 }]}
            value={nome}
            onChangeText={setNome}
            editable={!isSaving}
          />
          <ThemedText style={styles.label}>Telefone</ThemedText>
          <TextInput
            style={[styles.input, { fontSize: width * 0.038 }]}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            editable={!isSaving}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.btn, styles.btnSecundario]}
              onPress={() => setEditando(false)}
              disabled={isSaving}>
              <ThemedText style={{ fontWeight: '600' }}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnPrimario, isSaving && { opacity: 0.6 }]}
              onPress={handleSalvar}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Salvar</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
      ) : (
        <TouchableOpacity style={[styles.btn, styles.btnPrimario, { marginTop: 24 }]} onPress={() => setEditando(true)}>
          <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Editar perfil</ThemedText>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.btn, styles.btnLogout, { marginTop: 16 }]} onPress={handleLogout}>
        <ThemedText style={{ color: '#c0392b', fontWeight: '600' }}>Sair da conta</ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 24, alignItems: 'center', gap: 8 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#5C3317',
  },
  nome: { fontWeight: 'bold', textAlign: 'center' },
  email: { opacity: 0.6, fontSize: 14 },
  badge: {
    backgroundColor: '#5C3317',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  form: { width: '100%', gap: 4, marginTop: 16 },
  label: { fontSize: 13, fontWeight: '600', opacity: 0.7, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.3)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  formButtons: { flexDirection: 'row', gap: 12, marginTop: 4 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnPrimario: { backgroundColor: '#5C3317' },
  btnSecundario: { borderWidth: 1.5, borderColor: '#5C3317' },
  btnLogout: { borderWidth: 1.5, borderColor: '#c0392b', flex: 0, paddingHorizontal: 32 },
  errorBox: {
    backgroundColor: 'rgba(220,53,69,0.1)',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(220,53,69,0.3)',
  },
  errorText: { color: '#c0392b', fontSize: 13 },
});
