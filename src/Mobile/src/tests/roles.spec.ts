import { canManageNotices, canManageUsers, roleOptions, roleToNumber } from '@/utils/roles'
import type { UserRole } from '@/types/api'

describe('roles utils', () => {
  it('mantem as opcoes de perfil alinhadas com a API', () => {
    expect(roleOptions.map((option) => option.value)).toEqual([1, 2, 3])
    expect(roleOptions).toHaveLength(3)
  })

  it.each<UserRole | null>(['Funcionario', 'Sindico'])(
    'permite que %s gerencie usuarios e comunicados',
    (role) => {
      expect(canManageUsers(role)).toBe(true)
      expect(canManageNotices(role)).toBe(true)
    },
  )

  it.each<UserRole | null>(['Morador', null])(
    'bloqueia gerenciamento para %s',
    (role) => {
      expect(canManageUsers(role)).toBe(false)
      expect(canManageNotices(role)).toBe(false)
    },
  )

  it.each<[UserRole, 1 | 2 | 3]>([
    ['Morador', 1],
    ['Funcionario', 2],
    ['Sindico', 3],
  ])('converte o perfil %s para o codigo numerico %i', (role, expected) => {
    expect(roleToNumber(role)).toBe(expected)
  })
})
