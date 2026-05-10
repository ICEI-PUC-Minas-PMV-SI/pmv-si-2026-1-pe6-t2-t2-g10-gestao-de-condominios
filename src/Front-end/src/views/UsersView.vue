<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import PaginationControls from '@/components/shared/PaginationControls.vue'
import UserList from '@/components/users/UserList.vue'
import { USER_ROLES } from '@/constants/roles'
import { useUserDirectory } from '@/composables/use-user-directory'
import { AppError } from '@/services/http/errors'
import { useAuthStore } from '@/stores/auth'
import type { UsuarioResponse } from '@/types/api'

const auth = useAuthStore()
const router = useRouter()
const filterText = shallowRef('')
const statusFilter = shallowRef<'all' | 'active' | 'inactive'>('all')
const listErrorMessage = shallowRef('')

const {
  users,
  loadingUsers,
  page: usersPage,
  pageSize: usersPageSize,
  totalItems: usersTotalItems,
  totalPages: usersTotalPages,
  loadUsers,
} = useUserDirectory()

let filterDebounceHandle: ReturnType<typeof window.setTimeout> | undefined

const canListUsers = computed(
  () => auth.role === USER_ROLES.Funcionario || auth.role === USER_ROLES.Sindico,
)

const canCreateUsers = computed(
  () => auth.role === USER_ROLES.Funcionario || auth.role === USER_ROLES.Sindico,
)

watch(filterText, () => {
  if (!canListUsers.value) {
    return
  }

  if (filterDebounceHandle) {
    window.clearTimeout(filterDebounceHandle)
  }

  filterDebounceHandle = window.setTimeout(() => {
    void loadUsersPage(1)
  }, 300)
})

watch(statusFilter, () => {
  if (canListUsers.value) {
    void loadUsersPage(1)
  }
})

function getAtivoFilter() {
  if (statusFilter.value === 'active') {
    return true
  }

  if (statusFilter.value === 'inactive') {
    return false
  }

  return undefined
}

async function loadUsersPage(nextPage = usersPage.value) {
  listErrorMessage.value = ''

  try {
    await loadUsers({
      page: nextPage,
      search: filterText.value.trim(),
      ativo: getAtivoFilter(),
    })
  } catch (error) {
    listErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível carregar os usuários.'
  }
}

async function loadPageData() {
  listErrorMessage.value = ''

  try {
    await (canListUsers.value ? loadUsersPage(1) : Promise.resolve())
  } catch (error) {
    listErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível carregar os usuários.'
  }
}

async function handleEditUser(user: UsuarioResponse) {
  await router.push(`/usuarios/${user.id}/editar`)
}

onMounted(loadPageData)
onBeforeUnmount(() => {
  if (filterDebounceHandle) {
    window.clearTimeout(filterDebounceHandle)
  }
})
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="font-display text-3xl text-ink-950">Usuários</h2>
    </div>

    <div v-if="listErrorMessage" class="surface-card border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ listErrorMessage }}
    </div>

    <section class="surface-card p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
          <input
            v-model="filterText"
            type="search"
            class="theme-control soft-ring lg:w-96"
            placeholder="Buscar por nome, e-mail, CPF ou apartamento"
          >

          <div class="theme-filter-group">
            <button
              type="button"
              class="theme-filter-button"
              :class="{ 'theme-filter-button--active': statusFilter === 'all' }"
              @click="statusFilter = 'all'"
            >
              Todos
            </button>
            <button
              type="button"
              class="theme-filter-button"
              :class="{ 'theme-filter-button--active': statusFilter === 'active' }"
              @click="statusFilter = 'active'"
            >
              Ativos
            </button>
            <button
              type="button"
              class="theme-filter-button"
              :class="{ 'theme-filter-button--active': statusFilter === 'inactive' }"
              @click="statusFilter = 'inactive'"
            >
              Inativos
            </button>
          </div>
        </div>

        <RouterLink
          v-if="canCreateUsers"
          to="/usuarios/novo"
          class="theme-primary-button text-center"
        >
          Novo usuário
        </RouterLink>
      </div>

      <div v-if="loadingUsers" class="mt-6 text-sm text-ink-700">
        Carregando usuários...
      </div>

      <div
        v-else-if="!users.length"
        class="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-ink-700"
      >
        Nenhum usuário encontrado para o filtro informado.
      </div>

      <div v-else class="mt-6">
        <UserList
          :users="users"
          @edit="handleEditUser"
        />

        <PaginationControls
          :page="usersPage"
          :page-size="usersPageSize"
          :total-items="usersTotalItems"
          :total-pages="usersTotalPages"
          :loading="loadingUsers"
          @change="loadUsersPage"
        />
      </div>
    </section>
  </section>
</template>
