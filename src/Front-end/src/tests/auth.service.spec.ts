import { login } from '@/services/auth.service'
import { api } from '@/services/http/client'

vi.mock('@/services/http/client', () => ({
  api: {
    post: vi.fn(),
  },
}))

describe('auth.service', () => {
  beforeEach(() => {
    vi.mocked(api.post).mockReset()
  })

  it('envia credenciais para o endpoint de autenticacao', async () => {
    const payload = { email: 'sindico@teste.com', senha: '123456' }
    const response = {
      token: 'token',
      expiraEmUtc: '2099-01-01T00:00:00Z',
      usuario: {
        id: 1,
        nome: 'Sindico',
        email: 'sindico@teste.com',
        telefone: null,
        perfil: 'Sindico',
        idApartamento: null,
      },
    }
    vi.mocked(api.post).mockResolvedValue({ data: response })

    await expect(login(payload)).resolves.toBe(response)

    expect(api.post).toHaveBeenCalledWith('/autenticacao/entrar', payload)
  })
})
