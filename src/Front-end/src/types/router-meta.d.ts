import 'vue-router'

import type { UserRole } from './api'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    allowedRoles?: UserRole[]
    anonymousOnly?: boolean
  }
}

export {}
