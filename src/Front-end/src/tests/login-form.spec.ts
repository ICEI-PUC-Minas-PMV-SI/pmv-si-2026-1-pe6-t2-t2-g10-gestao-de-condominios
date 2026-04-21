import { mount } from '@vue/test-utils'

import LoginForm from '@/components/auth/LoginForm.vue'

describe('LoginForm', () => {
  it('emite submit com email e senha preenchidos', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.get('#email').setValue('sindico@smartsindico.local')
    await wrapper.get('#senha').setValue('123456')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          email: 'sindico@smartsindico.local',
          senha: '123456',
        },
      ],
    ])
  })

  it('mostra erro local quando faltam campos', async () => {
    const wrapper = mount(LoginForm)

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Preencha e-mail e senha para entrar.')
  })
})
