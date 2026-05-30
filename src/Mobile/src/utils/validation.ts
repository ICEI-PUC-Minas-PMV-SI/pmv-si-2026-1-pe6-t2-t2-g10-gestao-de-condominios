export function validateLoginFields(email: string, senha: string) {
  if (!email.trim() || !senha.trim()) {
    return 'Informe e-mail e senha para entrar.'
  }

  return null
}
