import { flushPromises, mount } from '@vue/test-utils'

import NoticesView from '@/views/NoticesView.vue'

const noticesViewMocks = vi.hoisted(() => ({
  loadNotices: vi.fn(),
  publishNotice: vi.fn(),
  archiveNotice: vi.fn(),
  activateNotice: vi.fn(),
  setHighlight: vi.fn(),
  removeHighlight: vi.fn(),
  board: {
    notices: {
      __v_isRef: true,
      value: [
      {
        id: 1,
        idAutor: 1,
        nomeAutor: 'Sindico',
        titulo: 'Comunicado ativo',
        conteudo: 'Conteudo',
        dataPublicacao: '2026-01-01T00:00:00Z',
        ativo: true,
        destaque: false,
      },
      ],
    },
    loading: { __v_isRef: true, value: false },
    saving: { __v_isRef: true, value: false },
    page: { __v_isRef: true, value: 1 },
    pageSize: { __v_isRef: true, value: 4 },
    totalItems: { __v_isRef: true, value: 1 },
    totalPages: { __v_isRef: true, value: 1 },
  },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    role: 'Sindico',
  }),
}))

vi.mock('@/composables/use-notice-board', () => ({
  useNoticeBoard: () => ({
    ...noticesViewMocks.board,
    loadNotices: noticesViewMocks.loadNotices,
    publishNotice: noticesViewMocks.publishNotice,
    archiveNotice: noticesViewMocks.archiveNotice,
    activateNotice: noticesViewMocks.activateNotice,
    setHighlight: noticesViewMocks.setHighlight,
    removeHighlight: noticesViewMocks.removeHighlight,
  }),
}))

describe('NoticesView', () => {
  beforeEach(() => {
    noticesViewMocks.loadNotices.mockReset()
    noticesViewMocks.publishNotice.mockReset()
    noticesViewMocks.archiveNotice.mockReset()
    noticesViewMocks.activateNotice.mockReset()
    noticesViewMocks.setHighlight.mockReset()
    noticesViewMocks.removeHighlight.mockReset()
  })

  it('carrega comunicados sem filtro de status inicialmente', async () => {
    mount(NoticesView)
    await flushPromises()

    expect(noticesViewMocks.loadNotices).toHaveBeenCalledWith({ page: 1, ativo: undefined })
  })

  it('envia filtro de ativos e inativos para o composable', async () => {
    const wrapper = mount(NoticesView, {
      global: {
        stubs: {
          NoticeCreateForm: true,
        },
      },
    })
    await flushPromises()
    noticesViewMocks.loadNotices.mockClear()

    await wrapper.findAll('button').find((button) => button.text() === 'Ativos')!.trigger('click')
    await flushPromises()
    await wrapper.findAll('button').find((button) => button.text() === 'Inativos')!.trigger('click')
    await flushPromises()

    expect(noticesViewMocks.loadNotices).toHaveBeenCalledWith({ page: 1, ativo: true })
    expect(noticesViewMocks.loadNotices).toHaveBeenCalledWith({ page: 1, ativo: false })
  })

  it('desativa comunicado e recarrega a pagina atual', async () => {
    const wrapper = mount(NoticesView, {
      global: {
        stubs: {
          NoticeCreateForm: true,
        },
      },
    })
    await flushPromises()
    noticesViewMocks.loadNotices.mockClear()

    await wrapper.findAll('button').find((button) => button.text() === 'Desativar')!.trigger('click')
    await flushPromises()

    expect(noticesViewMocks.archiveNotice).toHaveBeenCalledWith(1)
    expect(noticesViewMocks.loadNotices).toHaveBeenCalledWith({ page: 1, ativo: undefined })
  })
})
