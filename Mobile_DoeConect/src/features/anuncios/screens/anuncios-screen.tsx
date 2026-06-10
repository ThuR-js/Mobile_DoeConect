import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';
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

export default function AnunciosScreen() {
  const { usuario } = useAuth();
  const { anuncios, isLoading, error, refetch } = useAnuncios();
  const { isFavoritado, toggleFavorito } = useFavoritos(usuario?.id ?? null);
  const router = useRouter();
  const { width } = useResponsive();
  const effectiveWidth = Math.min(width, 390);

  if (isLoading) return <LoadingOverlay mensagem="Carregando anúncios..." />;
  if (error) return <ErrorMessage mensagem={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.titulo, { fontSize: effectiveWidth * 0.055 }]}>
        Doações disponíveis
      </ThemedText>
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
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'center', gap: 16 },
  vazio: { flex: 1, alignItems: 'center', paddingTop: 60 },
  vazioText: { opacity: 0.5, fontSize: 14 },
});
