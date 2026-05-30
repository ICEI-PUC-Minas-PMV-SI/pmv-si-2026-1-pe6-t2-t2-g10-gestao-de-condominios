import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Send } from 'lucide-react-native'
import { useState } from 'react'
import { ScrollView, Switch, Text, View } from 'react-native'

import { AppButton, Body, Card, ErrorMessage, Kicker, Screen, TextField, Title } from '@/components/ui'
import type { NoticeStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { createNotice } from '@/services/notice.service'

type Props = NativeStackScreenProps<NoticeStackParamList, 'NoticeCreate'>

export function NoticeCreateScreen({ navigation }: Props) {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [destaque, setDestaque] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (!titulo.trim() || !conteudo.trim()) {
      setError('Preencha título e conteúdo do aviso.')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      const notice = await createNotice({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        destaque,
      })
      navigation.replace('NoticeDetail', { id: notice.id })
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
          <Kicker>Comunicação</Kicker>
          <Title>Novo aviso</Title>
          <Body>Publique comunicados oficiais para os usuários autenticados.</Body>
        </Card>
        <Card>
          <TextField label="Título" value={titulo} onChangeText={setTitulo} />
          <TextField label="Conteúdo" value={conteudo} onChangeText={setConteudo} multiline />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text>Destaque no mural</Text>
            <Switch value={destaque} onValueChange={setDestaque} />
          </View>
          <ErrorMessage message={error} />
          <AppButton title={isSaving ? 'Publicando...' : 'Publicar aviso'} icon={Send} onPress={handleSave} disabled={isSaving} />
        </Card>
      </Screen>
    </ScrollView>
  )
}
