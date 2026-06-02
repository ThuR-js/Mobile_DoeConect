import { FlatList, StyleSheet, View, RefreshControl, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useAnuncios } from '@/features/anuncios/hooks/use-anuncios';
import { useFavoritos } from '@/features/favoritos/hooks/use-favoritos';
import { AnuncioCard } from '@/features/anuncios/components/anuncio-card';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ErrorMessage } from '@/components/feedback/error-message';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useResponsive } from '@/hooks/use-responsive';

export default function HomeScreen() {
  const { usuario } = useAuth();
  const { anuncios, isLoading, error, refetch } = useAnuncios();
  const { isFavoritado, toggleFavorito } = useFavoritos(usuario?.id ?? null);
  const router = useRouter();
  const { width } = useResponsive();

  const primeiroNome = usuario?.nome?.trim().split(' ')[0];

  if (isLoading) return <LoadingOverlay mensagem="Carregando anúncios..." />;
  if (error) return <ErrorMessage mensagem={error} onRetry={refetch} />;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={anuncios}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={
          <ThemedView style={styles.header}>
            <ThemedText style={[styles.saudacao, { fontSize: width * 0.06 }]}>
              {`Olá, ${primeiroNome ?? ''}! 👋`}
            </ThemedText>
            <ThemedText style={[styles.subtitulo, { fontSize: width * 0.038 }]}>
              Veja as doações disponíveis para você
            </ThemedText>
          </ThemedView>
        }
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
            <ThemedText style={{ fontSize: 48 }}>📦</ThemedText>
            <ThemedText style={styles.vazioText}>
              Nenhuma doação disponível no momento.
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 16, gap: 4 },
  saudacao: { fontWeight: 'bold' },
  subtitulo: { opacity: 0.6 },
  lista: { paddingHorizontal: 16, paddingBottom: 24 },
  row: { justifyContent: 'space-between' },
  vazio: { flex: 1, alignItems: 'center', paddingTop: 60, gap: 12 },
  vazioText: { opacity: 0.5, fontSize: 14, textAlign: 'center' },
});
