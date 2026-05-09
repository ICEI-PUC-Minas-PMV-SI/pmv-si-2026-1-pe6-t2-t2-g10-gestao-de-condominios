export type UserRole = 'Morador' | 'Funcionario' | 'Sindico'

export interface PaginationQuery {
  page?: number
  pageSize?: number
  search?: string
}

export interface PagedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface PerfilUsuarioResponse {
  id: number
  nome: string
  email: string
  telefone: string | null
  perfil: UserRole
  idApartamento: number | null
}

export interface AutenticacaoResponse {
  token: string
  expiraEmUtc: string
  usuario: PerfilUsuarioResponse
}

export interface CadastroRequest {
  nome: string
  email: string
  senha: string
  cpf: string
  telefone: string | null
  perfil: 1 | 2 | 3
  idApartamento: number | null
}

export interface ApartamentoResponse {
  id: number
  numero: string
  bloco: string
  andar: number
  tipo: string
  ativo: boolean
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  cpf: string
  telefone: string | null
  perfil: UserRole
  idApartamento: number | null
  ativo: boolean
  dataCriacao: string
  dataUltimoLogin: string | null
}

export interface AtualizacaoUsuarioRequest {
  nome: string
  email: string
  senha: string | null
  telefone: string | null
  perfil: 1 | 2 | 3
  idApartamento: number | null
  ativo: boolean
}

export interface AtualizacaoStatusUsuarioRequest {
  ativo: boolean
}

export interface CriacaoComunicadoRequest {
  titulo: string
  conteudo: string
  destaque: boolean
}

export interface ComunicadoResponse {
  id: number
  idAutor: number
  nomeAutor: string
  titulo: string
  conteudo: string
  dataPublicacao: string
  ativo: boolean
  destaque: boolean
}

export interface AtualizacaoStatusComunicadoRequest {
  ativo: boolean
}

export interface AtualizacaoDestaqueComunicadoRequest {
  destaque: boolean
}

export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
}

export interface ValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>
}

export interface SessionSnapshot {
  token: string
  expiraEmUtc: string
  usuario: PerfilUsuarioResponse
}

export interface CpfValue {
  value: string
}

export interface VisitanteResponse {
  id: number
  nome: string
  cpf: CpfValue
  telefone: string
  observacao: string
  ativo: boolean
  idApartamento: number
}

export interface AcessoVisitanteResponse {
  id: number
  idVisitante: number
  idApartamento: number
  dataHoraEntrada: string
  dataHoraSaida: string | null
  observacao: string
  visitante?: VisitanteResponse
}

export interface RegistroEntradaRequest {
  idUsuarioApartamento: number
  idUsuarioPorteiro: number
  tipoAcesso: number
  motivoVisita: number
  observacao: string
}