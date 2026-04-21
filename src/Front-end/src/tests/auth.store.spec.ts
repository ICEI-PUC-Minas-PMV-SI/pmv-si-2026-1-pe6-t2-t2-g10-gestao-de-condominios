import { setActivePinia, createPinia } from 'pinia'

import { useAuthStore } from '@/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('restaura a sessao persistida quando ainda esta valida', () => {
    localStorage.setItem(
      'smartsindico.session',
      JSON.stringify({
        token: 'token-teste',
        expiraEmUtc: '2099-01-01T00:00:00Z',
        usuario: {
          id: 1,
          nome: 'Morador Teste',
          email: 'morador@teste.com',
          telefone: null,
          perfil: 'Morador',
          idApartamento: 101,
        },
      }),
    )

    const store = useAuthStore()
    store.bootstrapSession()

    expect(store.isAuthenticated).toBe(true)
    expect(store.role).toBe('Morador')
    expect(store.usuario?.nome).toBe('Morador Teste')
  })

  it('limpa a sessao quando a expiracao ja passou', () => {
    localStorage.setItem(
      'smartsindico.session',
      JSON.stringify({
        token: 'token-expirado',
        expiraEmUtc: '2000-01-01T00:00:00Z',
        usuario: {
          id: 1,
          nome: 'Morador Teste',
          email: 'morador@teste.com',
          telefone: null,
          perfil: 'Morador',
          idApartamento: 101,
        },
      }),
    )

    const store = useAuthStore()
    store.bootstrapSession()

    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('smartsindico.session')).toBeNull()
  })

  it('sincroniza o perfil persistido quando atualiza dados da conta', () => {
    localStorage.setItem(
      'smartsindico.session',
      JSON.stringify({
        token: 'token-teste',
        expiraEmUtc: '2099-01-01T00:00:00Z',
        usuario: {
          id: 1,
          nome: 'Morador Teste',
          email: 'morador@teste.com',
          telefone: null,
          perfil: 'Morador',
          idApartamento: 101,
        },
      }),
    )

    const store = useAuthStore()
    store.bootstrapSession()
    store.syncProfile({
      id: 1,
      nome: 'Morador Teste',
      email: 'morador@teste.com',
      cpf: '00000000000',
      telefone: '(31) 99999-0000',
      perfil: 'Morador',
      idApartamento: 101,
      ativo: true,
      dataCriacao: '2025-01-01T00:00:00Z',
      dataUltimoLogin: '2025-01-02T00:00:00Z',
    })

    expect(store.usuario?.telefone).toBe('(31) 99999-0000')
    expect(localStorage.getItem('smartsindico.session')).toContain('(31) 99999-0000')
  })
})
