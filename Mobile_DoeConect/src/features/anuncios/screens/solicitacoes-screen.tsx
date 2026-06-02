import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { solicitacaoService } from '@/features/anuncios/services/solicitacao-service';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useResponsive } from '@/hooks/use-responsive';
import type { Solicitacao, ApiError } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EM_ANALISE: { label: 'Em análise', color: '#E67E22' },
  ACEITA:     { label: 'Aceita',     color: '#27AE60' },
  RECUSADA:   { label: 'Recusada',   color: '#E74C3C' },
  CANCELADA:  { label: 'Cancelada',  color: '#95A5A6' },
};

export default function SolicitacoesScreen() {
  const { usuario } = useAuth();
  const { width } = useResponsive();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!usuario) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await solicitacaoService.listarPorUsuario(usuario.id);
      setSolicitacoes(data.filter((s) => s.anuncio != null));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? 'Erro ao carregar solicitações.');
    } finally {
      setIsLoading(false);
    }
  }, [usuario]);

  useEffect(() => { carregar(); }, [carregar]);

  if (isLoading) return <LoadingOverlay mensagem="Carregando solicitações..." />;

  const statusCfg = (status: string) =>
    STATUS_CONFIG[status] ?? { label: status, color: '#7F8C8D' };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={carregar} />}
        ListHeaderComponent={
          <ThemedText style={[styles.titulo, { fontSize: width * 0.055 }]}>
            Minhas Solicitações
          </ThemedText>
        }
        renderItem={({ item }) => {
          const cfg = statusCfg(item.statusSolicitacao);
          return (
            <ThemedView style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={[styles.anuncioNome, { fontSize: width * 0.042 }]} numberOfLines={2}>
                  {item.anuncio?.nome ?? '—'}
                </ThemedText>
                <View style={[styles.statusBadge, { backgroundColor: cfg.color }]}>
                  <ThemedText style={styles.statusText}>{cfg.label}</ThemedText>
                </View>
              </View>

              <ThemedText style={styles.categoria}>
                {item.anuncio?.categoria?.nome ?? '—'}
              </ThemedText>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Doador</ThemedText>
                <ThemedText style={styles.infoValue}>{item.anuncio?.doador?.nome ?? '—'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Data</ThemedText>
                <ThemedText style={styles.infoValue}>{item.dataCadastro}</ThemedText>
              </View>
              {item.telefone ? (
                <View style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Contato</ThemedText>
                  <ThemedText style={styles.infoValue}>{item.telefone}</ThemedText>
                </View>
              ) : null}
            </ThemedView>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.vazio}>
              <ThemedText style={{ fontSize: 48 }}>📋</ThemedText>
              <ThemedText style={styles.vazioText}>
                Você ainda não enviou nenhuma solicitação.
              </ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lista: { padding: 16, paddingBottom: 32 },
  titulo: { fontWeight: 'bold', marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.15)',
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  anuncioNome: { fontWeight: '700', flex: 1, lineHeight: 20 },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  categoria: { fontSize: 12, opacity: 0.5 },
  divider: { height: 1, backgroundColor: 'rgba(92,51,23,0.1)', marginVertical: 4 },
  infoRow: { flexDirection: 'row', gap: 6 },
  infoLabel: { fontSize: 12, fontWeight: '700', opacity: 0.6, width: 60 },
  infoValue: { fontSize: 12, opacity: 0.8, flex: 1 },
  vazio: { alignItems: 'center', paddingTop: 80, gap: 12 },
  vazioText: { opacity: 0.5, fontSize: 14, textAlign: 'center' },
});
