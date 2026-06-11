import { api } from '@/services/api';
import type { Anuncio } from '@/types';

export const favoritoService = {
  // GET /api/v1/anuncio/favoritos/:usuarioId  → retorna List<Anuncio>
  listar: (usuarioId: number) =>
    api.get<Anuncio[]>(`/anuncio/favoritos/${usuarioId}`).then((r) => r.data),

  // POST /api/v1/anuncio/:id/favoritar?usuarioId=
  favoritar: (anuncioId: number, usuarioId: number) =>
    api.post<void>(`/anuncio/${anuncioId}/favoritar`, {}, { params: { usuarioId } }).then((r) => r.data),

  // DELETE /api/v1/anuncio/:id/favoritar?usuarioId=
  desfavoritar: (anuncioId: number, usuarioId: number) =>
    api.delete<void>(`/anuncio/${anuncioId}/favoritar`, { params: { usuarioId } }).then((r) => r.data),
};
