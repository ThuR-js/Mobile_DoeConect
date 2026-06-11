import { api } from '@/services/api';
import { storage } from '@/services/storage';
import type { LoginPayload, LoginResponse, Usuario } from '@/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<Usuario>('/usuario/login', payload);
    if (data.nivelAcesso === 'DOADOR') {
      throw { message: 'Acesso não permitido. Use o site de doadores.', status: 403 };
    }
    await storage.setUsuario(data);
    return { usuario: data };
  },

  logout: async (): Promise<void> => {
    await storage.clearAll();
  },

  restoreSession: async (): Promise<LoginResponse | null> => {
    const usuario = await storage.getUsuario();
    if (!usuario) return null;
    return { usuario };
  },
};
