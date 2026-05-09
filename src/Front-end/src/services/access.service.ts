import { api } from './http/client';
import type { AcessoVisitanteResponse, RegistroEntradaRequest } from '@/types/api';

export const accessService = {
 getOpen: () =>
  api.get<AcessoVisitanteResponse[]>('/Acessos').then(r => r.data),

  getAcessosPorCpf: (cpf: string) =>
    api.get<{ data: AcessoVisitanteResponse[] }>(`/Acessos/${cpf}`).then(r => r.data),

  registerEntry: (cpf: string, data: RegistroEntradaRequest) =>
    api.post(`/Acessos/Entrada/${cpf}`, data),

  registerExit: (cpf: string) =>
    api.post(`/Acessos/Saida/${cpf}`),
};