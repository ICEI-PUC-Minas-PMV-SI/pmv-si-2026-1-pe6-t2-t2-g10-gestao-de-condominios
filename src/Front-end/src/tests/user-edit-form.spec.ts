import { mount } from '@vue/test-utils'

import UserEditForm from '@/components/users/UserEditForm.vue'

describe('UserEditForm', () => {
  it('emite submit com os dados editáveis e mantém o CPF apenas como leitura', async () => {
    const wrapper = mount(UserEditForm, {
      props: {
        user: {
          id: 7,
          nome: 'Usuário Teste',
          email: 'usuario@teste.com',
          cpf: '12345678901',
          telefone: '(31) 99999-0000',
          perfil: 'Morador',
          idApartamento: 10,
          ativo: true,
          dataCriacao: '2025-01-01T00:00:00Z',
          dataUltimoLogin: '2025-01-02T00:00:00Z',
        },
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
        allowedProfiles: [{ label: 'Morador', value: 1 as const, role: 'Morador' as const }],
        permissions: {
          canEditNome: true,
          canEditEmail: true,
          canEditTelefone: true,
          canEditSenha: true,
          canEditPerfil: false,
          canEditApartamento: false,
          canEditAtivo: false,
        },
      },
    })

    expect(wrapper.text()).toContain('12345678901')

    await wrapper.get('#edit-nome').setValue('Usuário Atualizado')
    await wrapper.get('#edit-email').setValue('novo@teste.com')
    await wrapper.get('#edit-telefone').setValue('(31) 98888-0000')
    await wrapper.get('#edit-senha').setValue('654321')
    await wrapper.get('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toEqual([
      [
        {
          nome: 'Usuário Atualizado',
          email: 'novo@teste.com',
          senha: '654321',
          telefone: '(31) 98888-0000',
          perfil: 1,
          idApartamento: 10,
          ativo: true,
        },
      ],
    ])
  })

  it('mostra o campo de apartamento para um morador editável', () => {
    const wrapper = mount(UserEditForm, {
      props: {
        user: {
          id: 7,
          nome: 'Usuário Teste',
          email: 'usuario@teste.com',
          cpf: '12345678901',
          telefone: '(31) 99999-0000',
          perfil: 'Morador',
          idApartamento: 10,
          ativo: true,
          dataCriacao: '2025-01-01T00:00:00Z',
          dataUltimoLogin: '2025-01-02T00:00:00Z',
        },
        apartments: [],
        allowedProfiles: [{ label: 'Morador', value: 1 as const, role: 'Morador' as const }],
        permissions: {
          canEditNome: true,
          canEditEmail: true,
          canEditTelefone: true,
          canEditSenha: true,
          canEditPerfil: true,
          canEditApartamento: true,
          canEditAtivo: true,
        },
      },
    })

    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.text()).toContain('Não há apartamentos disponíveis para vincular no momento.')
  })
})
