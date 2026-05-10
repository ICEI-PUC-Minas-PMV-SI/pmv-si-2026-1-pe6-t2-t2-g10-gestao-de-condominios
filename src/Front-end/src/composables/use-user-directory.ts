import { computed, ref, shallowRef } from 'vue'

import { fetchApartments } from '@/services/apartment.service'
import { createUser, fetchUsers } from '@/services/user.service'
import type { ApartamentoResponse, CadastroRequest, PaginationQuery, UsuarioResponse } from '@/types/api'

const DEFAULT_PAGE_SIZE = 10

export function useUserDirectory() {
  const users = ref<UsuarioResponse[]>([])
  const apartments = ref<ApartamentoResponse[]>([])
  const loadingUsers = shallowRef(false)
  const loadingApartments = shallowRef(false)
  const savingUser = shallowRef(false)
  const page = shallowRef(1)
  const pageSize = shallowRef(DEFAULT_PAGE_SIZE)
  const totalItems = shallowRef(0)
  const totalPages = shallowRef(1)
  const currentSearch = shallowRef('')
  const currentAtivo = shallowRef<boolean | undefined>()

  const activeApartments = computed(() => apartments.value.filter((apartment) => apartment.ativo))

  async function loadUsers(options: PaginationQuery = {}) {
    const nextPage = options.page ?? page.value
    const nextPageSize = options.pageSize ?? pageSize.value
    const nextSearch = options.search?.trim() ?? currentSearch.value
    const nextAtivo = Object.prototype.hasOwnProperty.call(options, 'ativo') ? options.ativo : currentAtivo.value
    loadingUsers.value = true

    try {
      const response = await fetchUsers({
        page: nextPage,
        pageSize: nextPageSize,
        search: nextSearch || undefined,
        ativo: nextAtivo,
      })

      users.value = response.items
      page.value = response.page
      pageSize.value = response.pageSize
      totalItems.value = response.totalItems
      totalPages.value = response.totalPages
      currentSearch.value = nextSearch
      currentAtivo.value = nextAtivo
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
      return await createUser(payload)
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
    page,
    pageSize,
    totalItems,
    totalPages,
    currentSearch,
    currentAtivo,
    loadUsers,
    loadApartments,
    registerUser,
  }
}
