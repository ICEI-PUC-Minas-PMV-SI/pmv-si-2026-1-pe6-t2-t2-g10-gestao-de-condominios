import { resolveGuardRedirect } from '@/router/guards'
import type { UserRole } from '@/types/api'

function createRoute(meta: Record<string, unknown>, fullPath = '/destino') {
  return {
    meta,
    fullPath,
  }
}

function createAuth(isAuthenticated: boolean, role: UserRole | null) {
  return {
    isAuthenticated,
    role,
  }
}

describe('resolveGuardRedirect', () => {
  it('manda para login quando a rota exige autenticacao', () => {
    const redirect = resolveGuardRedirect(
      createRoute({ requiresAuth: true }),
      createAuth(false, null),
    )

    expect(redirect).toEqual({
      path: '/login',
      query: { redirect: '/destino' },
    })
  })

  it('manda para 403 quando o perfil nao esta na lista autorizada', () => {
    const redirect = resolveGuardRedirect(
      createRoute({ requiresAuth: true, allowedRoles: ['Sindico'] }),
      createAuth(true, 'Morador'),
    )

    expect(redirect).toBe('/erro/403')
  })

  it('nao bloqueia quando o perfil esta autorizado', () => {
    const redirect = resolveGuardRedirect(
      createRoute({ requiresAuth: true, allowedRoles: ['Funcionario', 'Sindico'] }),
      createAuth(true, 'Funcionario'),
    )

    expect(redirect).toBeUndefined()
  })
})
