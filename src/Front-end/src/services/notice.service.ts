import { api } from './http/client'
import type {
  AtualizacaoDestaqueComunicadoRequest,
  AtualizacaoStatusComunicadoRequest,
  ComunicadoResponse,
  CriacaoComunicadoRequest,
  PagedResponse,
  PaginationQuery,
} from '@/types/api'

export async function fetchNotices(params: PaginationQuery = {}) {
  const { data } = await api.get<PagedResponse<ComunicadoResponse>>('/comunicados', { params })
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
