import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Building2, CalendarCheck, ClipboardList, DoorOpen, ShieldCheck } from 'lucide-react-native'
import { ScrollView, View } from 'react-native'

import { Badge, Body, Card, Kicker, OptionCard, Screen, Subtitle, Title } from '@/components/ui'
import type { MoreStackParamList, ModulePlaceholderParams } from '@/navigation/types'

type Props = NativeStackScreenProps<MoreStackParamList, 'MoreHome'>

type ModuleItem = ModulePlaceholderParams & {
  iconComponent: typeof ShieldCheck
}

const modules: Array<{ section: string; items: ModuleItem[] }> = [
  {
    section: 'Operação',
    items: [
      {
        title: 'Controle de portaria',
        category: 'Operação',
        description: 'Registre entradas, saídas e movimentações da portaria.',
        icon: 'access',
        iconComponent: ShieldCheck,
      },
      {
        title: 'Visitantes',
        category: 'Operação',
        description: 'Cadastre e acompanhe visitantes autorizados.',
        icon: 'visitors',
        iconComponent: DoorOpen,
      },
    ],
  },
  {
    section: 'Moradia',
    items: [
      {
        title: 'Apartamentos',
        category: 'Moradia',
        description: 'Consulte unidades, moradores vinculados e ocupação.',
        icon: 'apartments',
        iconComponent: Building2,
      },
    ],
  },
  {
    section: 'Agenda',
    items: [
      {
        title: 'Reservas',
        category: 'Agenda',
        description: 'Acompanhe reservas de espaços compartilhados.',
        icon: 'reservations',
        iconComponent: CalendarCheck,
      },
    ],
  },
  {
    section: 'Atendimento',
    items: [
      {
        title: 'Ocorrências',
        category: 'Atendimento',
        description: 'Registre e acompanhe solicitações do condomínio.',
        icon: 'incidents',
        iconComponent: ClipboardList,
      },
    ],
  },
]

export function MoreScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Screen>
        <Card>
          <Badge tone="brand">Mais</Badge>
          <Title>Outras áreas</Title>
          <Body>Confira os demais módulos do condomínio em um só lugar.</Body>
        </Card>

        {modules.map((group) => (
          <View key={group.section} style={{ gap: 10 }}>
            <Kicker>{group.section}</Kicker>
            <Subtitle>{group.section}</Subtitle>
            {group.items.map(({ iconComponent, ...item }) => (
              <OptionCard
                key={item.title}
                eyebrow={item.category}
                title={item.title}
                description={item.description}
                icon={iconComponent}
                onPress={() => navigation.navigate('ModulePlaceholder', { ...item, status: 'Em breve' })}
              />
            ))}
          </View>
        ))}
      </Screen>
    </ScrollView>
  )
}
