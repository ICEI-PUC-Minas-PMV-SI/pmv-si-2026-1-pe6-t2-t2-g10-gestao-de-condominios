import { flushPromises, mount } from '@vue/test-utils'

import ProfileView from '@/views/ProfileView.vue'
import { fetchApartments } from '@/services/apartment.service'
import { fetchUserById, updateUser } from '@/services/user.service'

const authMock = vi.hoisted(() => ({
  role: 'Morador',
  usuario: {
    id: 1,
    nome: 'Morador Teste',
    email: 'morador@teste.com',
    telefone: null,
    perfil: 'Morador',
    idApartamento: 101,
  },
  syncProfile: vi.fn(),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authMock,
}))

vi.mock('@/services/apartment.service', () => ({
  fetchApartments: vi.fn(),
}))

vi.mock('@/services/user.service', () => ({
  fetchUserById: vi.fn(),
  updateUser: vi.fn(),
}))

describe('ProfileView', () => {
  beforeEach(() => {
    authMock.syncProfile.mockReset()
    vi.mocked(fetchApartments).mockReset()
    vi.mocked(fetchUserById).mockReset()
    vi.mocked(updateUser).mockReset()
  })

  it('mostra apenas o ultimo login nas informacoes da conta', async () => {
    vi.mocked(fetchUserById).mockResolvedValue({
      id: 1,
      nome: 'Morador Teste',
      email: 'morador@teste.com',
      cpf: '33333333333',
      telefone: null,
      perfil: 'Morador',
      idApartamento: 101,
      ativo: true,
      dataCriacao: '2026-03-25T00:48:00Z',
      dataUltimoLogin: '2026-05-10T19:02:00Z',
    })
    vi.mocked(fetchApartments).mockResolvedValue([
      { id: 101, numero: '101', bloco: 'A', andar: 1, tipo: 'Padrao', ativo: true },
    ])

    const wrapper = mount(ProfileView, {
      global: {
        stubs: {
          UserEditForm: {
            template: '<form data-test="profile-form"></form>',
          },
        },
      },
    })
    await flushPromises()

    expect(fetchUserById).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('Último login')
    expect(wrapper.text()).not.toContain('CPF')
    expect(wrapper.text()).not.toContain('Criado em')
    expect(wrapper.text()).not.toContain('33333333333')
  })

  it('sincroniza perfil apos salvar alteracoes', async () => {
    const updatedProfile = {
      id: 1,
      nome: 'Morador Atualizado',
      email: 'morador@teste.com',
      cpf: '33333333333',
      telefone: '31999999999',
      perfil: 'Morador' as const,
      idApartamento: 101,
      ativo: true,
      dataCriacao: '2026-03-25T00:48:00Z',
      dataUltimoLogin: null,
    }
    vi.mocked(fetchUserById).mockResolvedValue({ ...updatedProfile, nome: 'Morador Teste' })
    vi.mocked(fetchApartments).mockResolvedValue([])
    vi.mocked(updateUser).mockResolvedValue(updatedProfile)

    const wrapper = mount(ProfileView, {
      global: {
        stubs: {
          UserEditForm: {
            template: '<button type="button" @click="$emit(\'submit\', payload)">Salvar</button>',
            data: () => ({
              payload: {
                nome: 'Morador Atualizado',
                email: 'morador@teste.com',
                senha: null,
                telefone: '31999999999',
                perfil: 1,
                idApartamento: 101,
                ativo: true,
              },
            }),
          },
        },
      },
    })
    await flushPromises()

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(updateUser).toHaveBeenCalledWith(1, {
      nome: 'Morador Atualizado',
      email: 'morador@teste.com',
      senha: null,
      telefone: '31999999999',
      perfil: 1,
      idApartamento: 101,
      ativo: true,
    })
    expect(authMock.syncProfile).toHaveBeenCalledWith(updatedProfile)
  })
})
