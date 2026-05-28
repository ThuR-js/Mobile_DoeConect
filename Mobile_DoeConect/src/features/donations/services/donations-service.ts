import { api } from '@/services/api';
import type { Donation } from '@/types';

export const donationsService = {
  list: () => api.get<Donation[]>('/donations'),
  getById: (id: string) => api.get<Donation>(`/donations/${id}`),
  create: (data: Omit<Donation, 'id' | 'createdAt'>) => api.post<Donation>('/donations', data),
  delete: (id: string) => api.delete<void>(`/donations/${id}`),
};
