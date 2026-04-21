export function formatDate(dateText: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateText))
}

export function formatRole(role: string) {
  return role === 'Funcionario' ? 'Funcionário' : role
}

export function formatApartment(idApartamento: number | null) {
  return idApartamento ? `Apartamento ${idApartamento}` : 'Sem apartamento vinculado'
}
