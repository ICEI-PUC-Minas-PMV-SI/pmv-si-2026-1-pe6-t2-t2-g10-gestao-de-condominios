import { login } from '@/services/auth.service'
import { api } from '@/services/http/client'

jest.mock('@/services/http/client', () => ({
  api: {
    post: jest.fn(),
  },
}))

describe('auth.service', () => {
  it('envia credenciais para o endpoint de autenticação', async () => {
    const response = {
      token: 'jwt',
      expiraEmUtc: '2099-01-01T00:00:00Z',
      usuario: {
        id: 1,
        nome: 'Usuário Teste',
        email: 'usuario@example.com',
        telefone: null,
        perfil: 'Sindico',
        idApartamento: null,
      },
    }
    jest.mocked(api.post).mockResolvedValueOnce({ data: response })

    await expect(login({ email: 'usuario@example.com', senha: '123456' })).resolves.toEqual(response)

    expect(api.post).toHaveBeenCalledWith('/autenticacao/entrar', {
      email: 'usuario@example.com',
      senha: '123456',
    })
  })
})
