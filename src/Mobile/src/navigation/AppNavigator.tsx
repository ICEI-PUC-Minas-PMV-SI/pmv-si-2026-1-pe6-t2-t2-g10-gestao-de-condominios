import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Grid3X3, Home, Megaphone, User, Users } from 'lucide-react-native'

import { useAuth } from '@/auth/AuthContext'
import { HomeScreen } from '@/screens/HomeScreen'
import { ModulePlaceholderScreen } from '@/screens/ModulePlaceholderScreen'
import { MoreScreen } from '@/screens/MoreScreen'
import { NoticeCreateScreen } from '@/screens/NoticeCreateScreen'
import { NoticeDetailScreen } from '@/screens/NoticeDetailScreen'
import { NoticeListScreen } from '@/screens/NoticeListScreen'
import { ProfileScreen } from '@/screens/ProfileScreen'
import { UserCreateScreen } from '@/screens/UserCreateScreen'
import { UserEditScreen } from '@/screens/UserEditScreen'
import { UserListScreen } from '@/screens/UserListScreen'
import { useTheme } from '@/theme/ThemeContext'
import { canManageUsers } from '@/utils/roles'
import { AccessControlScreen } from '../screens/AccessControlScreen'
import { VisitorsScreen } from '../screens/VisitorsScreen'
import { ApartmentsScreen } from '../screens/ApartmentsScreen'

import type {
  AppTabParamList,
  HomeStackParamList,
  MoreStackParamList,
  NoticeStackParamList,
  ProfileStackParamList,
  UserStackParamList,
} from './types'

const Tab = createBottomTabNavigator<AppTabParamList>()
const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const UserStack = createNativeStackNavigator<UserStackParamList>()
const NoticeStack = createNativeStackNavigator<NoticeStackParamList>()
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()
const MoreStack = createNativeStackNavigator<MoreStackParamList>()

function stackScreenOptions(theme: ReturnType<typeof useTheme>['theme']) {
  return {
    headerTintColor: theme.colors.text,
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTitleStyle: {
      fontWeight: '800' as const,
    },
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.colors.appBg,
    },
  }
}

function HomeNavigator() {
  const { theme } = useTheme()

  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
    </HomeStack.Navigator>
  )
}

function UserNavigator() {
  const { usuario } = useAuth()
  const { theme } = useTheme()

  if (!canManageUsers(usuario?.perfil ?? null)) {
    return (
      <UserStack.Navigator screenOptions={stackScreenOptions(theme)}>
        <UserStack.Screen
          name="ModulePlaceholder"
          component={ModulePlaceholderScreen}
          initialParams={{
            title: 'Usuários',
            category: 'Administração',
            description: 'Área administrativa disponível conforme as permissões do seu perfil.',
            status: 'Restrito por perfil',
            icon: 'maintenance',
          }}
          options={{ title: 'Usuários' }}
        />
      </UserStack.Navigator>
    )
  }

  return (
    <UserStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <UserStack.Screen name="UserList" component={UserListScreen} options={{ title: 'Usuários' }} />
      <UserStack.Screen name="UserCreate" component={UserCreateScreen} options={{ title: 'Novo usuário' }} />
      <UserStack.Screen name="UserEdit" component={UserEditScreen} options={{ title: 'Editar usuário' }} />
    </UserStack.Navigator>
  )
}

function NoticeNavigator() {
  const { theme } = useTheme()

  return (
    <NoticeStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <NoticeStack.Screen name="NoticeList" component={NoticeListScreen} options={{ title: 'Mural' }} />
      <NoticeStack.Screen name="NoticeDetail" component={NoticeDetailScreen} options={{ title: 'Aviso' }} />
      <NoticeStack.Screen name="NoticeCreate" component={NoticeCreateScreen} options={{ title: 'Novo aviso' }} />
    </NoticeStack.Navigator>
  )
}

function ProfileNavigator() {
  const { theme } = useTheme()

  return (
    <ProfileStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </ProfileStack.Navigator>
  )
}

function MoreNavigator() {
  const { theme } = useTheme()
  return (
    <MoreStack.Navigator screenOptions={stackScreenOptions(theme)}>
      <MoreStack.Screen name="MoreHome" component={MoreScreen} options={{ title: 'Mais' }} />
      <MoreStack.Screen
        name="ModulePlaceholder"
        component={ModulePlaceholderScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <MoreStack.Screen 
        name="AccessControl" 
        component={AccessControlScreen} 
        options={{ title: 'Portaria (Acesso)' }} 
      />
      <MoreStack.Screen 
        name="VisitorsList" 
        component={VisitorsScreen} 
        options={{ title: 'Visitantes' }} 
      />
      <MoreStack.Screen 
        name="ApartmentsList" 
        component={ApartmentsScreen} 
        options={{ title: 'Apartamentos' }} 
      />
    </MoreStack.Navigator>
  )
}

export function AppNavigator() {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          minHeight: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.tabBg,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeNavigator}
        options={{ title: 'Início', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Mural"
        component={NoticeNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Megaphone color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Usuarios"
        component={UserNavigator}
        options={{ title: 'Usuários', tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileNavigator}
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
      <Tab.Screen
        name="Mais"
        component={MoreNavigator}
        options={{ tabBarIcon: ({ color, size }) => <Grid3X3 color={color} size={size} /> }}
      />
    </Tab.Navigator>
  )
}
