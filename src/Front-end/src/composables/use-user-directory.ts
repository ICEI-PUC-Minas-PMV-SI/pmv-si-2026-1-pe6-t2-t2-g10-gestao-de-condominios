import { computed, ref, shallowRef } from 'vue'

import { fetchApartments } from '@/services/apartment.service'
import { createUser, fetchUsers } from '@/services/user.service'
import type { ApartamentoResponse, CadastroRequest, UsuarioResponse } from '@/types/api'

export function useUserDirectory() {
  const users = ref<UsuarioResponse[]>([])
  const apartments = ref<ApartamentoResponse[]>([])
  const loadingUsers = shallowRef(false)
  const loadingApartments = shallowRef(false)
  const savingUser = shallowRef(false)

  const activeApartments = computed(() => apartments.value.filter((apartment) => apartment.ativo))

  async function loadUsers() {
    loadingUsers.value = true

    try {
      users.value = await fetchUsers()
    } finally {
      loadingUsers.value = false
    }
  }

  async function loadApartments() {
    loadingApartments.value = true

    try {
      apartments.value = await fetchApartments()
    } finally {
      loadingApartments.value = false
    }
  }

  async function registerUser(payload: CadastroRequest) {
    savingUser.value = true

    try {
      const created = await createUser(payload)
      users.value = [created, ...users.value]
      return created
    } finally {
      savingUser.value = false
    }
  }

  return {
    users,
    apartments,
    activeApartments,
    loadingUsers,
    loadingApartments,
    savingUser,
    loadUsers,
    loadApartments,
    registerUser,
  }
}
