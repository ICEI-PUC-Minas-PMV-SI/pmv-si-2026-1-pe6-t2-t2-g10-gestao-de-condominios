import { AxiosError } from 'axios'

import { ApiError, getErrorMessage, normalizeHttpError } from '@/services/http/errors'

describe('http errors', () => {
  it('retorna mensagem de ApiError e Error comuns', () => {
    expect(getErrorMessage(new ApiError('Falha conhecida.'))).toBe('Falha conhecida.')
    expect(getErrorMessage(new Error('Falha inesperada.'))).toBe('Falha inesperada.')
  })

  it('retorna mensagem generica para erros desconhecidos', () => {
    expect(getErrorMessage(null)).toMatch(/opera/i)
    expect(getErrorMessage('erro solto')).toMatch(/opera/i)
  })

  it('normaliza erro que nao veio do axios', () => {
    expect(() => normalizeHttpError(new Error('fora do axios'))).toThrow(ApiError)
  })

  it('normaliza falha de conexao sem resposta HTTP', () => {
    const error = new AxiosError('Network Error')

    expect(() => normalizeHttpError(error)).toThrow(ApiError)

    try {
      normalizeHttpError(error)
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).status).toBeUndefined()
      expect((err as ApiError).message).toMatch(/API|rede|URL/i)
    }
  })

  it('prioriza primeira mensagem de validacao retornada pela API', () => {
    const error = new AxiosError('Bad Request')
    error.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: {
        title: 'Requisicao invalida',
        errors: {
          email: ['E-mail invalido.'],
          senha: ['Senha obrigatoria.'],
        },
      },
    }

    try {
      normalizeHttpError(error)
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('E-mail invalido.')
      expect((err as ApiError).status).toBe(400)
      expect((err as ApiError).validationErrors).toEqual({
        email: ['E-mail invalido.'],
        senha: ['Senha obrigatoria.'],
      })
    }
  })

  it('usa detail ou title quando a resposta nao tem erros de validacao', () => {
    const error = new AxiosError('Forbidden')
    error.response = {
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: {} as never,
      data: {
        title: 'Acesso negado',
        detail: 'Usuario sem permissao.',
      },
    }

    try {
      normalizeHttpError(error)
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('Usuario sem permissao.')
      expect((err as ApiError).status).toBe(403)
    }
  })
})
