import { api } from '@/services/api';
import type { Doador, DoadorCreatePayload, DoadorUpdatePayload } from '@/types';

export const doadorService = {
  // GET /api/v1/doador
  listar: () => api.get<Doador[]>('/doador').then((r) => r.data),

  // GET /api/v1/doador/:id
  buscarPorId: (id: number) =>
    api.get<Doador>(`/doador/${id}`).then((r) => r.data),

  // GET /api/v1/doador/usuario/:usuarioId
  buscarPorUsuario: (usuarioId: number) =>
    api.get<Doador>(`/doador/usuario/${usuarioId}`).then((r) => r.data),

  // POST /api/v1/doador
  criar: (payload: DoadorCreatePayload) =>
    api.post<Doador>('/doador', payload).then((r) => r.data),

  // PUT /api/v1/doador/:id
  atualizar: (id: number, payload: DoadorUpdatePayload) =>
    api.put<Doador>(`/doador/${id}`, payload).then((r) => r.data),

  // DELETE /api/v1/doador/:id
  deletar: (id: number) =>
    api.delete<void>(`/doador/${id}`).then((r) => r.data),
};
