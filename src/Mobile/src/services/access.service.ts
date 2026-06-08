import { api } from './http/client';

export const accessService = {
  getOpen: () => api.get('/Acessos').then(r => r.data),
  getAcessosPorCpf: (cpf: string) => api.get(`/Acessos/${cpf}`).then(r => r.data),
  registerEntry: (cpf: string, data: any) => api.post(`/Acessos/Entrada/${cpf}`, data).then(r => r.data),
  registerExit: (cpf: string) => api.post(`/Acessos/Saida/${cpf}`).then(r => r.data),
};