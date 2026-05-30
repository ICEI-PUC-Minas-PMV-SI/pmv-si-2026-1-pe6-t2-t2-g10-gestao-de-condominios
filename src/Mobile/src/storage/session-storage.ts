import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'

import type { SessionSnapshot } from '@/types/api'

const sessionKey = 'smart-sindico-mobile-session'

export async function persistSession(session: SessionSnapshot) {
  if (Platform.OS === 'web') {
    localStorage.setItem(sessionKey, JSON.stringify(session))
    return
  }

  await SecureStore.setItemAsync(sessionKey, JSON.stringify(session))
}

export async function readPersistedSession() {
  if (Platform.OS === 'web') {
    const webSession = localStorage.getItem(sessionKey)

    if (!webSession) {
      return null
    }

    try {
      return JSON.parse(webSession) as SessionSnapshot
    } catch {
      await clearPersistedSession()
      return null
    }
  }

  const rawSession = await SecureStore.getItemAsync(sessionKey)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as SessionSnapshot
  } catch {
    await clearPersistedSession()
    return null
  }
}

export async function clearPersistedSession() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(sessionKey)
    return
  }

  await SecureStore.deleteItemAsync(sessionKey)
}
