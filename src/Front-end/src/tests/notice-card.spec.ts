import { mount } from '@vue/test-utils'

import NoticeCard from '@/components/notices/NoticeCard.vue'

const baseNotice = {
  id: 4,
  idAutor: 1,
  nomeAutor: 'Sindico',
  titulo: 'Aviso importante',
  conteudo: 'Conteudo do aviso',
  dataPublicacao: '2026-01-01T00:00:00Z',
  ativo: true,
  destaque: false,
}

describe('NoticeCard', () => {
  it('mostra acoes de gestao para comunicado ativo', async () => {
    const wrapper = mount(NoticeCard, {
      props: {
        notice: baseNotice,
        canManage: true,
      },
    })

    expect(wrapper.text()).toContain('Definir destaque')
    expect(wrapper.text()).toContain('Desativar')

    await wrapper.get('button:nth-of-type(1)').trigger('click')
    await wrapper.get('button:nth-of-type(2)').trigger('click')

    expect(wrapper.emitted('setHighlight')).toEqual([[4]])
    expect(wrapper.emitted('archive')).toEqual([[4]])
  })

  it('mostra reativar para comunicado inativo', async () => {
    const wrapper = mount(NoticeCard, {
      props: {
        notice: { ...baseNotice, ativo: false },
        canManage: true,
      },
    })

    expect(wrapper.text()).toContain('Inativo')
    expect(wrapper.text()).toContain('Reativar')
    expect(wrapper.text()).not.toContain('Desativar')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('activate')).toEqual([[4]])
  })

  it('oculta acoes administrativas quando usuario nao pode gerenciar', () => {
    const wrapper = mount(NoticeCard, {
      props: {
        notice: baseNotice,
        canManage: false,
      },
    })

    expect(wrapper.text()).not.toContain('Definir destaque')
    expect(wrapper.text()).not.toContain('Desativar')
  })
})
