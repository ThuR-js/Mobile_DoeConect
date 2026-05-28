import { api } from '@/services/api';
import type {
  Usuario,
  UsuarioPerfil,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
  UsuarioSenhaPayload,
} from '@/types';

export const usuarioService = {
  // GET /api/v1/usuario
  listar: () => api.get<Usuario[]>('/usuario').then((r) => r.data),

  // GET /api/v1/usuario/:id
  buscarPorId: (id: number) =>
    api.get<Usuario>(`/usuario/${id}`).then((r) => r.data),

  // GET /api/v1/usuario/:id/perfil
  buscarPerfil: (id: number) =>
    api.get<UsuarioPerfil>(`/usuario/${id}/perfil`).then((r) => r.data),

  // POST /api/v1/usuario
  criar: (payload: UsuarioCreatePayload) =>
    api.post<Usuario>('/usuario', payload).then((r) => r.data),

  // PUT /api/v1/usuario/:id
  atualizar: (id: number, payload: UsuarioUpdatePayload) =>
    api.put<Usuario>(`/usuario/${id}`, payload).then((r) => r.data),

  // PATCH /api/v1/usuario/:id/senha
  alterarSenha: (id: number, payload: UsuarioSenhaPayload) =>
    api.patch<void>(`/usuario/${id}/senha`, payload).then((r) => r.data),

  // PUT /api/v1/usuario/:id/inativar
  inativar: (id: number) =>
    api.put<void>(`/usuario/${id}/inativar`, {}).then((r) => r.data),

  // PUT /api/v1/usuario/:id/reativar
  reativar: (id: number) =>
    api.put<void>(`/usuario/${id}/reativar`, {}).then((r) => r.data),

  // DELETE /api/v1/usuario/:id
  deletar: (id: number) =>
    api.delete<void>(`/usuario/${id}`).then((r) => r.data),
};
