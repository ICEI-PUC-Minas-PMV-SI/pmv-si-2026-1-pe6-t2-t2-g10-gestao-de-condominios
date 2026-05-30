import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'

import { login } from '@/services/auth.service'
import { clearPersistedSession, persistSession, readPersistedSession } from '@/storage/session-storage'
import type { LoginRequest, PerfilUsuarioResponse, SessionSnapshot, UsuarioResponse } from '@/types/api'

interface AuthContextValue {
  session: SessionSnapshot | null
  usuario: PerfilUsuarioResponse | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  signIn: (payload: LoginRequest) => Promise<void>
  signOut: () => Promise<void>
  syncProfile: (profile: UsuarioResponse) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isSessionValid(session: SessionSnapshot | null) {
  if (!session?.token || !session.expiraEmUtc) {
    return false
  }

  return new Date(session.expiraEmUtc).getTime() > Date.now()
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<SessionSnapshot | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const persisted = await readPersistedSession()

      if (!isMounted) {
        return
      }

      if (!isSessionValid(persisted)) {
        await clearPersistedSession()
        setSession(null)
        setIsBootstrapping(false)
        return
      }

      setSession(persisted)
      setIsBootstrapping(false)
    }

    void bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    usuario: session?.usuario ?? null,
    isAuthenticated: isSessionValid(session),
    isBootstrapping,
    async signIn(payload) {
      const response = await login(payload)
      setSession(response)
      await persistSession(response)
    },
    async signOut() {
      setSession(null)
      await clearPersistedSession()
    },
    async syncProfile(profile) {
      if (!session) {
        return
      }

      const nextSession: SessionSnapshot = {
        ...session,
        usuario: {
          ...session.usuario,
          nome: profile.nome,
          email: profile.email,
          telefone: profile.telefone,
          perfil: profile.perfil,
          idApartamento: profile.idApartamento,
        },
      }

      setSession(nextSession)
      await persistSession(nextSession)
    },
  }), [isBootstrapping, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }

  return value
}
