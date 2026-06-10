import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import type { Anuncio } from '@/types';

type Props = {
  anuncio: Anuncio;
  favoritado?: boolean;
  onPress?: () => void;
  onFavoritar?: () => void;
};

export function AnuncioCard({ anuncio, favoritado = false, onPress, onFavoritar }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.wrapper}>
      <ThemedView style={styles.card}>
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
  wrapper: {
    width: 150,
  },
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
  imagem: { width: '100%', height: 100 },
  semImagem: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0e6d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  semImagemText: { fontSize: 28 },
  info: { padding: 7, gap: 2 },
  titulo: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
  categoria: { fontSize: 10, opacity: 0.6 },
  doador: { fontSize: 10, opacity: 0.5 },
  favBtn: { position: 'absolute', top: 6, right: 6 },
  favIcon: { fontSize: 15 },
});
