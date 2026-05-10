import { useNoticeBoard } from '@/composables/use-notice-board'
import { createNotice, fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'

vi.mock('@/services/notice.service', () => ({
  createNotice: vi.fn(),
  fetchNotices: vi.fn(),
  updateNoticeHighlight: vi.fn(),
  updateNoticeStatus: vi.fn(),
}))

const activeNotice = {
  id: 1,
  idAutor: 1,
  nomeAutor: 'Sindico',
  titulo: 'Aviso ativo',
  conteudo: 'Conteudo',
  dataPublicacao: '2026-01-01T00:00:00Z',
  ativo: true,
  destaque: true,
}

describe('useNoticeBoard', () => {
  beforeEach(() => {
    vi.mocked(createNotice).mockReset()
    vi.mocked(fetchNotices).mockReset()
    vi.mocked(updateNoticeHighlight).mockReset()
    vi.mocked(updateNoticeStatus).mockReset()
  })

  it('carrega comunicados paginados com filtro de status', async () => {
    const response = {
      items: [activeNotice],
      page: 1,
      pageSize: 4,
      totalItems: 1,
      totalPages: 1,
    }
    vi.mocked(fetchNotices).mockResolvedValue(response)

    const board = useNoticeBoard()
    await board.loadNotices({ page: 1, ativo: true })

    expect(fetchNotices).toHaveBeenCalledWith({ page: 1, pageSize: 4, ativo: true })
    expect(board.notices.value).toEqual([activeNotice])
    expect(board.highlightNotice.value).toEqual(activeNotice)
    expect(board.currentAtivo.value).toBe(true)
  })

  it('desativa e reativa comunicado atualizando o estado local', async () => {
    vi.mocked(fetchNotices).mockResolvedValue({
      items: [activeNotice],
      page: 1,
      pageSize: 4,
      totalItems: 1,
      totalPages: 1,
    })
    vi.mocked(updateNoticeStatus)
      .mockResolvedValueOnce({ ...activeNotice, ativo: false })
      .mockResolvedValueOnce(activeNotice)

    const board = useNoticeBoard()
    await board.loadNotices()
    await board.archiveNotice(1)

    expect(board.notices.value[0].ativo).toBe(false)

    await board.activateNotice(1)

    expect(board.notices.value[0].ativo).toBe(true)
  })

  it('publica comunicado e altera destaque pelos services', async () => {
    const payload = { titulo: 'Aviso', conteudo: 'Conteudo', destaque: false }
    vi.mocked(createNotice).mockResolvedValue(activeNotice)
    vi.mocked(updateNoticeHighlight).mockResolvedValue(activeNotice)

    const board = useNoticeBoard()

    await board.publishNotice(payload)
    await board.setHighlight(1)
    await board.removeHighlight(1)

    expect(createNotice).toHaveBeenCalledWith(payload)
    expect(updateNoticeHighlight).toHaveBeenCalledWith(1, { destaque: true })
    expect(updateNoticeHighlight).toHaveBeenCalledWith(1, { destaque: false })
  })
})
