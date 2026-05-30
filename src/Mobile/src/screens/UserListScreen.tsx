import { useFocusEffect } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Edit3, Plus, Power, Search } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { FlatList, View } from 'react-native'

import { AppButton, Badge, Body, Card, ErrorMessage, FilterBar, Kicker, LoadingMessage, Screen, TextField, Title } from '@/components/ui'
import type { UserStackParamList } from '@/navigation/types'
import { getErrorMessage } from '@/services/http/errors'
import { fetchUsers, updateUserStatus } from '@/services/user.service'
import type { PagedResponse, UsuarioResponse } from '@/types/api'

type Props = NativeStackScreenProps<UserStackParamList, 'UserList'>
type StatusFilter = boolean | undefined

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Todos', value: undefined },
  { label: 'Ativos', value: true },
  { label: 'Inativos', value: false },
]

export function UserListScreen({ navigation }: Props) {
  const [users, setUsers] = useState<PagedResponse<UsuarioResponse> | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadUsers = useCallback(async (nextPage: number, nextSearch = search, nextStatus = statusFilter) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetchUsers({
        page: nextPage,
        pageSize: 8,
        search: nextSearch.trim() || undefined,
        ativo: nextStatus,
      })
      setUsers(response)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter])

  useFocusEffect(useCallback(() => {
    void loadUsers(1)
  }, [loadUsers]))

  async function handleStatusChange(user: UsuarioResponse) {
    try {
      await updateUserStatus(user.id, { ativo: !user.ativo })
      await loadUsers(users?.page ?? 1)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  function handleSearch() {
    void loadUsers(1, search, statusFilter)
  }

  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value)
    void loadUsers(1, search, value)
  }

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={users?.items ?? []}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        ListHeaderComponent={(
          <View style={{ gap: 12 }}>
            <Card>
              <Kicker>Administração</Kicker>
              <Title>Usuários</Title>
              <Body>Gerencie cadastros com busca, status e paginação.</Body>
            </Card>
            <TextField label="Buscar" value={search} onChangeText={setSearch} placeholder="Nome ou e-mail" />
            <AppButton title="Buscar usuários" icon={Search} onPress={handleSearch} />
            <FilterBar options={statusOptions} value={statusFilter} onChange={handleFilterChange} />
            <AppButton title="Cadastrar usuário" icon={Plus} variant="secondary" onPress={() => navigation.navigate('UserCreate')} />
            <ErrorMessage message={error} />
            {isLoading && !users ? <LoadingMessage /> : null}
          </View>
        )}
        renderItem={({ item }) => (
          <Card>
            <Body>{item.nome}</Body>
            <Body>{item.email}</Body>
            <Badge tone={item.ativo ? 'success' : 'danger'}>{item.perfil} · {item.ativo ? 'Ativo' : 'Inativo'}</Badge>
            <AppButton title="Editar" icon={Edit3} onPress={() => navigation.navigate('UserEdit', { id: item.id })} />
            <AppButton
              title={item.ativo ? 'Desativar' : 'Ativar'}
              icon={Power}
              variant={item.ativo ? 'danger' : 'secondary'}
              onPress={() => void handleStatusChange(item)}
            />
          </Card>
        )}
        ListEmptyComponent={!isLoading ? <Body>Nenhum usuário encontrado.</Body> : null}
        ListFooterComponent={users ? (
          <Card>
            <Body>Página {users.page} de {users.totalPages || 1} · {users.totalItems} registros</Body>
            <AppButton
              title="Página anterior"
              variant="secondary"
              disabled={users.page <= 1}
              onPress={() => void loadUsers(users.page - 1)}
            />
            <AppButton
              title="Próxima página"
              variant="secondary"
              disabled={users.page >= users.totalPages}
              onPress={() => void loadUsers(users.page + 1)}
            />
          </Card>
        ) : null}
      />
    </Screen>
  )
}
