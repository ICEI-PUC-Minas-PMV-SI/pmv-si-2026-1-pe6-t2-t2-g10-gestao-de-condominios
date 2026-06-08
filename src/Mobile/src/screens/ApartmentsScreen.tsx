import React, { useEffect, useState } from 'react'
import { FlatList, View, Modal, ScrollView } from 'react-native'
import { Edit3, Plus, Power, Save } from 'lucide-react-native'

import { apartmentService } from '@/services/apartment.service'
import {
  AppButton,
  Badge,
  Body,
  Card,
  ErrorMessage,
  Kicker,
  LoadingMessage,
  Screen,
  TextField,
  Title,
  Subtitle,
} from '@/components/ui'
import { useTheme } from '@/theme/ThemeContext'

interface ApartamentoResponse {
  id: number
  numero: string
  bloco: string
  andar: number
  tipo: string
  ativo: boolean
}

export function ApartmentsScreen() {
  const { theme } = useTheme()
  const [apartamentos, setApartamentos] = useState<ApartamentoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalCadastro, setModalCadastro] = useState(false)
  const [modalEdicao, setModalEdicao] = useState(false)
  const [apEditando, setApEditando] = useState<ApartamentoResponse | null>(null)
  const [salvando, setSalvando] = useState(false)

  // Estados dos formulários
  const [numero, setNumero] = useState('')
  const [bloco, setBloco] = useState('')
  const [andar, setAndar] = useState('1')
  const [tipo, setTipo] = useState('')

  const [numEdicao, setNumEdicao] = useState('')
  const [blocoEdicao, setBlocoEdicao] = useState('')
  const [andarEdicao, setAndarEdicao] = useState('1')
  const [tipoEdicao, setTipoEdicao] = useState('')

  const carregar = async () => {
    setCarregando(true)
    setError(null)
    try {
      const res = await apartmentService.getAll()
      setApartamentos(Array.isArray(res) ? res : (res.data ?? []))
    } catch {
      setError('Erro ao carregar apartamentos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  const salvar = async () => {
    if (!numero.trim() || !bloco.trim() || !tipo.trim()) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    setError(null)
    try {
      await apartmentService.create({
        numero: numero.trim(),
        bloco: bloco.trim(),
        andar: parseInt(andar) || 1,
        tipo: tipo.trim(),
      })
      setModalCadastro(false)
      setNumero('')
      setBloco('')
      setAndar('1')
      setTipo('')
      await carregar()
    } catch {
      setError('Erro ao cadastrar apartamento.')
    } finally {
      setSalvando(false)
    }
  }

  const abrirEdicao = (ap: ApartamentoResponse) => {
    setApEditando(ap)
    setNumEdicao(ap.numero)
    setBlocoEdicao(ap.bloco)
    setAndarEdicao(String(ap.andar))
    setTipoEdicao(ap.tipo)
    setModalEdicao(true)
  }

  const salvarEdicao = async () => {
    if (!apEditando) return
    if (!numEdicao.trim() || !blocoEdicao.trim() || !tipoEdicao.trim()) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    setError(null)
    try {
      await apartmentService.update(apEditando.id, {
        numero: numEdicao.trim(),
        bloco: blocoEdicao.trim(),
        andar: parseInt(andarEdicao) || 1,
        tipo: tipoEdicao.trim(),
      })
      setModalEdicao(false)
      await carregar()
    } catch {
      setError('Erro ao atualizar apartamento.')
    } finally {
      setSalvando(false)
    }
  }

  const alterarStatus = async (ap: ApartamentoResponse) => {
    setError(null)
    try {
      if (ap.ativo) {
        await apartmentService.desativar(ap.id)
      } else {
        await apartmentService.reativar(ap.id)
      }
      await carregar()
    } catch {
      setError('Erro ao alterar status do apartamento.')
    }
  }

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={apartamentos}
        keyExtractor={ap => String(ap.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Card>
              <Kicker>Moradia</Kicker>
              <Title>Apartamentos</Title>
              <Body>Consulte e gerencie as unidades habitacionais e blocos.</Body>
            </Card>
            <AppButton
              title="Novo Apartamento"
              icon={Plus}
              variant="secondary"
              onPress={() => {
                setError(null)
                setModalCadastro(true)
              }}
            />
            <ErrorMessage message={error} />
            {carregando && apartamentos.length === 0 ? <LoadingMessage /> : null}
          </View>
        }
        renderItem={({ item: ap }) => (
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <Subtitle>Ap {ap.numero} - Bloco {ap.bloco}</Subtitle>
              <Badge tone={ap.ativo ? 'success' : 'danger'}>
                {ap.ativo ? 'ATIVO' : 'INATIVO'}
              </Badge>
            </View>
            <Body>Andar: {ap.andar}º · Tipo: {ap.tipo}</Body>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <AppButton
                title="Editar"
                icon={Edit3}
                variant="secondary"
                onPress={() => {
                  setError(null)
                  abrirEdicao(ap)
                }}
              />
              <AppButton
                title={ap.ativo ? 'Inativar' : 'Reativar'}
                icon={Power}
                variant={ap.ativo ? 'danger' : 'secondary'}
                onPress={() => void alterarStatus(ap)}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !carregando ? (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Body>Nenhum apartamento cadastrado.</Body>
            </View>
          ) : null
        }
      />

      {/* Modal Cadastro */}
      <Modal visible={modalCadastro} animationType="slide" onRequestClose={() => setModalCadastro(false)}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.appBg, padding: 16 }}>
          <View style={{ gap: 16, marginTop: 40 }}>
            <Card>
              <Kicker>Moradia</Kicker>
              <Title>Novo Apartamento</Title>
              <Body>Cadastre uma nova unidade preenchendo as informações abaixo.</Body>
            </Card>
            <Card>
              <TextField label="Número (ex: 101)" value={numero} onChangeText={setNumero} keyboardType="number-pad" />
              <TextField label="Bloco (ex: A)" value={bloco} onChangeText={(text) => setBloco(text.toUpperCase())} />
              <TextField label="Andar" value={andar} onChangeText={setAndar} keyboardType="number-pad" />
              <TextField label="Tipo (ex: 2 quartos)" value={tipo} onChangeText={setTipo} />
              <ErrorMessage message={error} />
              <AppButton
                title={salvando ? 'Salvando...' : 'Salvar'}
                icon={Save}
                onPress={salvar}
                disabled={salvando}
              />
              <AppButton
                title="Cancelar"
                variant="secondary"
                onPress={() => setModalCadastro(false)}
              />
            </Card>
          </View>
        </ScrollView>
      </Modal>

      {/* Modal Edição */}
      <Modal visible={modalEdicao} animationType="slide" onRequestClose={() => setModalEdicao(false)}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.appBg, padding: 16 }}>
          <View style={{ gap: 16, marginTop: 40 }}>
            <Card>
              <Kicker>Moradia</Kicker>
              <Title>Editar Apartamento</Title>
              <Body>Altere as informações necessárias da unidade.</Body>
            </Card>
            <Card>
              <TextField label="Número" value={numEdicao} onChangeText={setNumEdicao} keyboardType="number-pad" />
              <TextField label="Bloco" value={blocoEdicao} onChangeText={(text) => setBlocoEdicao(text.toUpperCase())} />
              <TextField label="Andar" value={andarEdicao} onChangeText={setAndarEdicao} keyboardType="number-pad" />
              <TextField label="Tipo" value={tipoEdicao} onChangeText={setTipoEdicao} />
              <ErrorMessage message={error} />
              <AppButton
                title={salvando ? 'Salvando...' : 'Salvar'}
                icon={Save}
                onPress={salvarEdicao}
                disabled={salvando}
              />
              <AppButton
                title="Cancelar"
                variant="secondary"
                onPress={() => setModalEdicao(false)}
              />
            </Card>
          </View>
        </ScrollView>
      </Modal>
    </Screen>
  )
}