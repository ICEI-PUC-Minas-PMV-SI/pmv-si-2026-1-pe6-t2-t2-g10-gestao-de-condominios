import type { UserRole } from '@/types/api'

export const roleOptions = [
  { label: 'Morador', value: 1 as const },
  { label: 'Funcionário', value: 2 as const },
  { label: 'Síndico', value: 3 as const },
]

export function canManageUsers(role: UserRole | null) {
  return role === 'Funcionario' || role === 'Sindico'
}

export function canManageNotices(role: UserRole | null) {
  return role === 'Funcionario' || role === 'Sindico'
}

export function roleToNumber(role: UserRole): 1 | 2 | 3 {
  if (role === 'Funcionario') {
    return 2
  }

  if (role === 'Sindico') {
    return 3
  }

  return 1
}
