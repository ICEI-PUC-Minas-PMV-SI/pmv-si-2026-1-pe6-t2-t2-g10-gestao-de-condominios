import { api } from './http/client';
import type { VisitanteResponse } from '@/types/api';

export const visitorService = {
  getAll: () =>
    api.get<{ data: VisitanteResponse[] }>('/Visitantes').then(r => r.data),

  getByCpf: (cpf: string) =>
  api.get<VisitanteResponse>('/Visitantes/cpf', { params: { cpf } }).then(r => r.data),

  create: (data: {
    nome: string;
    cpf: string;
    telefone: string;
    observacao: string;
    idApartamento: number;
  }) => api.post('/Visitantes', data),

  update: (cpf: string, data: {
    nome: string;
    telefone: string;
    observacao: string;
    idApartamento: number;
  }) => api.put(`/Visitantes/${cpf}`, data),

  desativar: (cpf: string) => api.delete(`/Visitantes/${cpf}`),

  reativar: (cpf: string) => api.patch(`/Visitantes/${cpf}`),
};