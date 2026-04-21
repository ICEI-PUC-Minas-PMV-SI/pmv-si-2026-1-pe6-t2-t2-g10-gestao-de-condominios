import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

import type { UserRole } from '@/types/api'

export interface AuthSnapshot {
  isAuthenticated: boolean
  role: UserRole | null
}

export function resolveGuardRedirect(
  to: Pick<RouteLocationNormalized, 'fullPath' | 'meta'>,
  auth: AuthSnapshot,
): RouteLocationRaw | undefined {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.anonymousOnly && auth.isAuthenticated) {
    return '/'
  }

  if (to.meta.allowedRoles?.length && (!auth.role || !to.meta.allowedRoles.includes(auth.role))) {
    return '/erro/403'
  }

  return undefined
}
