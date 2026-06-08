import type { NavigatorScreenParams } from '@react-navigation/native'

export type AuthStackParamList = {
  Login: undefined
}

export type HomeStackParamList = {
  Home: undefined
}

export type ModulePlaceholderParams = {
  title: string
  category: string
  description: string
  status?: string
  icon: 'access' | 'visitors' | 'apartments' | 'reservations' | 'incidents' | 'maintenance'
}

export type MoreStackParamList = {
  MoreHome: undefined
  ModulePlaceholder: ModulePlaceholderParams
  AccessControl: undefined
  VisitorsList: undefined
  ApartmentsList: undefined
}

export type UserStackParamList = {
  UserList: undefined
  UserCreate: undefined
  UserEdit: { id: number }
  ModulePlaceholder: ModulePlaceholderParams
}

export type NoticeStackParamList = {
  NoticeList: undefined
  NoticeDetail: { id: number }
  NoticeCreate: undefined
}

export type ProfileStackParamList = {
  Profile: undefined
}

export type AppTabParamList = {
  Inicio: NavigatorScreenParams<HomeStackParamList>
  Usuarios: NavigatorScreenParams<UserStackParamList> | undefined
  Mural: NavigatorScreenParams<NoticeStackParamList>
  Perfil: NavigatorScreenParams<ProfileStackParamList>
  Mais: NavigatorScreenParams<MoreStackParamList>
}
