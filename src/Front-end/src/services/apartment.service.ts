import { api } from './http/client';
import type { ApartamentoResponse } from '@/types/api';

export const apartmentService = {
   getAll: () =>
api.get<{ data: ApartamentoResponse[] }>('/Apartamento').then(r => r.data),

  create: (data: {
    numero: string;
    bloco: string;
    andar: number;
    tipo: string;
  }) => api.post('/Apartamento', data),

  update: (id: number, data: {
    numero: string;
    bloco: string;
    andar: number;
    tipo: string;
  }) => api.put(`/Apartamento/${id}`, data),

  desativar: (id: number) => api.delete(`/Apartamento/${id}`),

  reativar: (id: number) => api.patch(`/Apartamento/${id}/Ativar`),
};