import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Save } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView } from 'react-native'

import { AppButton, Body, Card, ErrorMessage, FilterBar, Kicker, Screen, TextField, Title } from '@/components/ui'
import type { UserStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { createUser } from '@/services/user.service'
import { onlyDigits } from '@/utils/formatters'
import { roleOptions } from '@/utils/roles'

type Props = NativeStackScreenProps<UserStackParamList, 'UserCreate'>

export function UserCreateScreen({ navigation }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [perfil, setPerfil] = useState<1 | 2 | 3>(1)
  const [idApartamento, setIdApartamento] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !cpf.trim()) {
      setError('Preencha nome, e-mail, senha e CPF.')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await createUser({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cpf: onlyDigits(cpf),
        telefone: telefone.trim() || null,
        perfil,
        idApartamento: idApartamento.trim() ? Number(idApartamento) : null,
      })
      navigation.goBack()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <Kicker>Administração</Kicker>
          <Title>Novo usuário</Title>
          <Body>Cadastre apenas os perfis permitidos pelo seu usuário autenticado.</Body>
        </Card>
        <Card>
          <TextField label="Nome" value={nome} onChangeText={setNome} />
          <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextField label="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
          <TextField label="CPF" value={cpf} onChangeText={setCpf} keyboardType="number-pad" />
          <TextField label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextField label="ID do apartamento" value={idApartamento} onChangeText={setIdApartamento} keyboardType="number-pad" />
          <FilterBar options={roleOptions} value={perfil} onChange={setPerfil} />
          <ErrorMessage message={error} />
          <AppButton title={isSaving ? 'Salvando...' : 'Salvar usuário'} icon={Save} onPress={handleSave} disabled={isSaving} />
        </Card>
      </Screen>
    </ScrollView>
  )
}
