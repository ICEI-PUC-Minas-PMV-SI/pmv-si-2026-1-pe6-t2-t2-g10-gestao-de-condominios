import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import { login } from '@/services/auth.service'
import type { LoginRequest, PerfilUsuarioResponse, SessionSnapshot, UserRole, UsuarioResponse } from '@/types/api'
import {
  clearPersistedSession,
  persistSession,
  readPersistedSession,
} from '@/utils/session-storage'

export const useAuthStore = defineStore('auth', () => {
  const token = shallowRef<string | null>(null)
  const expiraEmUtc = shallowRef<string | null>(null)
  const usuario = ref<PerfilUsuarioResponse | null>(null)
  const isBootstrapped = shallowRef(false)

  const role = computed<UserRole | null>(() => usuario.value?.perfil ?? null)
  const isAuthenticated = computed(() => {
    if (!token.value || !expiraEmUtc.value || !usuario.value) {
      return false
    }

    return new Date(expiraEmUtc.value).getTime() > Date.now()
  })

  function setSession(snapshot: SessionSnapshot) {
    token.value = snapshot.token
    expiraEmUtc.value = snapshot.expiraEmUtc
    usuario.value = snapshot.usuario
    persistSession(snapshot)
  }

  function clearSession() {
    token.value = null
    expiraEmUtc.value = null
    usuario.value = null
    clearPersistedSession()
  }

  function bootstrapSession() {
    if (isBootstrapped.value) {
      return
    }

    const persisted = readPersistedSession()

    if (!persisted) {
      isBootstrapped.value = true
      return
    }

    if (new Date(persisted.expiraEmUtc).getTime() <= Date.now()) {
      clearSession()
      isBootstrapped.value = true
      return
    }

    token.value = persisted.token
    expiraEmUtc.value = persisted.expiraEmUtc
    usuario.value = persisted.usuario
    isBootstrapped.value = true
  }

  function syncProfile(profile: UsuarioResponse) {
    if (!usuario.value) {
      return
    }

    usuario.value = {
      ...usuario.value,
      nome: profile.nome,
      email: profile.email,
      telefone: profile.telefone,
      perfil: profile.perfil,
      idApartamento: profile.idApartamento,
    }

    if (token.value && expiraEmUtc.value) {
      persistSession({
        token: token.value,
        expiraEmUtc: expiraEmUtc.value,
        usuario: usuario.value,
      })
    }
  }

  async function signIn(payload: LoginRequest) {
    const response = await login(payload)
    setSession(response)
    return response
  }

  return {
    token,
    expiraEmUtc,
    usuario,
    role,
    isAuthenticated,
    isBootstrapped,
    bootstrapSession,
    signIn,
    setSession,
    syncProfile,
    clearSession,
  }
})
