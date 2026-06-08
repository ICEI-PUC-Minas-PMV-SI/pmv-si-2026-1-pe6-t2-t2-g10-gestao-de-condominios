import { type NavigationProp, useNavigation } from '@react-navigation/native'
import { Bell, CalendarCheck, Megaphone, ShieldCheck, User, DoorOpen } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'

import { useAuth } from '@/auth/AuthContext'
import { Badge, Body, Card, Kicker, OptionCard, Screen, Subtitle, Title } from '@/components/ui'
import type { AppTabParamList } from '@/navigation/types'
import { BrandMark, ThemeToggle, useTheme } from '@/theme/ThemeContext'

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp<AppTabParamList>>()
  const { usuario } = useAuth()
  const { theme } = useTheme()

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <BrandMark />
          <ThemeToggle />
          </View>
          <Kicker>SmartSindico Mobile</Kicker>
          <Title>Olá, {usuario?.nome}</Title>
          <Body>Confira os principais atalhos e acompanhe a rotina do condomínio.</Body>
        </Card>

        <Card variant="highlight">
          <Badge tone="brand">{usuario?.perfil}</Badge>
          <Subtitle>Visão geral</Subtitle>
          <Body>
            Mural, usuários, perfil e outras áreas ficam sempre acessíveis pelas abas inferiores.
          </Body>
        </Card>

        <OptionCard
          eyebrow="Acesso rápido"
          title="Abrir mural de avisos"
          description="Veja comunicados oficiais, destaques e publicações recentes."
          icon={Megaphone}
          onPress={() => navigation.navigate('Mural', { screen: 'NoticeList' })}
        />

        <OptionCard
          eyebrow="Conta"
          title="Meu perfil"
          description="Consulte seus dados e encerre a sessão quando precisar."
          icon={User}
          onPress={() => navigation.navigate('Perfil', { screen: 'Profile' })}
        />

         <OptionCard
          eyebrow="Operação"
          title="Controle de Portaria"
          description="Registre entradas, saídas e movimentações de acesso em tempo real."
          icon={ShieldCheck}
          onPress={() => navigation.navigate('Mais', { screen: 'AccessControl' })}
        />

        <OptionCard
          eyebrow="Operação"
          title="Cadastro de Visitantes"
          description="Cadastre novos visitantes, consulte autorizações e o histórico."
          icon={DoorOpen}
          onPress={() => navigation.navigate('Mais', { screen: 'VisitorsList' })}
        />

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Megaphone size={24} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <Kicker>Comunicação</Kicker>
              <Subtitle>Mural de avisos</Subtitle>
            </View>
          </View>
          <Body>Acompanhe comunicados oficiais e destaques publicados para o condomínio.</Body>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={24} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <Kicker>Operação</Kicker>
              <Subtitle>Rotina do condomínio</Subtitle>
            </View>
          </View>
          <Body>Portaria, visitantes, apartamentos, reservas e ocorrências já aparecem no menu para evolução dos próximos fluxos.</Body>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CalendarCheck size={24} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <Kicker>Hoje</Kicker>
              <Subtitle>Atendimento centralizado</Subtitle>
            </View>
          </View>
          <Body>As áreas do aplicativo seguem o mesmo padrão de superfícies, badges, ícones e tema claro/escuro.</Body>
        </Card>

        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Bell size={24} color={theme.colors.brand} />
            <View style={{ flex: 1 }}>
              <Kicker>Conta</Kicker>
              <Subtitle>Dados e sessão</Subtitle>
            </View>
          </View>
          <Body>Acesse seu perfil pela aba inferior para consultar seus dados ou encerrar a sessão.</Body>
        </Card>
      </Screen>
    </ScrollView>
  )
}
