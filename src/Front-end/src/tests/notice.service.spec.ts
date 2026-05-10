import {
  createNotice,
  fetchNoticeById,
  fetchNotices,
  updateNoticeHighlight,
  updateNoticeStatus,
} from '@/services/notice.service'
import { api } from '@/services/http/client'

vi.mock('@/services/http/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('notice.service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.patch).mockReset()
  })

  it('envia paginacao e status para listar comunicados', async () => {
    const response = { items: [], page: 1, pageSize: 4, totalItems: 0, totalPages: 1 }
    vi.mocked(api.get).mockResolvedValue({ data: response })

    await expect(fetchNotices({ page: 1, pageSize: 4, ativo: true })).resolves.toBe(response)

    expect(api.get).toHaveBeenCalledWith('/comunicados', {
      params: { page: 1, pageSize: 4, ativo: true },
    })
  })

  it('busca comunicado por id', async () => {
    const notice = { id: 4, titulo: 'Aviso' }
    vi.mocked(api.get).mockResolvedValue({ data: notice })

    await expect(fetchNoticeById(4)).resolves.toBe(notice)

    expect(api.get).toHaveBeenCalledWith('/comunicados/4')
  })

  it('cria comunicado e altera status/destaque nos endpoints corretos', async () => {
    const payload = { titulo: 'Aviso', conteudo: 'Conteudo', destaque: true }

    vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
    vi.mocked(api.patch).mockResolvedValue({ data: { id: 1 } })

    await createNotice(payload)
    await updateNoticeStatus(1, { ativo: false })
    await updateNoticeHighlight(1, { destaque: false })

    expect(api.post).toHaveBeenCalledWith('/comunicados', payload)
    expect(api.patch).toHaveBeenCalledWith('/comunicados/1/ativo', { ativo: false })
    expect(api.patch).toHaveBeenCalledWith('/comunicados/1/destaque', { destaque: false })
  })
})
