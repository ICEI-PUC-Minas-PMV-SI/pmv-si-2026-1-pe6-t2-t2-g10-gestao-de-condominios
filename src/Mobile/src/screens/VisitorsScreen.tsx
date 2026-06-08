import React, { useEffect, useState } from 'react'
import { FlatList, View, Modal, ScrollView, TouchableOpacity, Text } from 'react-native'
import { Edit3, Plus, Power, Save, History } from 'lucide-react-native'

import { visitorService } from '@/services/visitor.service'
import { apartmentService } from '@/services/apartment.service'
import { accessService } from '@/services/access.service'
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

interface AcessoVisitanteResponse {
  id: number
  dataHoraEntrada: string
  dataHoraSaida?: string
  visitante?: {
    nome: string
    cpf: { value: string }
  }
}

export function VisitorsScreen() {
  const { theme } = useTheme()
  const [visitantes, setVisitantes] = useState<any[]>([])
  const [apartamentos, setApartamentos] = useState<ApartamentoResponse[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [modalCadastro, setModalCadastro] = useState(false)
  const [modalEdicao, setModalEdicao] = useState(false)
  const [modalAcessos, setModalAcessos] = useState(false)

  const [visitanteEditando, setVisitanteEditando] = useState<any>(null)
  const [acessos, setAcessos] = useState<AcessoVisitanteResponse[]>([])
  const [carregandoAcessos, setCarregandoAcessos] = useState(false)

  // Cadastro Form
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacao, setObservacao] = useState('')
  const [idApartamento, setIdApartamento] = useState<number>(0)

  // Edição Form
  const [nomeEdicao, setNomeEdicao] = useState('')
  const [telEdicao, setTelEdicao] = useState('')
  const [obsEdicao, setObsEdicao] = useState('')
  const [idApEdicao, setIdApEdicao] = useState<number>(0)

  const [salvando, setSalvando] = useState(false)

  const carregar = async () => {
    setCarregando(true)
    setError(null)
    try {
      const [resV, resA] = await Promise.all([visitorService.getAll(), apartmentService.getAll()])
      setVisitantes(Array.isArray(resV) ? resV : (resV.data ?? []))
      setApartamentos(Array.isArray(resA) ? resA : (resA.data ?? []))
    } catch {
      setError('Erro ao carregar visitantes e apartamentos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregar()
  }, [])

  const filtrados = visitantes.filter(v =>
    busca === '' || v.cpf?.value?.includes(busca.replace(/\D/g, ''))
  )

  const salvar = async () => {
    if (!nome.trim() || !cpf.trim() || idApartamento === 0) {
      setError('Preencha os campos obrigatórios (Nome, CPF e Apartamento).')
      return
    }
    setSalvando(true)
    setError(null)
    try {
      await visitorService.create({
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        telefone: telefone.trim(),
        observacao: observacao.trim(),
        idApartamento,
      })
      setModalCadastro(false)
      setNome('')
      setCpf('')
      setTelefone('')
      setObservacao('')
      setIdApartamento(0)
      await carregar()
    } catch {
      setError('Erro ao cadastrar visitante.')
    } finally {
      setSalvando(false)
    }
  }

  const abrirEdicao = (v: any) => {
    setVisitanteEditando(v)
    setNomeEdicao(v.nome)
    setTelEdicao(v.telefone ?? '')
    setObsEdicao(v.observacao ?? '')
    setIdApEdicao(v.idApartamento)
    setModalEdicao(true)
  }

  const salvarEdicao = async () => {
    if (!nomeEdicao.trim()) {
      setError('O campo Nome é obrigatório.')
      return
    }
    setSalvando(true)
    setError(null)
    try {
      await visitorService.update(visitanteEditando.cpf.value, {
        nome: nomeEdicao.trim(),
        telefone: telEdicao.trim(),
        observacao: obsEdicao.trim(),
        idApartamento: idApEdicao,
      })
      setModalEdicao(false)
      await carregar()
    } catch {
      setError('Erro ao atualizar visitante.')
    } finally {
      setSalvando(false)
    }
  }

  const alterarStatus = async (v: any) => {
    try {
      if (v.ativo) {
        await visitorService.desativar(v.cpf.value)
      } else {
        await visitorService.reativar(v.cpf.value)
      }
      await carregar()
    } catch {
      setError('Erro ao alterar status do visitante.')
    }
  }

  const verAcessos = async (v: any) => {
    setVisitanteEditando(v)
    setModalAcessos(true)
    setCarregandoAcessos(true)
    try {
      const res = await accessService.getAcessosPorCpf(v.cpf.value)
      setAcessos(Array.isArray(res) ? res : (res.data ?? []))
    } catch {
      setError('Erro ao carregar histórico de acessos.')
    } finally {
      setCarregandoAcessos(false)
    }
  }

  const formatarData = (d: string) => new Date(d).toLocaleString('pt-BR')

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={filtrados}
        keyExtractor={v => String(v.id)}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Card>
              <Kicker>Operação</Kicker>
              <Title>Visitantes</Title>
              <Body>Cadastre e acompanhe visitantes autorizados no condomínio.</Body>
            </Card>
            <TextField
              label="Buscar por CPF"
              placeholder="Digite o CPF para filtrar"
              value={busca}
              onChangeText={setBusca}
              keyboardType="number-pad"
            />
            <AppButton
              title="Novo Visitante"
              icon={Plus}
              variant="secondary"
              onPress={() => {
                setError(null)
                setModalCadastro(true)
              }}
            />
            <ErrorMessage message={error} />
            {carregando && visitantes.length === 0 ? <LoadingMessage /> : null}
          </View>
        }
        renderItem={({ item: v }) => (
          <Card>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <TouchableOpacity onPress={() => void verAcessos(v)}>
                <Text style={{ color: theme.colors.brand, fontSize: 16, fontWeight: '800' }}>{v.nome}</Text>
              </TouchableOpacity>
              <Badge tone={v.ativo ? 'success' : 'danger'}>
                {v.ativo ? 'ATIVO' : 'INATIVO'}
              </Badge>
            </View>
            <Body>CPF: {v.cpf?.value}</Body>
            {v.telefone ? <Body>Telefone: {v.telefone}</Body> : null}
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <AppButton
                title="Editar"
                icon={Edit3}
                variant="secondary"
                onPress={() => {
                  setError(null)
                  abrirEdicao(v)
                }}
              />
              <AppButton
                title={v.ativo ? 'Inativar' : 'Reativar'}
                icon={Power}
                variant={v.ativo ? 'danger' : 'secondary'}
                onPress={() => void alterarStatus(v)}
              />
              <AppButton
                title="Histórico"
                icon={History}
                variant="secondary"
                onPress={() => void verAcessos(v)}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          !carregando ? (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Body>Nenhum visitante encontrado.</Body>
            </View>
          ) : null
        }
      />

      {/* Modal Cadastro */}
      <Modal visible={modalCadastro} animationType="slide" onRequestClose={() => setModalCadastro(false)}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.colors.appBg, padding: 16 }}>
          <View style={{ gap: 16, marginTop: 40 }}>
            <Card>
              <Kicker>Cadastro</Kicker>
              <Title>Novo Visitante</Title>
              <Body>Insira as informações básicas do visitante.</Body>
            </Card>
            <Card>
              <TextField label="Nome completo" value={nome} onChangeText={setNome} />
              <TextField label="CPF (somente números)" value={cpf} onChangeText={(text) => setCpf(text.slice(0, 11))} keyboardType="number-pad" />
              <TextField label="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
              <TextField label="Observações" value={observacao} onChangeText={setObservacao} multiline />
              
              <View style={{ marginVertical: 8 }}>
                <Subtitle>Selecione o Apartamento</Subtitle>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {apartamentos.map(ap => {
                  const isSelected = idApartamento === ap.id
                  return (
                    <TouchableOpacity
                      key={ap.id}
                      style={{
                        borderWidth: 1,
                        borderColor: isSelected ? theme.colors.brand : theme.colors.border,
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        marginRight: 8,
                        backgroundColor: isSelected ? theme.colors.brandSoft : theme.colors.surface,
                      }}
                      onPress={() => setIdApartamento(ap.id)}
                    >
                      <Text style={{ color: isSelected ? theme.colors.brandStrong : theme.colors.text, fontWeight: isSelected ? '800' : '400' }}>
                        Ap {ap.numero} - Bl {ap.bloco}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

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
              <Kicker>Edição</Kicker>
              <Title>Editar Visitante</Title>
              <Body>Atualize os dados cadastrais do visitante.</Body>
            </Card>
            <Card>
              <TextField label="Nome completo" value={nomeEdicao} onChangeText={setNomeEdicao} />
              <TextField label="Telefone" value={telEdicao} onChangeText={setTelEdicao} keyboardType="phone-pad" />
              <TextField label="Observações" value={obsEdicao} onChangeText={setObsEdicao} multiline />
              
              <View style={{ marginVertical: 8 }}>
                <Subtitle>Selecione o Apartamento</Subtitle>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {apartamentos.map(ap => {
                  const isSelected = idApEdicao === ap.id
                  return (
                    <TouchableOpacity
                      key={ap.id}
                      style={{
                        borderWidth: 1,
                        borderColor: isSelected ? theme.colors.brand : theme.colors.border,
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        marginRight: 8,
                        backgroundColor: isSelected ? theme.colors.brandSoft : theme.colors.surface,
                      }}
                      onPress={() => setIdApEdicao(ap.id)}
                    >
                      <Text style={{ color: isSelected ? theme.colors.brandStrong : theme.colors.text, fontWeight: isSelected ? '800' : '400' }}>
                        Ap {ap.numero} - Bl {ap.bloco}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>

              <ErrorMessage message={error} />
              <AppButton
                title={salvando ? 'Salvando...' : 'Salvar Alterações'}
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

      {/* Modal Histórico Acessos */}
      <Modal visible={modalAcessos} animationType="slide" onRequestClose={() => setModalAcessos(false)}>
        <View style={{ flex: 1, backgroundColor: theme.colors.appBg, padding: 16 }}>
          <View style={{ gap: 16, marginTop: 40, flex: 1 }}>
            <Card>
              <Kicker>Histórico</Kicker>
              <Title>Registros de Acesso</Title>
              <Body>{visitanteEditando?.nome} — {visitanteEditando?.cpf?.value}</Body>
            </Card>

            {carregandoAcessos ? (
              <LoadingMessage />
            ) : (
              <FlatList
                style={{ flex: 1 }}
                data={acessos}
                keyExtractor={a => String(a.id)}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item: a }) => (
                  <Card>
                    <Subtitle>Acesso #{a.id}</Subtitle>
                    <Body>Entrada: {formatarData(a.dataHoraEntrada)}</Body>
                    <Body>Saída: {a.dataHoraSaida ? formatarData(a.dataHoraSaida) : 'Em aberto'}</Body>
                  </Card>
                )}
                ListEmptyComponent={
                  <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <Body>Nenhum acesso registrado.</Body>
                  </View>
                }
              />
            )}
            
            <AppButton
              title="Fechar"
              variant="secondary"
              onPress={() => setModalAcessos(false)}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  )
}