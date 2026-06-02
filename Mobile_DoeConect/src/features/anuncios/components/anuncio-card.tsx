import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useResponsive } from '@/hooks/use-responsive';
import type { Anuncio } from '@/types';

type Props = {
  anuncio: Anuncio;
  favoritado?: boolean;
  onPress?: () => void;
  onFavoritar?: () => void;
};

export function AnuncioCard({ anuncio, favoritado = false, onPress, onFavoritar }: Props) {
  const { width } = useResponsive();
  const cardWidth = (width - 48) / 2;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <ThemedView style={[styles.card, { width: cardWidth }]}>
        {anuncio.foto ? (
          <Image source={{ uri: anuncio.foto }} style={styles.imagem} resizeMode="cover" />
        ) : (
          <View style={styles.semImagem}>
            <ThemedText style={styles.semImagemText}>📦</ThemedText>
          </View>
        )}
        <View style={styles.info}>
          <ThemedText style={styles.titulo} numberOfLines={2}>
            {anuncio.nome}
          </ThemedText>
          <ThemedText style={styles.categoria}>{anuncio.categoria.nome}</ThemedText>
          <ThemedText style={styles.doador} numberOfLines={1}>
            {anuncio.doador.nome}
          </ThemedText>
        </View>
        {onFavoritar && (
          <TouchableOpacity style={styles.favBtn} onPress={onFavoritar} hitSlop={8}>
            <ThemedText style={styles.favIcon}>{favoritado ? '❤️' : '🤍'}</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  imagem: { width: '100%', height: 130 },
  semImagem: {
    width: '100%',
    height: 130,
    backgroundColor: '#f0e6d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  semImagemText: { fontSize: 36 },
  info: { padding: 10, gap: 3 },
  titulo: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  categoria: { fontSize: 11, opacity: 0.6 },
  doador: { fontSize: 11, opacity: 0.5 },
  favBtn: { position: 'absolute', top: 8, right: 8 },
  favIcon: { fontSize: 18 },
});
