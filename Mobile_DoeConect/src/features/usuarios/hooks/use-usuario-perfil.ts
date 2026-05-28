import { useState, useEffect } from 'react';
import { usuarioService } from '@/features/usuarios/services/usuario-service';
import type { UsuarioPerfil, ApiError } from '@/types';

export function useUsuarioPerfil(id: number | null) {
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    usuarioService
      .buscarPerfil(id)
      .then(setPerfil)
      .catch((err: ApiError) => setError(err.message ?? 'Erro ao carregar perfil.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { perfil, isLoading, error };
}
