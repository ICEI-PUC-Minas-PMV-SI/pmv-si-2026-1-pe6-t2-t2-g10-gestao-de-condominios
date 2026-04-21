import { api } from './http/client'
import type {
  AtualizacaoUsuarioRequest,
  CadastroRequest,
  UsuarioResponse,
} from '@/types/api'

export async function fetchUserById(id: number) {
  const { data } = await api.get<UsuarioResponse>(`/usuarios/${id}`)
  return data
}

export async function fetchUsers() {
  const { data } = await api.get<UsuarioResponse[]>('/usuarios')
  return data
}

export async function createUser(payload: CadastroRequest) {
  const { data } = await api.post<UsuarioResponse>('/usuarios', payload)
  return data
}

export async function updateUser(id: number, payload: AtualizacaoUsuarioRequest) {
  const { data } = await api.patch<UsuarioResponse>(`/usuarios/${id}`, payload)
  return data
}
