import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useAnuncios } from '@/features/anuncios/hooks/use-anuncios';
import { useFavoritosContext } from '@/context/favoritos-context';
import { LoadingOverlay } from '@/components/feedback/loading-overlay';
import { ErrorMessage } from '@/components/feedback/error-message';
import { categoriaService } from '@/features/anuncios/services/categoria-service';
import type { Anuncio, Categoria } from '@/types';

const { width: SW } = Dimensions.get('window');
const CARD_W = SW * 0.58;

const ICONE_CATEGORIA: Record<string, keyof typeof Ionicons.glyphMap> = {
  camisetas:  'shirt-outline',
  camiseta:   'shirt-outline',
  tênis:      'footsteps-outline',
  tenis:      'footsteps-outline',
  calças:     'cut-outline',
  calcas:     'cut-outline',
  blusas:     'bag-handle-outline',
  blusa:      'bag-handle-outline',
  moletons:   'bag-handle-outline',
  shorts:     'sunny-outline',
  short:      'sunny-outline',
};

function iconeParaCategoria(nome: string): keyof typeof Ionicons.glyphMap {
  const key = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const [k, icon] of Object.entries(ICONE_CATEGORIA)) {
    if (key.includes(k)) return icon;
  }
  return 'ellipsis-horizontal-outline';
}

// Paleta por tema
const PALETTE = {
  light: {
    bg:           '#FAF8F6',
    surface:      '#FFFFFF',
    surfaceAlt:   '#F6F2EE',
    border:       '#E0D4C8',
    primary:      '#8B4A1E',
    primaryDark:  '#6B3514',
    textMain:     '#2B2B2B',
    textSub:      '#6E6E6E',
    textMuted:    '#A08070',
    inputText:    '#2B2B2B',
    placeholder:  '#B08060',
    cardBg:       '#FFFFFF',
    cardImg:      '#F0E6D8',
    sheetBg:      '#FFFFFF',
    handle:       '#E0D4C8',
  },
  dark: {
    bg:           '#121212',
    surface:      '#1E1E1E',
    surfaceAlt:   '#2A2A2A',
    border:       '#3A3A3A',
    primary:      '#C47A45',
    primaryDark:  '#A85E2E',
    textMain:     '#F0EDE9',
    textSub:      '#B0A898',
    textMuted:    '#7A7068',
    inputText:    '#F0EDE9',
    placeholder:  '#7A6A5A',
    cardBg:       '#1E1E1E',
    cardImg:      '#2A2A2A',
    sheetBg:      '#1E1E1E',
    handle:       '#3A3A3A',
  },
};

function tempoRelativo(data: string) {
  const diff = Date.now() - new Date(data).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Agora mesmo';
  if (h < 24) return `Há ${h}h`;
  return `Há ${Math.floor(h / 24)}d`;
}

function CardAnuncio({
  anuncio, favoritado, onPress, onFavoritar, p,
}: {
  anuncio: Anuncio;
  favoritado: boolean;
  onPress: () => void;
  onFavoritar?: () => void;
  p: typeof PALETTE.light;
}) {
  return (
    <TouchableOpacity
      style={[card.wrap, { backgroundColor: p.cardBg }]}
      onPress={onPress}
      activeOpacity={0.88}>
      {anuncio.foto ? (
        <Image source={{ uri: anuncio.foto }} style={card.img} resizeMode="cover" />
      ) : (
        <View style={[card.semImg, { backgroundColor: p.cardImg }]}>
          <Text style={{ fontSize: 36 }}>📦</Text>
        </View>
      )}
      {onFavoritar && (
        <TouchableOpacity style={card.favBtn} onPress={onFavoritar} hitSlop={8}>
          <Text style={{ fontSize: 18 }}>{favoritado ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
      <View style={card.info}>
        <Text style={[card.nome, { color: p.textMain }]} numberOfLines={2}>
          {anuncio.nome}
        </Text>
        <Text style={[card.sub, { color: p.primary }]}>
          {anuncio.categoria.nome} • {anuncio.tamanho}
        </Text>
        {anuncio.doador?.cidade ? (
          <Text style={[card.meta, { color: p.textMuted }]}>
            📍 {anuncio.doador.cidade}{anuncio.doador.estado ? `, ${anuncio.doador.estado}` : ''}
          </Text>
        ) : null}
        <Text style={[card.meta, { color: p.textMuted }]}>
          {tempoRelativo(anuncio.dataCadastro)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { usuario } = useAuth();
  const { theme } = useTheme();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null);
  const [filtroModal, setFiltroModal] = useState<'tamanho' | 'regiao' | null>(null);
  const [tamanhoAtivo, setTamanhoAtivo] = useState<string | null>(null);
  const [regiaoAtiva, setRegiaoAtiva] = useState<string | null>(null);
  const [subTamanho, setSubTamanho] = useState<'roupas' | 'tenis'>('roupas');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const router = useRouter();
  const { anuncios, isLoading, error, refetch } = useAnuncios(categoriaAtiva);
  const { isFavoritado, toggleFavorito } = useFavoritosContext();

  useEffect(() => {
    categoriaService.listar().then(setCategorias).catch(() => {});
  }, []);

  const categoriasVisiveis: Categoria[] = categorias.length > 0
    ? categorias
    : Array.from(new Map(anuncios.map((a) => [a.categoria.id, a.categoria])).values());

  const TAMANHOS_ROUPAS = ['PP', 'P', 'M', 'G', 'GG', 'XG'];
  const TAMANHOS_TENIS = Array.from({ length: 15 }, (_, i) => String(34 + i));

  const tamanhosDosAnuncios = Array.from(new Set(anuncios.map((a) => a.tamanho).filter(Boolean)));
  const tamanhosRoupasExtras = tamanhosDosAnuncios.filter(
    (t) => !TAMANHOS_ROUPAS.includes(t.toUpperCase()) && isNaN(Number(t))
  );
  const tamanhosRoupas = [...TAMANHOS_ROUPAS, ...tamanhosRoupasExtras];
  const tamanhosTenisExtras = tamanhosDosAnuncios.filter(
    (t) => !isNaN(Number(t)) && !TAMANHOS_TENIS.includes(t)
  );
  const tamanhosTenis = [...TAMANHOS_TENIS, ...tamanhosTenisExtras].sort((a, b) => Number(a) - Number(b));

  const regioes = Array.from(new Set(anuncios.map((a) => a.regiao).filter(Boolean))) as string[];

  const p = PALETTE[theme];
  const primeiroNome = usuario?.nome?.trim().split(' ')[0] ?? '';

  const filtrados = anuncios.filter((a) => {
    const matchBusca = busca.trim()
      ? a.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.categoria.nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.doador?.cidade?.toLowerCase().includes(busca.toLowerCase()) ||
        a.doador?.estado?.toLowerCase().includes(busca.toLowerCase())
      : true;
    const matchTamanho = tamanhoAtivo ? a.tamanho === tamanhoAtivo : true;
    const matchRegiao = regiaoAtiva ? a.regiao === regiaoAtiva : true;
    return matchBusca && matchTamanho && matchRegiao;
  });

  if (isLoading) return <LoadingOverlay mensagem="Carregando doações..." />;
  if (error) return <ErrorMessage mensagem={error} onRetry={refetch} />;

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>

      {/* ── HEADER ── */}
      <View style={[s.header, { backgroundColor: p.bg }]}>
        <Text style={[s.logo, { color: p.primary }]}>DoeConect+</Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/perfil')}
          style={[s.avatarBtn, { backgroundColor: p.surfaceAlt }]}>
          {usuario?.foto ? (
            <Image source={{ uri: usuario.foto }} style={s.avatarImg} />
          ) : (
            <Ionicons name="person-outline" size={20} color={p.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={p.primary} />}
        contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── BANNER ── */}
        <View style={[s.banner, { backgroundColor: p.surfaceAlt }]}>
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={[s.bannerOla, { color: p.primary }]}>Olá, {primeiroNome}! 👋</Text>
            <Text style={[s.bannerSub, { color: p.textSub }]}>
              Encontre doações que podem fazer a diferença na sua vida.
            </Text>
          </View>
          <Text style={{ fontSize: 52 }}>🎁</Text>
        </View>

        {/* ── BUSCA ── */}
        <View style={[s.searchWrap, { backgroundColor: p.surface, borderColor: p.border }]}>
          <Text style={[s.searchIcon, { color: p.textMuted }]}>🔍</Text>
          <TextInput
            style={[s.searchInput, { color: p.inputText }]}
            placeholder="Buscar doações..."
            placeholderTextColor={p.placeholder}
            value={busca}
            onChangeText={setBusca}
            autoComplete="off"
            textContentType="none"
            autoCorrect={false}
          />
        </View>

        {/* ── CATEGORIAS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.cats}>
          {/* Todos */}
          <TouchableOpacity style={s.catItem} onPress={() => setCategoriaAtiva(null)}>
            <View style={[s.catIcon, { backgroundColor: categoriaAtiva === null ? p.primary : p.surfaceAlt }]}>
              <Ionicons name="apps-outline" size={22} color={categoriaAtiva === null ? '#FFFFFF' : p.primary} />
            </View>
            <Text style={[s.catLabel, { color: categoriaAtiva === null ? p.primary : p.textSub, fontWeight: categoriaAtiva === null ? '700' : '500' }]}>
              Todos
            </Text>
          </TouchableOpacity>
          {categoriasVisiveis.map((cat) => (
            <TouchableOpacity key={cat.id} style={s.catItem} onPress={() => setCategoriaAtiva(cat.id)}>
              <View style={[s.catIcon, { backgroundColor: categoriaAtiva === cat.id ? p.primary : p.surfaceAlt }]}>
                <Ionicons name={iconeParaCategoria(cat.nome)} size={22} color={categoriaAtiva === cat.id ? '#FFFFFF' : p.primary} />
              </View>
              <Text style={[s.catLabel, { color: categoriaAtiva === cat.id ? p.primary : p.textSub, fontWeight: categoriaAtiva === cat.id ? '700' : '500' }]}>
                {cat.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── DOAÇÕES EM DESTAQUE ── */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: p.textMain }]}>Doações em destaque</Text>
          <TouchableOpacity>
            <Text style={[s.verTodas, { color: p.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.carouselWrap}>
          {filtrados.length === 0 ? (
            <View style={[s.vazio]}>
              <Text style={{ fontSize: 40 }}>📦</Text>
              <Text style={[s.vazioText, { color: p.textMuted }]}>Nenhuma doação encontrada.</Text>
            </View>
          ) : (
            filtrados.map((item) => (
              <CardAnuncio
                key={String(item.id)}
                anuncio={item}
                favoritado={isFavoritado(item.id)}
                onPress={() => router.push(`/(app)/anuncios/${item.id}`)}
                onFavoritar={usuario ? () => toggleFavorito(item, usuario.id) : undefined}
                p={p}
              />
            ))
          )}
        </ScrollView>

        {/* ── FILTROS CHIPS ── */}
        <View style={s.chipsRow}>
          <TouchableOpacity
            style={[s.chip, { backgroundColor: tamanhoAtivo ? p.primary : p.surfaceAlt, borderColor: p.border }]}
            onPress={() => setFiltroModal('tamanho')}>
            <Text style={[s.chipText, { color: tamanhoAtivo ? '#fff' : p.primary }]}>
              {tamanhoAtivo ? `Tamanho: ${tamanhoAtivo}` : 'Tamanho'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.chip, { backgroundColor: regiaoAtiva ? p.primary : p.surfaceAlt, borderColor: p.border }]}
            onPress={() => setFiltroModal('regiao')}>
            <Text style={[s.chipText, { color: regiaoAtiva ? '#fff' : p.primary }]}>
              {regiaoAtiva ? `Região: ${regiaoAtiva}` : 'Região'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── MODAL FILTRO ── */}
      <Modal
        visible={!!filtroModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFiltroModal(null)}>
        <TouchableOpacity style={s.modalOverlay} onPress={() => setFiltroModal(null)} />
        <View style={[s.bottomSheet, { backgroundColor: p.sheetBg }]}>
          <View style={[s.sheetHandle, { backgroundColor: p.handle }]} />
          <Text style={[s.sheetTitle, { color: p.textMain }]}>
            {filtroModal === 'tamanho' ? 'Tamanho' : 'Região'}
          </Text>

          {filtroModal === 'tamanho' && (
            <View style={s.subTabRow}>
              {(['roupas', 'tenis'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[s.subTab, { backgroundColor: subTamanho === tab ? p.primary : p.surfaceAlt, borderColor: p.border }]}
                  onPress={() => setSubTamanho(tab)}>
                  <Text style={[s.subTabText, { color: subTamanho === tab ? '#fff' : p.primary }]}>
                    {tab === 'roupas' ? 'Roupas' : 'Tênis'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[s.sheetOption, { borderColor: p.border }]}
              onPress={() => {
                filtroModal === 'tamanho' ? setTamanhoAtivo(null) : setRegiaoAtiva(null);
                setFiltroModal(null);
              }}>
              <Text style={[s.sheetOptionText, { color: p.primary }]}>Todos</Text>
            </TouchableOpacity>

            {filtroModal === 'tamanho' ? (
              <View style={s.tamanhoGrid}>
                {(subTamanho === 'roupas' ? tamanhosRoupas : tamanhosTenis).map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      s.tamanhoItem,
                      { borderColor: p.border, backgroundColor: tamanhoAtivo === item ? p.primary : p.surfaceAlt },
                    ]}
                    onPress={() => { setTamanhoAtivo(item); setFiltroModal(null); }}>
                    <Text style={[s.tamanhoItemText, { color: tamanhoAtivo === item ? '#fff' : p.textMain }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              regioes.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    s.sheetOption,
                    { borderColor: p.border },
                    regiaoAtiva === item && { backgroundColor: p.primary },
                  ]}
                  onPress={() => { setRegiaoAtiva(item); setFiltroModal(null); }}>
                  <Text style={[s.sheetOptionText, { color: regiaoAtiva === item ? '#fff' : p.textMain }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

/* ─── Card ─── */
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
  sub:  { fontSize: 12 },
  meta: { fontSize: 11 },
});

/* ─── Screen ─── */
const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  logo: { fontFamily: 'serif', fontSize: 22, fontWeight: '700', letterSpacing: 0.5 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: 40, height: 40, borderRadius: 20 },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  bannerOla: { fontSize: 18, fontWeight: '700' },
  bannerSub: { fontSize: 13, lineHeight: 18 },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 999,
    height: 48,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15 },

  cats: { paddingHorizontal: 16, gap: 12, marginBottom: 24 },
  catItem: { alignItems: 'center', gap: 6 },
  catIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  catLabel: { fontSize: 11 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  verTodas: { fontSize: 13, fontWeight: '600' },

  carouselWrap: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },
  vazio: { alignItems: 'center', paddingTop: 20, gap: 8, width: SW - 32 },
  vazioText: { fontSize: 14 },

  chipsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginTop: 20 },
  chip: { flex: 1, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, borderWidth: 1, alignItems: 'center' },
  chipText: { fontSize: 13, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  bottomSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  sheetTitle: { fontSize: 18, fontWeight: '700' },
  sheetOption: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  sheetOptionText: { fontSize: 15, fontWeight: '500' },
  subTabRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  subTab: { flex: 1, paddingVertical: 8, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  subTabText: { fontSize: 13, fontWeight: '600' },
  tamanhoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  tamanhoItem: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, minWidth: 52, alignItems: 'center' },
  tamanhoItemText: { fontSize: 14, fontWeight: '600' },
  sheetBtn: { marginTop: 8, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  sheetBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});
