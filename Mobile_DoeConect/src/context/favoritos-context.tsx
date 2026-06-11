import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { favoritoService } from '@/features/favoritos/services/favorito-service';
import type { Anuncio } from '@/types';

const STORAGE_KEY = '@doeconect:favoritos';

type FavoritosContextValue = {
  favoritosIds: number[];
  favoritosAnuncios: Anuncio[];
  isFavoritado: (id: number) => boolean;
  toggleFavorito: (anuncio: Anuncio, usuarioId: number) => Promise<void>;
  carregarDoBackend: (usuarioId: number) => Promise<void>;
};

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

export function FavoritosProvider({ children }: PropsWithChildren) {
  const [favoritosAnuncios, setFavoritosAnuncios] = useState<Anuncio[]>([]);
  const favoritosRef = useRef<Anuncio[]>([]);

  const setFavoritos = useCallback((anuncios: Anuncio[]) => {
    favoritosRef.current = anuncios;
    setFavoritosAnuncios(anuncios);
  }, []);

  // Restaura do AsyncStorage ao iniciar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setFavoritos(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  const persistir = useCallback((anuncios: Anuncio[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(anuncios));
  }, []);

  const carregarDoBackend = useCallback(async (usuarioId: number) => {
    try {
      const anuncios = await favoritoService.listar(usuarioId);
      setFavoritos(anuncios);
      persistir(anuncios);
    } catch {}
  }, [setFavoritos, persistir]);

  const isFavoritado = useCallback(
    (id: number) => favoritosRef.current.some((a) => a.id === id),
    []
  );

  const toggleFavorito = useCallback(async (anuncio: Anuncio, usuarioId: number) => {
    const atual = favoritosRef.current;
    const jaSalvo = atual.some((a) => a.id === anuncio.id);

    const atualizado = jaSalvo
      ? atual.filter((a) => a.id !== anuncio.id)
      : [...atual, anuncio];

    setFavoritos(atualizado);
    persistir(atualizado);

    try {
      if (jaSalvo) {
        await favoritoService.desfavoritar(anuncio.id, usuarioId);
      } else {
        await favoritoService.favoritar(anuncio.id, usuarioId);
      }
    } catch {
      // Reverte em erro
      setFavoritos(atual);
      persistir(atual);
    }
  }, [setFavoritos, persistir]);

  return (
    <FavoritosContext.Provider value={{
      favoritosIds: favoritosAnuncios.map((a) => a.id),
      favoritosAnuncios,
      isFavoritado,
      toggleFavorito,
      carregarDoBackend,
    }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritosContext() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('useFavoritosContext deve ser usado dentro de FavoritosProvider');
  return ctx;
}
