import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { anuncioService } from '@/features/anuncios/services/anuncio-service';
import { useFavoritos } from '@/features/favoritos/hooks/use-favoritos';
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

  const { usuario } = useAuth();
  const { isFavoritado, toggleFavorito } = useFavoritos(usuario?.id ?? null);
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

  if (isLoading) return <LoadingOverlay />;
  if (error || !anuncio) return <ErrorMessage mensagem={error ?? 'Anúncio não encontrado.'} onRetry={() => router.back()} />;

  const favoritado = isFavoritado(anuncio.id);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {anuncio.imagemUrl ? (
        <Image
          source={{ uri: anuncio.imagemUrl }}
          style={{ width, height: height * 0.35 }}
          resizeMode="cover"
        />
      ) : (
        <ThemedView style={[styles.semImagem, { height: height * 0.25 }]}>
          <ThemedText style={{ fontSize: 64 }}>📦</ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={[styles.titulo, { fontSize: width * 0.055 }]} numberOfLines={3}>
            {anuncio.titulo}
          </ThemedText>
          {usuario && (
            <TouchableOpacity onPress={() => toggleFavorito(anuncio.id)} hitSlop={12}>
              <ThemedText style={{ fontSize: 28 }}>{favoritado ? '❤️' : '🤍'}</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <ThemedView style={styles.badge}>
          <ThemedText style={styles.badgeText}>{anuncio.categoria.nome}</ThemedText>
        </ThemedView>

        <ThemedText style={[styles.descricao, { fontSize: width * 0.038 }]}>
          {anuncio.descricao}
        </ThemedText>

        <ThemedView style={styles.doadorBox}>
          <ThemedText style={styles.doadorLabel}>Doado por</ThemedText>
          <ThemedText style={[styles.doadorNome, { fontSize: width * 0.042 }]}>
            {anuncio.doador.nomeFantasia ?? 'Doador anônimo'}
          </ThemedText>
          {anuncio.doador.cidade && (
            <ThemedText style={styles.doadorLocal}>
              📍 {anuncio.doador.cidade}
              {anuncio.doador.estado ? `, ${anuncio.doador.estado}` : ''}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  semImagem: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0e6d8' },
  content: { padding: 20, gap: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  titulo: { flex: 1, fontWeight: 'bold', lineHeight: 28 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5C3317',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  descricao: { lineHeight: 22, opacity: 0.8 },
  doadorBox: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(92,51,23,0.2)',
  },
  doadorLabel: { fontSize: 12, opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' },
  doadorNome: { fontWeight: '700' },
  doadorLocal: { fontSize: 13, opacity: 0.6 },
});
