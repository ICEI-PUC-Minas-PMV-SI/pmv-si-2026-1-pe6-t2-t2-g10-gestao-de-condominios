import { mount } from '@vue/test-utils'

import PaginationControls from '@/components/shared/PaginationControls.vue'

describe('PaginationControls', () => {
  it('mostra o intervalo atual e emite a proxima pagina', async () => {
    const wrapper = mount(PaginationControls, {
      props: {
        page: 2,
        pageSize: 10,
        totalItems: 35,
        totalPages: 4,
      },
    })

    expect(wrapper.text()).toContain('Mostrando 11 a 20 de 35 registros')

    await wrapper.findAll('button').at(-1)!.trigger('click')

    expect(wrapper.emitted('change')).toEqual([[3]])
  })

  it('nao emite alteracao quando esta carregando', async () => {
    const wrapper = mount(PaginationControls, {
      props: {
        page: 2,
        pageSize: 10,
        totalItems: 35,
        totalPages: 4,
        loading: true,
      },
    })

    await wrapper.findAll('button').at(-1)!.trigger('click')

    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
