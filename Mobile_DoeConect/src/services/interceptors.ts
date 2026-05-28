import type { AxiosInstance, AxiosError } from 'axios';
import { storage } from '@/services/storage';
import type { ApiError } from '@/types';

const ERROR_MESSAGES: Record<number, string> = {
  400: 'Requisição inválida. Verifique os dados informados.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para realizar esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Conflito: este registro já existe.',
  422: 'Dados inválidos. Verifique as informações.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.',
};

export function setupInterceptors(instance: AxiosInstance) {
  // ── Request: injeta token em toda requisição ──────────────────────────────
  instance.interceptors.request.use(async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ── Response: trata erros globalmente ────────────────────────────────────
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status ?? 0;
      const serverMessage =
        (error.response?.data as { message?: string })?.message ?? null;

      const apiError: ApiError = {
        status,
        message:
          serverMessage ??
          ERROR_MESSAGES[status] ??
          'Ocorreu um erro inesperado. Tente novamente.',
      };

      return Promise.reject(apiError);
    }
  );
}
