import { api } from '@/services/api';
import { storage } from '@/services/storage';
import type { LoginPayload, LoginResponse } from '@/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/usuario/login', payload);
    await storage.setToken(data.token);
    await storage.setUsuario(data.usuario);
    return data;
  },

  logout: async (): Promise<void> => {
    await storage.clearAll();
  },

  restoreSession: async (): Promise<LoginResponse | null> => {
    const [token, usuario] = await Promise.all([
      storage.getToken(),
      storage.getUsuario(),
    ]);
    if (!token || !usuario) return null;
    return { token, usuario };
  },
};
