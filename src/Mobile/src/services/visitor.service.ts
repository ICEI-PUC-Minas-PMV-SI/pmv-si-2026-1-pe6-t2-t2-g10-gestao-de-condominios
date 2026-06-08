import { api } from './http/client';

export const visitorService = {
  getAll: () => api.get('/Visitantes').then(r => r.data),
  getByCpf: (cpf: string) => api.get(`/Visitantes/cpf?cpf=${cpf}`).then(r => r.data),
  create: (data: any) => api.post('/Visitantes', data).then(r => r.data),
  update: (cpf: string, data: any) => api.put(`/Visitantes/${cpf}`, data).then(r => r.data),
  desativar: (cpf: string) => api.delete(`/Visitantes/${cpf}`).then(r => r.data),
  reativar: (cpf: string) => api.patch(`/Visitantes/${cpf}`).then(r => r.data),
};