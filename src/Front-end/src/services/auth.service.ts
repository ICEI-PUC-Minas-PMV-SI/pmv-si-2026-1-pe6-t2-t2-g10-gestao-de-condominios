import { api } from './http/client'
import type { AutenticacaoResponse, LoginRequest } from '@/types/api'

export async function login(payload: LoginRequest) {
  const { data } = await api.post<AutenticacaoResponse>('/autenticacao/entrar', payload)
  return data
}
