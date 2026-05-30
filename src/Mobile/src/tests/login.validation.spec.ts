import { validateLoginFields } from '@/utils/validation'

describe('validateLoginFields', () => {
  it('exige e-mail e senha antes do envio do login', () => {
    expect(validateLoginFields('', '')).toBe('Informe e-mail e senha para entrar.')
    expect(validateLoginFields('usuario@example.com', '')).toBe('Informe e-mail e senha para entrar.')
    expect(validateLoginFields('', '123456')).toBe('Informe e-mail e senha para entrar.')
  })

  it('aceita e-mail e senha preenchidos', () => {
    expect(validateLoginFields('usuario@example.com', '123456')).toBeNull()
  })
})
