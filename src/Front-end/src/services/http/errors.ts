import axios, { type AxiosError } from 'axios'

import { navigateTo } from '@/services/navigation'
import type { ProblemDetails, ValidationProblemDetails } from '@/types/api'
import { clearPersistedSession } from '@/utils/session-storage'

export type AppErrorType =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'server'
  | 'network'
  | 'unknown'

export class AppError extends Error {
  type: AppErrorType
  status?: number
  detail?: string
  fieldErrors?: Record<string, string[]>

  constructor(
    message: string,
    options: {
      type: AppErrorType
      status?: number
      detail?: string
      fieldErrors?: Record<string, string[]>
    },
  ) {
    super(message)
    this.name = 'AppError'
    this.type = options.type
    this.status = options.status
    this.detail = options.detail
    this.fieldErrors = options.fieldErrors
  }
}

function hasValidationErrors(
  data: ValidationProblemDetails | ProblemDetails | undefined,
): data is ValidationProblemDetails {
  return !!data && 'errors' in data
}

export function mapAxiosError(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return new AppError('Ocorreu uma falha inesperada ao processar a solicitação.', {
      type: 'unknown',
    })
  }

  const status = error.response?.status
  const data = error.response?.data as ValidationProblemDetails | ProblemDetails | undefined

  if (status === 400 && hasValidationErrors(data)) {
    return new AppError(data.title ?? 'Falha de validação.', {
      type: 'validation',
      status,
      detail: data.detail,
      fieldErrors: data.errors,
    })
  }

  if (status === 401) {
    return new AppError(data?.title ?? 'Sessão expirada ou acesso não autorizado.', {
      type: 'unauthorized',
      status,
      detail: data?.detail,
    })
  }

  if (status === 403) {
    return new AppError(data?.title ?? 'Você não tem permissão para esta operação.', {
      type: 'forbidden',
      status,
      detail: data?.detail,
    })
  }

  if (status === 404) {
    return new AppError(data?.title ?? 'Recurso não encontrado.', {
      type: 'notFound',
      status,
      detail: data?.detail,
    })
  }

  if (status && status >= 500) {
    return new AppError(data?.title ?? 'Erro interno do servidor.', {
      type: 'server',
      status,
      detail: data?.detail,
    })
  }

  if ((error as AxiosError).request) {
    return new AppError('Não foi possível conectar ao sistema no momento. Tente novamente em instantes.', {
      type: 'network',
      status,
      detail: data?.detail,
    })
  }

  return new AppError(data?.title ?? 'Falha desconhecida.', {
    type: 'unknown',
    status,
    detail: data?.detail,
  })
}

export function handleHttpError(error: unknown) {
  const mapped = mapAxiosError(error)

  if (mapped.type === 'unauthorized') {
    clearPersistedSession()
    navigateTo('/login')
  }

  if (mapped.type === 'forbidden') {
    navigateTo('/erro/403')
  }

  if (mapped.type === 'notFound') {
    navigateTo('/nao-encontrado')
  }

  if (mapped.type === 'server') {
    navigateTo('/erro/500')
  }

  return Promise.reject(mapped)
}
