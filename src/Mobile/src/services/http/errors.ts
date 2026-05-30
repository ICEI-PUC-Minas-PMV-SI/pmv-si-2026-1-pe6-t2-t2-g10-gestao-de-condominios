import axios from 'axios'

import type { ProblemDetails, ValidationProblemDetails } from '@/types/api'

export class ApiError extends Error {
  readonly status?: number
  readonly validationErrors?: Record<string, string[]>

  constructor(message: string, status?: number, validationErrors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.validationErrors = validationErrors
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Não foi possível concluir a operação.'
}

export function normalizeHttpError(error: unknown): never {
  if (!axios.isAxiosError(error)) {
    throw new ApiError('Erro inesperado ao processar a resposta.')
  }

  if (!error.response) {
    throw new ApiError('Não foi possível conectar à API. Verifique a rede e a URL configurada.')
  }

  const data = error.response.data as ProblemDetails | ValidationProblemDetails | undefined
  const validationErrors = 'errors' in (data ?? {}) ? (data as ValidationProblemDetails).errors : undefined
  const firstValidationMessage = validationErrors
    ? Object.values(validationErrors).flat()[0]
    : undefined

  throw new ApiError(
    firstValidationMessage ?? data?.detail ?? data?.title ?? 'A API recusou a solicitação.',
    error.response.status,
    validationErrors,
  )
}
