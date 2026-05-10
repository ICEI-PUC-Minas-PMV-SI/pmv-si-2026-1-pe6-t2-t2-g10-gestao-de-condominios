import { flushPromises, mount } from '@vue/test-utils'

import HomeView from '@/views/HomeView.vue'
import { fetchNotices } from '@/services/notice.service'

const authMock = vi.hoisted(() => ({
  usuario: {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana@teste.com',
    telefone: null,
    perfil: 'Sindico',
    idApartamento: null,
  },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authMock,
}))

vi.mock('@/services/notice.service', () => ({
  fetchNotices: vi.fn(),
}))

describe('HomeView', () => {
  beforeEach(() => {
    vi.mocked(fetchNotices).mockReset()
  })

  it('busca apenas comunicados ativos e renderiza somente destaques ativos', async () => {
    vi.mocked(fetchNotices).mockResolvedValue({
      items: [
        {
          id: 1,
          idAutor: 1,
          nomeAutor: 'Sindico',
          titulo: 'Aviso ativo em destaque',
          conteudo: 'Conteudo',
          dataPublicacao: '2026-01-01T00:00:00Z',
          ativo: true,
          destaque: true,
        },
        {
          id: 2,
          idAutor: 1,
          nomeAutor: 'Sindico',
          titulo: 'Aviso sem destaque',
          conteudo: 'Conteudo',
          dataPublicacao: '2026-01-01T00:00:00Z',
          ativo: true,
          destaque: false,
        },
        {
          id: 3,
          idAutor: 1,
          nomeAutor: 'Sindico',
          titulo: 'Aviso inativo',
          conteudo: 'Conteudo',
          dataPublicacao: '2026-01-01T00:00:00Z',
          ativo: false,
          destaque: true,
        },
      ],
      page: 1,
      pageSize: 4,
      totalItems: 3,
      totalPages: 1,
    })

    const wrapper = mount(HomeView)
    await flushPromises()

    expect(fetchNotices).toHaveBeenCalledWith({ page: 1, pageSize: 4, ativo: true })
    expect(wrapper.text()).toContain('Olá, Ana.')
    expect(wrapper.text()).toContain('Aviso ativo em destaque')
    expect(wrapper.text()).not.toContain('Aviso sem destaque')
    expect(wrapper.text()).not.toContain('Aviso inativo')
  })
})
