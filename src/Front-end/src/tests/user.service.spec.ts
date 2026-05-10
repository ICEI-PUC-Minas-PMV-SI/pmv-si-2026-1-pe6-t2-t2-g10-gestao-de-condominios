import { createUser, fetchUserById, fetchUsers, updateUser } from '@/services/user.service'
import { api } from '@/services/http/client'

vi.mock('@/services/http/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('user.service', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
    vi.mocked(api.patch).mockReset()
  })

  it('envia paginacao, busca e status para listar usuarios', async () => {
    const response = { items: [], page: 2, pageSize: 10, totalItems: 0, totalPages: 1 }
    vi.mocked(api.get).mockResolvedValue({ data: response })

    await expect(fetchUsers({ page: 2, pageSize: 10, search: 'ana', ativo: false })).resolves.toBe(response)

    expect(api.get).toHaveBeenCalledWith('/usuarios', {
      params: { page: 2, pageSize: 10, search: 'ana', ativo: false },
    })
  })

  it('busca usuario por id', async () => {
    const user = { id: 7, nome: 'Ana' }
    vi.mocked(api.get).mockResolvedValue({ data: user })

    await expect(fetchUserById(7)).resolves.toBe(user)

    expect(api.get).toHaveBeenCalledWith('/usuarios/7')
  })

  it('cadastra e atualiza usuarios nos endpoints corretos', async () => {
    const createPayload = {
      nome: 'Ana',
      email: 'ana@teste.com',
      senha: '123456',
      cpf: '12345678901',
      telefone: null,
      perfil: 1 as const,
      idApartamento: 1,
    }
    const updatePayload = {
      nome: 'Ana Silva',
      email: 'ana@teste.com',
      senha: null,
      telefone: null,
      perfil: 1 as const,
      idApartamento: 1,
      ativo: true,
    }

    vi.mocked(api.post).mockResolvedValue({ data: { id: 1 } })
    vi.mocked(api.patch).mockResolvedValue({ data: { id: 1, nome: 'Ana Silva' } })

    await createUser(createPayload)
    await updateUser(1, updatePayload)

    expect(api.post).toHaveBeenCalledWith('/usuarios', createPayload)
    expect(api.patch).toHaveBeenCalledWith('/usuarios/1', updatePayload)
  })
})
