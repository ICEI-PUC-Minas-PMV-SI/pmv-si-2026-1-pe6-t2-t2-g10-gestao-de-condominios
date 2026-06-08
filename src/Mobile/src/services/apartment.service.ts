import { api } from './http/client';

export const apartmentService = {
  getAll: () => api.get('/Apartamento').then(r => r.data),
  create: (data: any) => api.post('/Apartamento', data).then(r => r.data),
  update: (id: number, data: any) => api.put(`/Apartamento/${id}`, data).then(r => r.data),
  desativar: (id: number) => api.delete(`/Apartamento/${id}`).then(r => r.data),
  reativar: (id: number) => api.patch(`/Apartamento/${id}`).then(r => r.data),
};