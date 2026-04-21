import type { SessionSnapshot } from '@/types/api'

const SESSION_STORAGE_KEY = 'smartsindico.session'

export function persistSession(snapshot: SessionSnapshot) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot))
}

export function readPersistedSession(): SessionSnapshot | null {
  const stored = localStorage.getItem(SESSION_STORAGE_KEY)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as SessionSnapshot
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function clearPersistedSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}
