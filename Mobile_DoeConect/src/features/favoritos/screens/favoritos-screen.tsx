import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useFavoritosContext } from '@/context/favoritos-context';
import type { Anuncio } from '@/types';

const { width: SW } = Dimensions.get('window');
const CARD_W = SW * 0.58;

const PALETTE = {
  light: {
    bg: '#FAF8F6', surface: '#FFFFFF', surfaceAlt: '#F6F2EE',
    primary: '#8B4A1E', textMain: '#2B2B2B', textSub: '#6E6E6E',
    textMuted: '#A08070', cardBg: '#FFFFFF', cardImg: '#F0E6D8',
  },
  dark: {
    bg: '#121212', surface: '#1E1E1E', surfaceAlt: '#2A2A2A',
    primary: '#C47A45', textMain: '#F0EDE9', textSub: '#B0A898',
    textMuted: '#7A7068', cardBg: '#1E1E1E', cardImg: '#2A2A2A',
  },
};

function tempoRelativo(data: string) {
  const diff = Date.now() - new Date(data).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Agora mesmo';
  if (h < 24) return `Há ${h}h`;
  return `Há ${Math.floor(h / 24)}d`;
}

export default function FavoritosScreen() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const { favoritosAnuncios, toggleFavorito } = useFavoritosContext();
  const router = useRouter();
  const p = PALETTE[theme];

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <View style={[s.header, { backgroundColor: p.bg }]}>
        <Text style={[s.titulo, { color: p.textMain }]}>Meus Favoritos</Text>
        <Text style={[s.sub, { color: p.textMuted }]}>{favoritosAnuncios.length} item(s)</Text>
      </View>

      <ScrollView contentContainerStyle={s.lista} showsVerticalScrollIndicator={false}>
        {favoritosAnuncios.length === 0 ? (
          <View style={s.vazio}>
            <Ionicons name="heart-outline" size={52} color={p.textMuted} />
            <Text style={[s.vazioText, { color: p.textMuted }]}>
              Você ainda não possui itens favoritos.
            </Text>
          </View>
        ) : (
          <View style={s.grid}>
            {favoritosAnuncios.map((anuncio: Anuncio) => (
              <TouchableOpacity
                key={String(anuncio.id)}
                style={[card.wrap, { backgroundColor: p.cardBg }]}
                onPress={() => router.push(`/(app)/anuncios/${anuncio.id}`)}
                activeOpacity={0.88}>
                {anuncio.foto ? (
                  <Image source={{ uri: anuncio.foto }} style={card.img} resizeMode="cover" />
                ) : (
                  <View style={[card.semImg, { backgroundColor: p.cardImg }]}>
                    <Ionicons name="cube-outline" size={36} color={p.textMuted} />
                  </View>
                )}
                <TouchableOpacity
                  style={card.favBtn}
                  onPress={() => usuario && toggleFavorito(anuncio, usuario.id)}
                  hitSlop={8}>
                  <Ionicons name="heart" size={18} color="#E05C5C" />
                </TouchableOpacity>
                <View style={card.info}>
                  <Text style={[card.nome, { color: p.textMain }]} numberOfLines={2}>
                    {anuncio.nome}
                  </Text>
                  <Text style={[card.sub, { color: p.primary }]}>
                    {anuncio.categoria.nome} • {anuncio.tamanho}
                  </Text>
                  {anuncio.doador?.cidade ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Ionicons name="location-outline" size={11} color={p.textMuted} />
                      <Text style={[card.meta, { color: p.textMuted }]}>
                        {anuncio.doador.cidade}{anuncio.doador.estado ? `, ${anuncio.doador.estado}` : ''}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={[card.meta, { color: p.textMuted }]}>
                    {tempoRelativo(anuncio.dataCadastro)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const card = StyleSheet.create({
  wrap: {
    width: CARD_W,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  img: { width: '100%', height: 180 },
  semImg: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center' },
  favBtn: { position: 'absolute', top: 10, right: 10 },
  info: { padding: 12, gap: 3 },
  nome: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  sub: { fontSize: 12 },
  meta: { fontSize: 11 },
});

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  titulo: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 13 },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' },
  vazio: { flex: 1, alignItems: 'center', paddingTop: 80, gap: 16 },
  vazioText: { fontSize: 15, textAlign: 'center', maxWidth: 260 },
});
