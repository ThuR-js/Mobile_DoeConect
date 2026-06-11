import { useState, useEffect, useCallback } from 'react';
import { anuncioService } from '@/features/anuncios/services/anuncio-service';
import type { Anuncio, ApiError } from '@/types';

type State = {
  anuncios: Anuncio[];
  isLoading: boolean;
  error: string | null;
};

export function useAnuncios(categoriaId?: number | null) {
  const [state, setState] = useState<State>({
    anuncios: [],
    isLoading: true,
    error: null,
  });

  const carregar = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = categoriaId
        ? await anuncioService.listarPorCategoria(categoriaId)
        : await anuncioService.listar();
      setState({ anuncios: data, isLoading: false, error: null });
    } catch (err) {
      const apiError = err as ApiError;
      setState((s) => ({
        ...s,
        isLoading: false,
        error: apiError.message ?? 'Erro ao carregar anúncios.',
      }));
    }
  }, [categoriaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { ...state, refetch: carregar };
}
