import { mount } from '@vue/test-utils'

import UserList from '@/components/users/UserList.vue'

describe('UserList', () => {
  const users = [
    {
      id: 1,
      nome: 'Morador Teste',
      email: 'morador@teste.com',
      cpf: '12345678901',
      telefone: null,
      perfil: 'Morador' as const,
      idApartamento: 101,
      ativo: true,
      dataCriacao: '2025-01-01T00:00:00Z',
      dataUltimoLogin: null,
    },
  ]

  it('permite selecionar o usuário clicando na linha', async () => {
    const wrapper = mount(UserList, {
      props: {
        users,
        selectedUserId: null,
      },
    })

    await wrapper.get('tbody tr').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[users[0]]])
  })
})
