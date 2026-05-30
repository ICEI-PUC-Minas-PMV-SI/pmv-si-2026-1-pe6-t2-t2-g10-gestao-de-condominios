import { createNotice, fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import { api } from '@/services/http/client'

jest.mock('@/services/http/client', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}))

describe('notice.service', () => {
  it('lista comunicados com paginação e filtro de status', async () => {
    const response = { items: [], page: 1, pageSize: 8, totalItems: 0, totalPages: 0 }
    jest.mocked(api.get).mockResolvedValueOnce({ data: response })

    await expect(fetchNotices({ page: 1, pageSize: 8, ativo: true })).resolves.toEqual(response)

    expect(api.get).toHaveBeenCalledWith('/comunicados', {
      params: { page: 1, pageSize: 8, ativo: true },
    })
  })

  it('cria comunicado com título, conteúdo e destaque', async () => {
    const response = { id: 3, titulo: 'Aviso' }
    const payload = { titulo: 'Aviso', conteudo: 'Conteúdo', destaque: true }
    jest.mocked(api.post).mockResolvedValueOnce({ data: response })

    await expect(createNotice(payload)).resolves.toEqual(response)

    expect(api.post).toHaveBeenCalledWith('/comunicados', payload)
  })

  it('altera status e destaque pelos endpoints atuais da API', async () => {
    jest.mocked(api.patch)
      .mockResolvedValueOnce({ data: { id: 4, ativo: false } })
      .mockResolvedValueOnce({ data: { id: 4, destaque: true } })

    await updateNoticeStatus(4, { ativo: false })
    await updateNoticeHighlight(4, { destaque: true })

    expect(api.patch).toHaveBeenNthCalledWith(1, '/comunicados/4/ativo', { ativo: false })
    expect(api.patch).toHaveBeenNthCalledWith(2, '/comunicados/4/destaque', { destaque: true })
  })
})
