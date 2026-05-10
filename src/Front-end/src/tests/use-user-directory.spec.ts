import { useUserDirectory } from '@/composables/use-user-directory'
import { fetchApartments } from '@/services/apartment.service'
import { createUser, fetchUsers } from '@/services/user.service'

vi.mock('@/services/apartment.service', () => ({
  fetchApartments: vi.fn(),
}))

vi.mock('@/services/user.service', () => ({
  createUser: vi.fn(),
  fetchUsers: vi.fn(),
}))

describe('useUserDirectory', () => {
  beforeEach(() => {
    vi.mocked(fetchApartments).mockReset()
    vi.mocked(createUser).mockReset()
    vi.mocked(fetchUsers).mockReset()
  })

  it('carrega usuarios paginados com busca e status', async () => {
    const response = {
      items: [
        {
          id: 1,
          nome: 'Ana',
          email: 'ana@teste.com',
          cpf: '12345678901',
          telefone: null,
          perfil: 'Morador' as const,
          idApartamento: 1,
          ativo: false,
          dataCriacao: '2026-01-01T00:00:00Z',
          dataUltimoLogin: null,
        },
      ],
      page: 2,
      pageSize: 10,
      totalItems: 11,
      totalPages: 2,
    }
    vi.mocked(fetchUsers).mockResolvedValue(response)

    const directory = useUserDirectory()
    await directory.loadUsers({ page: 2, search: ' Ana ', ativo: false })

    expect(fetchUsers).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      search: 'Ana',
      ativo: false,
    })
    expect(directory.users.value).toEqual(response.items)
    expect(directory.page.value).toBe(2)
    expect(directory.totalItems.value).toBe(11)
    expect(directory.currentSearch.value).toBe('Ana')
    expect(directory.currentAtivo.value).toBe(false)
  })

  it('carrega apenas apartamentos ativos como opcoes', async () => {
    vi.mocked(fetchApartments).mockResolvedValue([
      { id: 1, numero: '101', bloco: 'A', andar: 1, tipo: 'Padrao', ativo: true },
      { id: 2, numero: '102', bloco: 'A', andar: 1, tipo: 'Padrao', ativo: false },
    ])

    const directory = useUserDirectory()
    await directory.loadApartments()

    expect(directory.activeApartments.value).toEqual([
      { id: 1, numero: '101', bloco: 'A', andar: 1, tipo: 'Padrao', ativo: true },
    ])
  })

  it('cadastra usuario controlando estado de salvamento', async () => {
    const payload = {
      nome: 'Ana',
      email: 'ana@teste.com',
      senha: '123456',
      cpf: '12345678901',
      telefone: null,
      perfil: 1 as const,
      idApartamento: 1,
    }
    vi.mocked(createUser).mockResolvedValue({ id: 1 } as never)

    const directory = useUserDirectory()
    await expect(directory.registerUser(payload)).resolves.toEqual({ id: 1 })

    expect(createUser).toHaveBeenCalledWith(payload)
    expect(directory.savingUser.value).toBe(false)
  })
})
