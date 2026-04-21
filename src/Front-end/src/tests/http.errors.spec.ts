import axios from 'axios'

import { AppError, handleHttpError, mapAxiosError } from '@/services/http/errors'
import * as navigation from '@/services/navigation'

describe('http error helpers', () => {
  it('mapeia validation problem details', () => {
    const error = new axios.AxiosError(
      'Bad Request',
      undefined,
      undefined,
      undefined,
      {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {} as never,
        data: {
          title: 'Falha de validacao.',
          errors: {
            titulo: ['Titulo e obrigatorio.'],
          },
        },
      },
    )

    const mapped = mapAxiosError(error)

    expect(mapped).toBeInstanceOf(AppError)
    expect(mapped.type).toBe('validation')
    expect(mapped.fieldErrors?.titulo[0]).toBe('Titulo e obrigatorio.')
  })

  it('redireciona para 403 quando a API nega acesso', async () => {
    const navigateSpy = vi.spyOn(navigation, 'navigateTo').mockImplementation(() => undefined)
    const error = new axios.AxiosError(
      'Forbidden',
      undefined,
      undefined,
      undefined,
      {
        status: 403,
        statusText: 'Forbidden',
        headers: {},
        config: {} as never,
        data: {
          title: 'Nao autorizado.',
        },
      },
    )

    await expect(handleHttpError(error)).rejects.toMatchObject({ type: 'forbidden' })
    expect(navigateSpy).toHaveBeenCalledWith('/erro/403')
  })

  it('mapeia erro de rede com mensagem amigável', () => {
    const error = new axios.AxiosError('Network Error')
    error.request = {} as never

    const mapped = mapAxiosError(error)

    expect(mapped).toBeInstanceOf(AppError)
    expect(mapped.type).toBe('network')
    expect(mapped.message).toBe('Não foi possível conectar ao sistema no momento. Tente novamente em instantes.')
  })
})
