import { mount } from '@vue/test-utils'

import NoticeCreateForm from '@/components/notices/NoticeCreateForm.vue'

describe('NoticeCreateForm', () => {
  it('emite submit quando título e conteúdo estão válidos', async () => {
    const wrapper = mount(NoticeCreateForm)

    await wrapper.get('#titulo').setValue('Nova portaria')
    await wrapper.get('#conteudo').setValue('Horario especial neste feriado.')
    await wrapper.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          titulo: 'Nova portaria',
          conteudo: 'Horario especial neste feriado.',
          destaque: true,
        },
      ],
    ])
  })

  it('mostra erro local quando faltam dados obrigatórios', async () => {
    const wrapper = mount(NoticeCreateForm)

    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Preencha título e conteúdo do aviso.')
  })
})
