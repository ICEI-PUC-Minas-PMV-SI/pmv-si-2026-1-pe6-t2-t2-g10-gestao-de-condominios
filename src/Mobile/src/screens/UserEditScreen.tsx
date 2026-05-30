import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Power, Save } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import { AppButton, Badge, Body, Card, ErrorMessage, FilterBar, Kicker, LoadingMessage, Screen, SuccessMessage, TextField, Title } from '@/components/ui'
import type { UserStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { fetchUserById, updateUser, updateUserStatus } from '@/services/user.service'
import type { UsuarioResponse } from '@/types/api'
import { formatDateTime } from '@/utils/formatters'
import { roleOptions, roleToNumber } from '@/utils/roles'

type Props = NativeStackScreenProps<UserStackParamList, 'UserEdit'>

export function UserEditScreen({ route }: Props) {
  const [user, setUser] = useState<UsuarioResponse | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [perfil, setPerfil] = useState<1 | 2 | 3>(1)
  const [idApartamento, setIdApartamento] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  async function loadUser() {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchUserById(route.params.id)
      setUser(response)
      setNome(response.nome)
      setEmail(response.email)
      setTelefone(response.telefone ?? '')
      setPerfil(roleToNumber(response.perfil))
      setIdApartamento(response.idApartamento ? String(response.idApartamento) : '')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadUser()
  }, [route.params.id])

  async function handleSave() {
    if (!user) {
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      const updated = await updateUser(user.id, {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim() || null,
        telefone: telefone.trim() || null,
        perfil,
        idApartamento: idApartamento.trim() ? Number(idApartamento) : null,
        ativo: user.ativo,
      })
      setUser(updated)
      setSenha('')
      setSuccess('Usuário atualizado com sucesso.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatusChange() {
    if (!user) {
      return
    }

    try {
      setError(null)
      const updated = await updateUserStatus(user.id, { ativo: !user.ativo })
      setUser(updated)
      setSuccess(updated.ativo ? 'Usuário ativado.' : 'Usuário desativado.')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (isLoading) {
    return <LoadingMessage />
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <Kicker>Administração</Kicker>
          <Title>Editar usuário</Title>
          <Body>Atualize dados cadastrais, perfil e status do usuário.</Body>
        </Card>
        <Card>
          <TextField label="Nome" value={nome} onChangeText={setNome} />
          <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextField label="Nova senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Opcional" />
          <TextField label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextField label="ID do apartamento" value={idApartamento} onChangeText={setIdApartamento} keyboardType="number-pad" />
          <FilterBar options={roleOptions} value={perfil} onChange={setPerfil} />
          <Badge tone={user?.ativo ? 'success' : 'danger'}>{user?.ativo ? 'Ativo' : 'Inativo'}</Badge>
          <Body>Criado em: {formatDateTime(user?.dataCriacao ?? null)}</Body>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <AppButton title={isSaving ? 'Salvando...' : 'Salvar alterações'} icon={Save} onPress={handleSave} disabled={isSaving} />
          <AppButton
            title={user?.ativo ? 'Desativar usuário' : 'Ativar usuário'}
            icon={Power}
            variant={user?.ativo ? 'danger' : 'secondary'}
            onPress={() => void handleStatusChange()}
          />
        </Card>
      </Screen>
    </ScrollView>
  )
}
