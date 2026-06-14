import { useState, useEffect } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAnuncios } from '@/features/anuncios/hooks/use-anuncios';
import { useFavoritos } from '@/features/favoritos/hooks/use-favoritos';
import { AnuncioCard } from '@/features/anuncios/components/anuncio-card';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ErrorMessage } from '@/components/feedback/error-message';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { useAuth } from '@/context/auth-context';
import { useResponsive } from '@/hooks/use-responsive';
import { categoriaService } from '@/features/anuncios/services/categoria-service';
import type { Categoria } from '@/types';

export default function AnunciosScreen() {
  const { usuario } = useAuth();
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { anuncios, isLoading, error, refetch } = useAnuncios(categoriaId);
  const { isFavoritado, toggleFavorito } = useFavoritos(usuario?.id ?? null);
  const router = useRouter();
  const { width } = useResponsive();
  const effectiveWidth = Math.min(width, 390);

  useEffect(() => {
    categoriaService.listar().then(setCategorias).catch(() => {});
  }, []);

  if (error) return <ErrorMessage mensagem={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.titulo, { fontSize: effectiveWidth * 0.055 }]}>
        Doações disponíveis
      </ThemedText>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categorias}
      >
        <TouchableOpacity
          onPress={() => setCategoriaId(null)}
          style={[styles.chip, categoriaId === null && styles.chipAtivo]}
        >
          <ThemedText style={[styles.chipText, categoriaId === null && styles.chipTextAtivo]}>
            Todos
          </ThemedText>
        </TouchableOpacity>
        {categorias.map((cat) => {
          const ativo = categoriaId === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCategoriaId(cat.id)}
              style={[styles.chip, ativo && styles.chipAtivo]}
            >
              <ThemedText style={[styles.chipText, ativo && styles.chipTextAtivo]}>
                {cat.nome}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={anuncios}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        renderItem={({ item }) => (
          <AnuncioCard
            anuncio={item}
            favoritado={isFavoritado(item.id)}
            onPress={() => router.push(`/(app)/anuncios/${item.id}`)}
            onFavoritar={usuario ? () => toggleFavorito(item.id) : undefined}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <ThemedText style={styles.vazioText}>Nenhum anúncio disponível no momento.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  titulo: { fontWeight: 'bold', paddingHorizontal: 16, marginBottom: 12 },
  categorias: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  chipAtivo: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  chipText: { fontSize: 13 },
  chipTextAtivo: { color: '#fff', fontWeight: '600' },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'flex-start', gap: 12, maxWidth: 390, alignSelf: 'center', width: '100%' },
  vazio: { flex: 1, alignItems: 'center', paddingTop: 60 },
  vazioText: { opacity: 0.5, fontSize: 14 },
});
