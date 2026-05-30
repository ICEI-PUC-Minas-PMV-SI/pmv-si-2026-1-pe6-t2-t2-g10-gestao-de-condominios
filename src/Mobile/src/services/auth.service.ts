import type { AutenticacaoResponse, LoginRequest } from '@/types/api'

import { api } from './http/client'

export async function login(payload: LoginRequest) {
  const { data } = await api.post<AutenticacaoResponse>('/autenticacao/entrar', payload)
  return data
}
