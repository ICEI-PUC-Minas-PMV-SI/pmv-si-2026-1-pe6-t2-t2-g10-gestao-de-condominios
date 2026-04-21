import { flushPromises, mount } from '@vue/test-utils'

import LoginView from '@/views/LoginView.vue'
import { AppError } from '@/services/http/errors'

const pushMock = vi.fn()
const signInMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useRoute: () => ({
    query: {},
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    signIn: signInMock,
  }),
}))

describe('LoginView', () => {
  beforeEach(() => {
    pushMock.mockReset()
    signInMock.mockReset()
  })

  it('mostra mensagem clara quando as credenciais são inválidas', async () => {
    signInMock.mockRejectedValue(
      new AppError('Sessão expirada ou acesso não autorizado.', {
        type: 'unauthorized',
        status: 401,
      }),
    )

    const wrapper = mount(LoginView)

    await wrapper.get('#email').setValue('usuario@empresa.com')
    await wrapper.get('#senha').setValue('senha-incorreta')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('E-mail ou senha inválidos. Verifique os dados e tente novamente.')
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('mostra mensagem amigável quando o sistema está indisponível', async () => {
    signInMock.mockRejectedValue(
      new AppError('Não foi possível conectar ao sistema no momento. Tente novamente em instantes.', {
        type: 'network',
      }),
    )

    const wrapper = mount(LoginView)

    await wrapper.get('#email').setValue('usuario@empresa.com')
    await wrapper.get('#senha').setValue('123456')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Não foi possível acessar o sistema agora. Verifique sua conexão ou tente novamente em instantes.')
    expect(pushMock).not.toHaveBeenCalled()
  })
})
