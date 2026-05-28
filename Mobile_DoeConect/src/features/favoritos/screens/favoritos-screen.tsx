import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavoritos } from '@/features/favoritos/hooks/use-favoritos';
import { AnuncioCard } from '@/features/anuncios/components/anuncio-card';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ErrorMessage } from '@/components/feedback/error-message';
import { ThemedView } from '@/components/ui/themed-view';
import { ThemedText } from '@/components/ui/themed-text';
import { useAuth } from '@/context/auth-context';
import { useResponsive } from '@/hooks/use-responsive';

export default function FavoritosScreen() {
  const { usuario } = useAuth();
  const { favoritos, isLoading, error, toggleFavorito, refetch } = useFavoritos(usuario?.id ?? null);
  const router = useRouter();
  const { width } = useResponsive();

  if (isLoading) return <LoadingOverlay mensagem="Carregando favoritos..." />;
  if (error) return <ErrorMessage mensagem={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={[styles.titulo, { fontSize: width * 0.055 }]}>Meus favoritos</ThemedText>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => String(item.anuncioId)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AnuncioCard
            anuncio={item.anuncio}
            favoritado
            onPress={() => router.push(`/(app)/anuncios/${item.anuncioId}`)}
            onFavoritar={() => toggleFavorito(item.anuncioId)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <ThemedText style={{ fontSize: 48 }}>🤍</ThemedText>
            <ThemedText style={styles.vazioText}>Você ainda não favoritou nenhum anúncio.</ThemedText>
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
  row: { justifyContent: 'space-between' },
  vazio: { flex: 1, alignItems: 'center', paddingTop: 60, gap: 12 },
  vazioText: { opacity: 0.5, fontSize: 14, textAlign: 'center' },
});
