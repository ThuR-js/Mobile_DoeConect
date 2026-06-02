import { api } from '@/services/api';
import type { Solicitacao, SolicitacaoCreatePayload } from '@/types';

export const solicitacaoService = {
  // POST /api/v1/solicitacao
  criar: (payload: SolicitacaoCreatePayload) =>
    api.post<Solicitacao>('/solicitacao', payload).then((r) => r.data),

  // GET /api/v1/solicitacao/usuario/:usuarioId
  listarPorUsuario: (usuarioId: number) =>
    api.get<Solicitacao[]>(`/solicitacao/usuario/${usuarioId}`).then((r) => r.data),
};
