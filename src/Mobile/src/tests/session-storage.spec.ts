import { clearPersistedSession, persistSession, readPersistedSession } from '@/storage/session-storage'

describe('session-storage', () => {
  it('persiste, lê e limpa a sessão autenticada', async () => {
    const session = {
      token: 'jwt',
      expiraEmUtc: '2099-01-01T00:00:00Z',
      usuario: {
        id: 1,
        nome: 'Usuário Teste',
        email: 'usuario@example.com',
        telefone: null,
        perfil: 'Sindico' as const,
        idApartamento: null,
      },
    }

    await persistSession(session)
    await expect(readPersistedSession()).resolves.toEqual(session)

    await clearPersistedSession()
    await expect(readPersistedSession()).resolves.toBeNull()
  })
})
