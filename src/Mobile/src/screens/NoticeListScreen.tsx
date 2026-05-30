import { useFocusEffect } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Eye, Megaphone, Plus, Power, Star } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'

import { useAuth } from '@/auth/AuthContext'
import { AppButton, Badge, Body, Card, ErrorMessage, FilterBar, HighlightBadge, HighlightTitle, Kicker, LoadingMessage, Screen, Title } from '@/components/ui'
import type { NoticeStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import type { ComunicadoResponse, PagedResponse } from '@/types/api'
import { compactText, formatDateTime } from '@/utils/formatters'
import { canManageNotices } from '@/utils/roles'

type Props = NativeStackScreenProps<NoticeStackParamList, 'NoticeList'>
type StatusFilter = boolean | undefined

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: undefined },
  { label: 'Ativos', value: true },
  { label: 'Inativos', value: false },
]

export function NoticeListScreen({ navigation }: Props) {
  const { usuario } = useAuth()
  const canManage = canManageNotices(usuario?.perfil ?? null)
  const [notices, setNotices] = useState<PagedResponse<ComunicadoResponse> | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadNotices = useCallback(async (nextPage: number, nextStatus = statusFilter) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchNotices({ page: nextPage, pageSize: 8, ativo: nextStatus })
      setNotices(response)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  useFocusEffect(useCallback(() => {
    void loadNotices(1)
  }, [loadNotices]))

  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value)
    void loadNotices(1, value)
  }

  async function handleStatusChange(notice: ComunicadoResponse) {
    try {
      await updateNoticeStatus(notice.id, { ativo: !notice.ativo })
      await loadNotices(notices?.page ?? 1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  async function handleHighlightChange(notice: ComunicadoResponse) {
    try {
      await updateNoticeHighlight(notice.id, { destaque: !notice.destaque })
      await loadNotices(notices?.page ?? 1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={notices?.items ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        ListHeaderComponent={(
          <View style={{ gap: 12 }}>
            <Card>
              <Kicker>Comunicação</Kicker>
              <Title>Mural de avisos</Title>
              <Body>Comunicados oficiais com filtros, destaque e status.</Body>
            </Card>
            <FilterBar options={statusOptions} value={statusFilter} onChange={handleFilterChange} />
            {canManage ? (
              <AppButton title="Criar aviso" icon={Plus} variant="secondary" onPress={() => navigation.navigate('NoticeCreate')} />
            ) : null}
            <ErrorMessage message={error} />
            {isLoading && !notices ? <LoadingMessage /> : null}
          </View>
        )}
        renderItem={({ item }) => (
          <Card variant={item.destaque ? 'highlight' : 'default'}>
            {item.destaque ? (
              <HighlightBadge icon={Star} />
            ) : (
              <Badge tone={item.ativo ? 'success' : 'danger'}>{item.ativo ? 'Ativo' : 'Inativo'}</Badge>
            )}
            {item.destaque ? <HighlightTitle>{item.titulo}</HighlightTitle> : <Title>{item.titulo}</Title>}
            <Body>{compactText(item.conteudo)}</Body>
            <Body>{item.nomeAutor} · {formatDateTime(item.dataPublicacao)} · {item.ativo ? 'Ativo' : 'Inativo'}</Body>
            <AppButton title="Abrir aviso" icon={Eye} onPress={() => navigation.navigate('NoticeDetail', { id: item.id })} />
            {canManage ? (
              <>
                <AppButton
                  title={item.destaque ? 'Remover destaque' : 'Destacar'}
                  icon={item.destaque ? Megaphone : Star}
                  variant="secondary"
                  onPress={() => void handleHighlightChange(item)}
                />
                <AppButton
                  title={item.ativo ? 'Desativar' : 'Reativar'}
                  icon={Power}
                  variant={item.ativo ? 'danger' : 'secondary'}
                  onPress={() => void handleStatusChange(item)}
                />
              </>
            ) : null}
          </Card>
        )}
        ListEmptyComponent={!isLoading ? <Body>Nenhum aviso encontrado.</Body> : null}
        ListFooterComponent={notices ? (
          <Card>
            <Body>Página {notices.page} de {notices.totalPages || 1} · {notices.totalItems} registros</Body>
            <AppButton
              title="Página anterior"
              variant="secondary"
              disabled={notices.page <= 1}
              onPress={() => void loadNotices(notices.page - 1)}
            />
            <AppButton
              title="Próxima página"
              variant="secondary"
              disabled={notices.page >= notices.totalPages}
              onPress={() => void loadNotices(notices.page + 1)}
            />
          </Card>
        ) : null}
      />
    </Screen>
  )
}
