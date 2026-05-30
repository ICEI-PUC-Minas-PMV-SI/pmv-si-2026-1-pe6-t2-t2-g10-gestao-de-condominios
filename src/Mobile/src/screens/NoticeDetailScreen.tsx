import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Megaphone, Power, Star } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

import { useAuth } from '@/auth/AuthContext'
import { AppButton, Badge, Body, Card, ErrorMessage, HighlightBadge, HighlightTitle, Kicker, LoadingMessage, Screen, Subtitle, Title } from '@/components/ui'
import type { NoticeStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { fetchNoticeById, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import type { ComunicadoResponse } from '@/types/api'
import { formatDateTime } from '@/utils/formatters'
import { canManageNotices } from '@/utils/roles'

type Props = NativeStackScreenProps<NoticeStackParamList, 'NoticeDetail'>

export function NoticeDetailScreen({ route }: Props) {
  const { usuario } = useAuth()
  const canManage = canManageNotices(usuario?.perfil ?? null)
  const [notice, setNotice] = useState<ComunicadoResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function loadNotice() {
    try {
      setIsLoading(true)
      setError(null)
      setNotice(await fetchNoticeById(route.params.id))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadNotice()
  }, [route.params.id])

  async function handleStatusChange() {
    if (!notice) {
      return
    }

    try {
      setNotice(await updateNoticeStatus(notice.id, { ativo: !notice.ativo }))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleHighlightChange() {
    if (!notice) {
      return
    }

    try {
      setNotice(await updateNoticeHighlight(notice.id, { destaque: !notice.destaque }))
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
        <ErrorMessage message={error} />
        {notice ? (
          <Card variant={notice.destaque ? 'highlight' : 'default'}>
            <Kicker>Comunicado</Kicker>
            {notice.destaque ? <HighlightBadge icon={Star} /> : <Badge tone="neutral">Aviso comum</Badge>}
            {notice.destaque ? <HighlightTitle>{notice.titulo}</HighlightTitle> : <Title>{notice.titulo}</Title>}
            <Subtitle>{notice.ativo ? 'Publicado no mural' : 'Comunicado inativo'}</Subtitle>
            <Body>{notice.conteudo}</Body>
            <Body>Autor: {notice.nomeAutor}</Body>
            <Body>Publicado em: {formatDateTime(notice.dataPublicacao)}</Body>
            <Body>Status: {notice.ativo ? 'Ativo' : 'Inativo'}</Body>
            {canManage ? (
              <>
                <AppButton
                  title={notice.destaque ? 'Remover destaque' : 'Destacar'}
                  icon={notice.destaque ? Megaphone : Star}
                  variant="secondary"
                  onPress={() => void handleHighlightChange()}
                />
                <AppButton
                  title={notice.ativo ? 'Desativar aviso' : 'Reativar aviso'}
                  icon={Power}
                  variant={notice.ativo ? 'danger' : 'secondary'}
                  onPress={() => void handleStatusChange()}
                />
              </>
            ) : null}
          </Card>
        ) : null}
      </Screen>
    </ScrollView>
  )
}
