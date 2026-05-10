import { flushPromises, mount } from '@vue/test-utils'

import UsersView from '@/views/UsersView.vue'

const usersViewMocks = vi.hoisted(() => ({
  push: vi.fn(),
  loadUsers: vi.fn(),
  directory: {
    users: {
      __v_isRef: true,
      value: [
      {
        id: 1,
        nome: 'Morador Teste',
        email: 'morador@teste.com',
        cpf: '12345678901',
        telefone: null,
        perfil: 'Morador',
        idApartamento: 101,
        ativo: true,
        dataCriacao: '2026-01-01T00:00:00Z',
        dataUltimoLogin: null,
      },
      ],
    },
    loadingUsers: { __v_isRef: true, value: false },
    page: { __v_isRef: true, value: 1 },
    pageSize: { __v_isRef: true, value: 10 },
    totalItems: { __v_isRef: true, value: 1 },
    totalPages: { __v_isRef: true, value: 1 },
  },
}))

vi.mock('vue-router', () => ({
  RouterLink: {
    template: '<a><slot /></a>',
  },
  useRouter: () => ({
    push: usersViewMocks.push,
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    role: 'Sindico',
  }),
}))

vi.mock('@/composables/use-user-directory', () => ({
  useUserDirectory: () => ({
    ...usersViewMocks.directory,
    loadUsers: usersViewMocks.loadUsers,
  }),
}))

describe('UsersView', () => {
  beforeEach(() => {
    usersViewMocks.push.mockReset()
    usersViewMocks.loadUsers.mockReset()
  })

  it('carrega usuarios na primeira pagina', async () => {
    mount(UsersView)
    await flushPromises()

    expect(usersViewMocks.loadUsers).toHaveBeenCalledWith({
      page: 1,
      search: '',
      ativo: undefined,
    })
  })

  it('envia filtro de usuarios inativos para o composable', async () => {
    const wrapper = mount(UsersView)
    await flushPromises()
    usersViewMocks.loadUsers.mockClear()

    await wrapper.findAll('button').find((button) => button.text() === 'Inativos')!.trigger('click')
    await flushPromises()

    expect(usersViewMocks.loadUsers).toHaveBeenCalledWith({
      page: 1,
      search: '',
      ativo: false,
    })
  })

  it('navega para tela de edicao ao editar usuario', async () => {
    const wrapper = mount(UsersView)
    await flushPromises()

    await wrapper.get('tbody tr').trigger('click')

    expect(usersViewMocks.push).toHaveBeenCalledWith('/usuarios/1/editar')
  })
})
