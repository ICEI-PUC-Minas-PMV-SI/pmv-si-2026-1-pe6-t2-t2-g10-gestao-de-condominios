import { api } from './http/client'
import type {
  AtualizacaoDestaqueComunicadoRequest,
  AtualizacaoStatusComunicadoRequest,
  ComunicadoResponse,
  CriacaoComunicadoRequest,
} from '@/types/api'

export async function fetchNotices() {
  const { data } = await api.get<ComunicadoResponse[]>('/comunicados')
  return data
}

export async function fetchNoticeById(id: number) {
  const { data } = await api.get<ComunicadoResponse>(`/comunicados/${id}`)
  return data
}

export async function createNotice(payload: CriacaoComunicadoRequest) {
  const { data } = await api.post<ComunicadoResponse>('/comunicados', payload)
  return data
}

export async function updateNoticeStatus(id: number, payload: AtualizacaoStatusComunicadoRequest) {
  const { data } = await api.patch<ComunicadoResponse>(`/comunicados/${id}/ativo`, payload)
  return data
}

export async function updateNoticeHighlight(id: number, payload: AtualizacaoDestaqueComunicadoRequest) {
  const { data } = await api.patch<ComunicadoResponse>(`/comunicados/${id}/destaque`, payload)
  return data
}
