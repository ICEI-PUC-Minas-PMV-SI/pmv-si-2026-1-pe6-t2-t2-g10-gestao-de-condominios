import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import { useAuth } from '@/auth/AuthContext'
import { AppButton, Body, Card, ErrorMessage, Kicker, LoadingMessage, Screen, SuccessMessage, TextField, Title } from '@/components/ui'
import { getErrorMessage } from '@/services/http/errors'
import { fetchUserById, updateUser } from '@/services/user.service'
import { ThemeToggle } from '@/theme/ThemeContext'
import type { UsuarioResponse } from '@/types/api'
import { formatDateTime } from '@/utils/formatters'
import { roleToNumber } from '@/utils/roles'

export function ProfileScreen() {
  const { usuario, signOut, syncProfile } = useAuth()
  const [profile, setProfile] = useState<UsuarioResponse | null>(null)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      if (!usuario) {
        return
      }

      try {
        setIsLoading(true)
        const response = await fetchUserById(usuario.id)
        setProfile(response)
        setNome(response.nome)
        setEmail(response.email)
        setTelefone(response.telefone ?? '')
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [usuario])

  async function handleSave() {
    if (!profile) {
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(null)
      const updated = await updateUser(profile.id, {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim() || null,
        telefone: telefone.trim() || null,
        perfil: roleToNumber(profile.perfil),
        idApartamento: profile.idApartamento,
        ativo: profile.ativo,
      })
      setProfile(updated)
      setSenha('')
      await syncProfile(updated)
      setSuccess('Perfil atualizado com sucesso.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <LoadingMessage />
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <Kicker>Conta</Kicker>
          <Title>Perfil</Title>
          <Body>Mantenha seus dados de acesso e contato atualizados.</Body>
          <ThemeToggle />
        </Card>
        <Card>
          <TextField label="Nome" value={nome} onChangeText={setNome} />
          <TextField label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextField label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextField label="Nova senha" value={senha} onChangeText={setSenha} secureTextEntry placeholder="Opcional" />
          <Body>Último login: {formatDateTime(profile?.dataUltimoLogin ?? null)}</Body>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <AppButton title={isSaving ? 'Salvando...' : 'Salvar perfil'} onPress={handleSave} disabled={isSaving} />
          <AppButton title="Sair" variant="danger" onPress={() => void signOut()} />
        </Card>
      </Screen>
    </ScrollView>
  )
}
