import type { UserRole } from '@/types/api'

export const USER_ROLES: Record<UserRole, UserRole> = {
  Morador: 'Morador',
  Funcionario: 'Funcionario',
  Sindico: 'Sindico',
}

export const NOTICE_MANAGER_ROLES: UserRole[] = [
  USER_ROLES.Funcionario,
  USER_ROLES.Sindico,
]
