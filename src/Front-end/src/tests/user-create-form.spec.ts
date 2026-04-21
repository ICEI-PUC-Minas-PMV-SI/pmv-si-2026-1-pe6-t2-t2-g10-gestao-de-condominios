import { mount } from '@vue/test-utils'

import UserCreateForm from '@/components/users/UserCreateForm.vue'

describe('UserCreateForm', () => {
  const allowedProfiles = [{ label: 'Morador', value: 1 as const, role: 'Morador' as const }]

  it('emite submit com os dados preenchidos', async () => {
    const wrapper = mount(UserCreateForm, {
      props: {
        allowedProfiles,
        apartments: [
          {
            id: 10,
            numero: '101',
            bloco: 'A',
            andar: 1,
            tipo: 'Padrão',
            ativo: true,
          },
        ],
      },
    })

    await wrapper.get('#nome').setValue('Usuário Teste')
    await wrapper.get('#email').setValue('usuario@teste.com')
    await wrapper.get('#senha').setValue('123456')
    await wrapper.get('#cpf').setValue('12345678901')
    await wrapper.get('#telefone').setValue('(31) 99999-0000')
    await wrapper.get('#apartamento').setValue('10')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          nome: 'Usuário Teste',
          email: 'usuario@teste.com',
          senha: '123456',
          cpf: '12345678901',
          telefone: '(31) 99999-0000',
          perfil: 1,
          idApartamento: 10,
        },
      ],
    ])
  })
})
