import { fetchUsers, updateUserStatus } from '@/services/user.service'
import { api } from '@/services/http/client'

jest.mock('@/services/http/client', () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}))

describe('user.service', () => {
  it('lista usuários com paginação, busca e filtro de status', async () => {
    const response = { items: [], page: 2, pageSize: 8, totalItems: 0, totalPages: 0 }
    jest.mocked(api.get).mockResolvedValueOnce({ data: response })

    await expect(fetchUsers({ page: 2, pageSize: 8, search: 'ana', ativo: true })).resolves.toEqual(response)

    expect(api.get).toHaveBeenCalledWith('/usuarios', {
      params: { page: 2, pageSize: 8, search: 'ana', ativo: true },
    })
  })

  it('altera status de usuário pelo endpoint dedicado', async () => {
    const response = { id: 7, ativo: false }
    jest.mocked(api.patch).mockResolvedValueOnce({ data: response })

    await expect(updateUserStatus(7, { ativo: false })).resolves.toEqual(response)

    expect(api.patch).toHaveBeenCalledWith('/usuarios/7/ativo', { ativo: false })
  })
})
