import { Building2, CalendarCheck, ClipboardList, DoorOpen, ShieldCheck, Wrench } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'

import { AppButton, Badge, Body, Card, Kicker, Screen, Subtitle, Title } from '@/components/ui'
import type { ModulePlaceholderParams } from '@/navigation/types'
import { useTheme } from '@/theme/ThemeContext'

type Props = {
  route: { params: ModulePlaceholderParams }
  navigation?: {
    canGoBack: () => boolean
    goBack: () => void
  }
}

const icons = {
  access: ShieldCheck,
  visitors: DoorOpen,
  apartments: Building2,
  reservations: CalendarCheck,
  incidents: ClipboardList,
  maintenance: Wrench,
}

export type ReservedModuleIcon = keyof typeof icons

export function ModulePlaceholderScreen({ navigation, route }: Props) {
  const { theme } = useTheme()
  const Icon = icons[route.params.icon]

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 48,
                height: 48,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                backgroundColor: theme.colors.brandSoft,
              }}
            >
              <Icon size={24} color={theme.colors.brandStrong} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Kicker>{route.params.category}</Kicker>
              <Title>{route.params.title}</Title>
            </View>
          </View>
          <Badge tone="brand">{route.params.status ?? 'Em breve'}</Badge>
          <Body>{route.params.description}</Body>
        </Card>

        <Card>
          <Subtitle>Funcionalidade em implantação</Subtitle>
          <Body>
            Esta área estará disponível em uma próxima etapa do aplicativo.
          </Body>
        </Card>

        {navigation?.canGoBack() ? (
          <AppButton title="Voltar" variant="secondary" onPress={() => navigation.goBack()} />
        ) : null}
      </Screen>
    </ScrollView>
  )
}
