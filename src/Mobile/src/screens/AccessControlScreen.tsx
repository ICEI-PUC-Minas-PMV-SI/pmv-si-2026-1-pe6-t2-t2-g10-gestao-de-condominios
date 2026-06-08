import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View, Text } from 'react-native'
import { ShieldCheck, UserCheck, RefreshCw, LogOut } from 'lucide-react-native'

import { visitorService } from '@/services/visitor.service'
import { accessService } from '@/services/access.service'
import {
  AppButton,
  Badge,
  Body,
  Card,
  ErrorMessage,
  Kicker,
  Screen,
  TextField,
  Title,
  Subtitle,
} from '@/components/ui'
import { useTheme } from '@/theme/ThemeContext'

interface AcessoVisitanteResponse {
  id: number
  dataHoraEntrada: string
  dataHoraSaida?: string
  visitante?: {
    nome: string
    cpf: { value: string }
  }
}

export function AccessControlScreen() {
  const { theme } = useTheme()
  const [cpfBusca, setCpfBusca] = useState('')
  const [visitante, setVisitante] = useState<any>(null)
  const [buscando, setBuscando] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [acessosAbertos, setAcessosAbertos] = useState<AcessoVisitanteResponse[]>([])
  const [carregando, setCarregando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [motivoVisita, setMotivoVisita] = useState(1)
  const [tipoAcesso, setTipoAcesso] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [reativando, setReativando] = useState(false)

  const carregarAbertos = async () => {
    setCarregando(true)
    setError(null)
    try {
      const res = await accessService.getOpen()
      setAcessosAbertos(Array.isArray(res) ? res : (res.data ?? []))
    } catch {
      setError('Erro ao carregar acessos ativos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    void carregarAbertos()
  }, [])

  const buscar = async () => {
    const cpfLimpo = cpfBusca.replace(/\D/g, '')
    if (cpfLimpo.length < 11) {
      Alert.alert('Atenção', 'Digite um CPF válido com 11 dígitos.')
      return
    }
    setBuscando(true)
    setError(null)
    setVisitante(null)
    try {
      const res = await visitorService.getByCpf(cpfLimpo)
      setVisitante(Array.isArray(res) ? res[0] : (res.data ?? res))
    } catch {
      setError('Visitante não encontrado no banco de dados.')
    } finally {
      setBuscando(false)
    }
  }

  const confirmarEntrada = async () => {
    if (!visitante) return
    setRegistrando(true)
    setError(null)
    try {
      await accessService.registerEntry(visitante.cpf.value, {
        motivoVisita,
        tipoAcesso,
        observacao: observacao.trim(),
        idUsuarioPorteiro: 0,
        idUsuarioApartamento: 0,
      })
      Alert.alert('Sucesso', 'Entrada registrada com sucesso!')
      setVisitante(null)
      setCpfBusca('')
      setObservacao('')
      await carregarAbertos()
    } catch {
      setError('Erro ao registrar entrada. Certifique-se de que o visitante não possua uma entrada em aberto.')
    } finally {
      setRegistrando(false)
    }
  }

  const registrarSaida = async (cpf: string) => {
    setError(null)
    try {
      await accessService.registerExit(cpf)
      Alert.alert('Sucesso', 'Saída registrada!')
      await carregarAbertos()
    } catch {
      setError('Erro ao registrar saída do visitante.')
    }
  }

  const reativar = async () => {
    if (!visitante) return
    setReativando(true)
    setError(null)
    try {
      await visitorService.reativar(visitante.cpf.value)
      const res = await visitorService.getByCpf(visitante.cpf.value)
      setVisitante(Array.isArray(res) ? res[0] : (res.data ?? res))
      Alert.alert('Sucesso', 'Visitante reativado com sucesso.')
    } catch {
      setError('Erro ao reativar cadastro do visitante.')
    } finally {
      setReativando(false)
    }
  }

  const formatarHora = (d: string) => new Date(d).toLocaleTimeString('pt-BR')
  const motivos = ['Social / Visita', 'Prestação de Serviço', 'Entrega / Delivery']
  const tipos = ['Entrada Normal', 'Entrada Autorizada']

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.appBg }}>
      <Screen>
        <Card>
          <Kicker>Portaria</Kicker>
          <Title>Controle de Portaria</Title>
          <Body>Gerencie o fluxo de acesso e saída de visitantes em tempo real.</Body>
        </Card>

        {/* Seção Registrar Entrada */}
        <Card>
          <Subtitle>Registrar Entrada</Subtitle>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <TextField
                label="Buscar Visitante"
                placeholder="CPF (somente números)"
                value={cpfBusca}
                onChangeText={(text) => setCpfBusca(text.slice(0, 11))}
                keyboardType="number-pad"
              />
            </View>
            <View style={{ justifyContent: 'flex-end', paddingBottom: 6 }}>
              <AppButton
                title={buscando ? '...' : 'Buscar'}
                onPress={buscar}
                disabled={buscando}
              />
            </View>
          </View>
          <ErrorMessage message={error} />

          {visitante && (
            <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.brandStrong, fontSize: 18, fontWeight: '800' }}>
                  {visitante.nome}
                </Text>
                <Badge tone={visitante.ativo ? 'success' : 'danger'}>
                  {visitante.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </View>
              <View style={{ marginTop: 4 }}>
                <Body>CPF: {visitante.cpf?.value}</Body>
              </View>

              {!visitante.ativo ? (
                <View style={{ marginTop: 12, gap: 10 }}>
                  <Card variant="highlight">
                    <Text style={{ color: theme.colors.brandStrong, fontWeight: '700', fontSize: 14 }}>
                      ⚠️ Visitante INATIVO — entrada não permitida no condomínio.
                    </Text>
                  </Card>
                  <AppButton
                    title={reativando ? 'Reativando...' : 'Reativar Visitante'}
                    icon={UserCheck}
                    onPress={reativar}
                    disabled={reativando}
                  />
                </View>
              ) : (
                <View style={{ marginTop: 12, gap: 8 }}>
                  <View style={{ marginTop: 8 }}>
                    <Subtitle>Motivo da Visita:</Subtitle>
                  </View>
                  {motivos.map((m, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 }}
                      onPress={() => setMotivoVisita(i + 1)}
                    >
                      <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: motivoVisita === i + 1 ? theme.colors.brand : theme.colors.border,
                        backgroundColor: motivoVisita === i + 1 ? theme.colors.brand : 'transparent',
                      }} />
                      <Body>{m}</Body>
                    </TouchableOpacity>
                  ))}

                  <View style={{ marginTop: 8 }}>
                    <Subtitle>Tipo de Acesso:</Subtitle>
                  </View>
                  {tipos.map((t, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 }}
                      onPress={() => setTipoAcesso(i + 1)}
                    >
                      <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: tipoAcesso === i + 1 ? theme.colors.brand : theme.colors.border,
                        backgroundColor: tipoAcesso === i + 1 ? theme.colors.brand : 'transparent',
                      }} />
                      <Body>{t}</Body>
                    </TouchableOpacity>
                  ))}

                  <TextField
                    label="Observações (opcional)"
                    placeholder="Alguma observação importante..."
                    value={observacao}
                    onChangeText={setObservacao}
                    multiline
                  />

                  <AppButton
                    title={registrando ? 'Registrando...' : 'Confirmar Entrada'}
                    icon={ShieldCheck}
                    onPress={confirmarEntrada}
                    disabled={registrando}
                  />
                </View>
              )}
            </View>
          )}
        </Card>

        {/* Seção Visitantes Ativos */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Subtitle>Visitantes no Condomínio</Subtitle>
            <TouchableOpacity onPress={() => void carregarAbertos()} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={14} color={theme.colors.brand} />
              <Text style={{ color: theme.colors.brand, fontWeight: '700', fontSize: 14 }}>Atualizar</Text>
            </TouchableOpacity>
          </View>

          {carregando ? (
            <ActivityIndicator color={theme.colors.brand} />
          ) : acessosAbertos.length === 0 ? (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <Body>Nenhum visitante ativo no momento.</Body>
            </View>
          ) : (
            acessosAbertos.map(a => (
              <View
                key={a.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontWeight: '700', color: theme.colors.text, fontSize: 14 }}>
                    {a.visitante?.nome ?? 'Visitante'}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
                    Entrou às: {formatarHora(a.dataHoraEntrada)}
                  </Text>
                </View>
                {a.visitante && (
                  <AppButton
                    title="Saída"
                    icon={LogOut}
                    variant="danger"
                    onPress={() => void registrarSaida(a.visitante?.cpf?.value || '')}
                  />
                )}
              </View>
            ))
          )}
        </Card>
      </Screen>
    </ScrollView>
  )
}