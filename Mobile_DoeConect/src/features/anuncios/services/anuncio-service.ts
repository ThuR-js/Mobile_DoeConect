import { api } from '@/services/api';
import type { Anuncio, AnuncioCreatePayload, AnuncioUpdatePayload } from '@/types';

export const anuncioService = {
  // GET /api/v1/anuncio
  listar: () => api.get<Anuncio[]>('/anuncio').then((r) => r.data),

  // GET /api/v1/anuncio/admin
  listarAdmin: () => api.get<Anuncio[]>('/anuncio/admin').then((r) => r.data),

  // GET /api/v1/anuncio/:id
  buscarPorId: (id: number) =>
    api.get<Anuncio>(`/anuncio/${id}`).then((r) => r.data),

  // GET /api/v1/anuncio/categoria/:categoriaId
  listarPorCategoria: (categoriaId: number) =>
    api.get<Anuncio[]>(`/anuncio/categoria/${categoriaId}`).then((r) => r.data),

  // GET /api/v1/anuncio/doador/:doadorId
  listarPorDoador: (doadorId: number) =>
    api.get<Anuncio[]>(`/anuncio/doador/${doadorId}`).then((r) => r.data),

  // POST /api/v1/anuncio
  criar: (payload: AnuncioCreatePayload) =>
    api.post<Anuncio>('/anuncio', payload).then((r) => r.data),

  // PUT /api/v1/anuncio/:id
  atualizar: (id: number, payload: AnuncioUpdatePayload) =>
    api.put<Anuncio>(`/anuncio/${id}`, payload).then((r) => r.data),

  // PUT /api/v1/anuncio/:id/inativar?doadorId=
  inativar: (id: number, doadorId: number) =>
    api.put<void>(`/anuncio/${id}/inativar`, {}, { params: { doadorId } }).then((r) => r.data),

  // DELETE /api/v1/anuncio/:id
  deletar: (id: number) =>
    api.delete<void>(`/anuncio/${id}`).then((r) => r.data),
};
