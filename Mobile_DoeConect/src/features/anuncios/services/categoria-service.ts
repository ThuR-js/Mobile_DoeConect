import { api } from '@/services/api';
import type { Categoria } from '@/types';

export const categoriaService = {
  listar: () => api.get<Categoria[]>('/categoria').then((r) => r.data),
};
