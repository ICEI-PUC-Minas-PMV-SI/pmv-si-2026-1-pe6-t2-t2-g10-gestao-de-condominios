import { api } from './http/client'
import type { ApartamentoResponse } from '@/types/api'

export async function fetchApartments() {
  const { data } = await api.get<ApartamentoResponse[]>('/Apartamento')
  return data
}
