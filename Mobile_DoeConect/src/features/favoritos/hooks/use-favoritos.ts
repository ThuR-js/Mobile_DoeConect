import { useState, useEffect, useCallback } from 'react';
import { favoritoService } from '@/features/favoritos/services/favorito-service';
import type { Favorito, ApiError } from '@/types';

export function useFavoritos(usuarioId: number | null) {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!usuarioId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await favoritoService.listar(usuarioId);
      setFavoritos(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message ?? 'Erro ao carregar favoritos.');
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const isFavoritado = useCallback(
    (anuncioId: number) => favoritos.some((f) => f.anuncioId === anuncioId),
    [favoritos]
  );

  const toggleFavorito = useCallback(
    async (anuncioId: number) => {
      if (!usuarioId) return;
      const jaSalvo = isFavoritado(anuncioId);

      // Atualização otimista
      setFavoritos((prev) =>
        jaSalvo
          ? prev.filter((f) => f.anuncioId !== anuncioId)
          : [...prev, { anuncioId, usuarioId } as Favorito]
      );

      try {
        if (jaSalvo) {
          await favoritoService.desfavoritar(anuncioId, usuarioId);
        } else {
          await favoritoService.favoritar(anuncioId, usuarioId);
        }
      } catch (err) {
        // Reverte em caso de erro
        carregar();
        const apiError = err as ApiError;
        setError(apiError.message ?? 'Erro ao atualizar favorito.');
      }
    },
    [usuarioId, isFavoritado, carregar]
  );

  return { favoritos, isLoading, error, isFavoritado, toggleFavorito, refetch: carregar };
}
