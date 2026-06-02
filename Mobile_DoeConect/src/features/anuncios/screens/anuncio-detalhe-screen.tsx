import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { anuncioService } from '@/features/anuncios/services/anuncio-service';
import { solicitacaoService } from '@/features/anuncios/services/solicitacao-service';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ErrorMessage } from '@/components/feedback/error-message';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useAuth } from '@/context/auth-context';
import { useResponsive } from '@/hooks/use-responsive';
import type { Anuncio, ApiError } from '@/types';

export default function AnuncioDetalheScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contato, setContato] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { usuario } = useAuth();
  const router = useRouter();
  const { width, height } = useResponsive();

  useEffect(() => {
    if (!id) return;
    anuncioService
      .buscarPorId(Number(id))
      .then(setAnuncio)
      .catch((err: ApiError) => setError(err.message ?? 'Erro ao carregar anúncio.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleEnviarSolicitacao() {
    if (!usuario || !anuncio) return;
    setEnviando(true);
    try {
      await solicitacaoService.criar({
        usuario: { id: usuario.id },
        anuncio: { id: anuncio.id },
        telefone: contato.trim() || undefined,
      });
      setModalVisible(false);
      setContato('');
      Alert.alert('Solicitação enviada!', 'O doador foi notificado do seu interesse.');
    } catch (err) {
      const apiError = err as ApiError;
      Alert.alert('Erro', apiError.message ?? 'Não foi possível enviar a solicitação.');
    } finally {
      setEnviando(false);
    }
  }

  if (isLoading) return <LoadingOverlay />;
  if (error || !anuncio)
    return <ErrorMessage mensagem={error ?? 'Anúncio não encontrado.'} onRetry={() => router.back()} />;

  const disponivel = anuncio.statusAnuncio === 'ATIVO';

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {anuncio.foto ? (
          <Image
            source={{ uri: anuncio.foto }}
            style={{ width, height: height * 0.35 }}
            resizeMode="cover"
          />
        ) : (
          <ThemedView style={[styles.semImagem, { height: height * 0.25 }]}>
            <ThemedText style={{ fontSize: 64 }}>📦</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.content}>
          <ThemedText style={[styles.titulo, { fontSize: width * 0.055 }]} numberOfLines={3}>
            {anuncio.nome}
          </ThemedText>

          <View style={styles.badgeRow}>
            <ThemedView style={styles.badge}>
              <ThemedText style={styles.badgeText}>{anuncio.categoria.nome}</ThemedText>
            </ThemedView>
            <ThemedView style={[styles.badge, { backgroundColor: disponivel ? '#2e7d32' : '#9e9e9e' }]}>
              <ThemedText style={styles.badgeText}>{disponivel ? 'Disponível' : 'Indisponível'}</ThemedText>
            </ThemedView>
          </View>

          <ThemedText style={[styles.descricao, { fontSize: width * 0.038 }]}>
            {anuncio.descricao}
          </ThemedText>

          <ThemedView style={styles.infoBox}>
            <InfoRow label="Tamanho" value={anuncio.tamanho} />
            <InfoRow label="Condição" value={anuncio.condicao} />
            {anuncio.regiao ? <InfoRow label="Região" value={anuncio.regiao} /> : null}
          </ThemedView>

          <ThemedView style={styles.doadorBox}>
            <ThemedText style={styles.doadorLabel}>Doado por</ThemedText>
            <ThemedText style={[styles.doadorNome, { fontSize: width * 0.042 }]}>
              {anuncio.doador.nome}
            </ThemedText>
          </ThemedView>

          {usuario && disponivel && (
            <TouchableOpacity
              style={styles.btnSolicitacao}
              onPress={() => setModalVisible(true)}>
              <ThemedText style={styles.btnSolicitacaoText}>Tenho Interesse</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      </ScrollView>

      {Platform.OS === 'web' ? (
        modalVisible ? (
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalBox}>
              <ModalConteudo
                contato={contato}
                setContato={setContato}
                enviando={enviando}
                onCancelar={() => { setModalVisible(false); setContato(''); }}
                onEnviar={handleEnviarSolicitacao}
              />
            </ThemedView>
          </View>
        ) : null
      ) : (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <ThemedView style={styles.modalBox}>
              <ModalConteudo
                contato={contato}
                setContato={setContato}
                enviando={enviando}
                onCancelar={() => { setModalVisible(false); setContato(''); }}
                onEnviar={handleEnviarSolicitacao}
              />
            </ThemedView>
          </View>
        </Modal>
      )}
    </>
  );
}

function ModalConteudo({
  contato, setContato, enviando, onCancelar, onEnviar,
}: {
  contato: string;
  setContato: (v: string) => void;
  enviando: boolean;
  onCancelar: () => void;
  onEnviar: () => void;
}) {
  return (
    <>
      <ThemedText style={styles.modalTitulo}>Enviar Solicitação</ThemedText>
      <ThemedText style={styles.modalSubtitulo}>
        Deixe uma mensagem de contato para o doador (telefone, e-mail ou recado).
      </ThemedText>
      <TextInput
        style={[styles.modalInput, styles.modalInputMultiline]}
        placeholder="Ex: (11) 99999-9999 / seu@email.com / prefiro contato por WhatsApp..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={4}
        maxLength={40}
        value={contato}
        onChangeText={setContato}
        editable={!enviando}
      />
      <View style={styles.modalBtns}>
        <TouchableOpacity
          style={[styles.modalBtn, styles.modalBtnCancelar]}
          onPress={onCancelar}
          disabled={enviando}>
          <ThemedText style={{ fontWeight: '600' }}>Cancelar</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalBtn, styles.modalBtnEnviar, enviando && { opacity: 0.6 }]}
          onPress={onEnviar}
          disabled={enviando}>
          {enviando ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={{ color: '#fff', fontWeight: '700' }}>Enviar</ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <ThemedText style={styles.infoLabel}>{label}:</ThemedText>
      <ThemedText style={styles.infoValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  semImagem: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0e6d8' },
  content: { padding: 20, gap: 14 },
  titulo: { fontWeight: 'bold', lineHeight: 28 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5C3317',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  descricao: { lineHeight: 22, opacity: 0.8 },
  infoBox: {
    borderRadius: 10,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.2)',
  },
  infoRow: { flexDirection: 'row', gap: 6 },
  infoLabel: { fontWeight: '700', fontSize: 13 },
  infoValue: { fontSize: 13, opacity: 0.8 },
  doadorBox: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.2)',
  },
  doadorLabel: { fontSize: 12, opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' },
  doadorNome: { fontWeight: '700' },
  btnSolicitacao: {
    backgroundColor: '#5C3317',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#8B4814',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnSolicitacaoText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalOverlay: {
    ...Platform.select({
      web: {
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
      },
      default: { flex: 1 },
    }),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 12,
  },
  modalTitulo: { fontSize: 18, fontWeight: '700' },
  modalSubtitulo: { fontSize: 13, opacity: 0.7, lineHeight: 18 },
  modalInputMultiline: { height: 100, textAlignVertical: 'top' },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.3)',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginTop: 4,
  },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 4 },
  modalBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  modalBtnCancelar: { borderWidth: 1.5, borderColor: '#5C3317' },
  modalBtnEnviar: { backgroundColor: '#5C3317' },
});
