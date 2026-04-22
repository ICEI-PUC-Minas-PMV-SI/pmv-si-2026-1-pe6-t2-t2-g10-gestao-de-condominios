<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useTemplateRef } from 'vue'

import PaginationControls from '@/components/shared/PaginationControls.vue'
import UserCreateForm from '@/components/users/UserCreateForm.vue'
import UserEditForm from '@/components/users/UserEditForm.vue'
import UserList from '@/components/users/UserList.vue'
import { USER_ROLES } from '@/constants/roles'
import { useUserDirectory } from '@/composables/use-user-directory'
import { AppError } from '@/services/http/errors'
import { updateUser } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth'
import type { AtualizacaoUsuarioRequest, CadastroRequest, UsuarioResponse } from '@/types/api'

const auth = useAuthStore()
const formRef = useTemplateRef<InstanceType<typeof UserCreateForm>>('userForm')
const filterText = shallowRef('')
const listErrorMessage = shallowRef('')
const formErrorMessage = shallowRef('')
const formSuccessMessage = shallowRef('')
const editErrorMessage = shallowRef('')
const editSuccessMessage = shallowRef('')
const fieldErrors = shallowRef<Record<string, string[]>>({})
const editFieldErrors = shallowRef<Record<string, string[]>>({})
const selectedUser = ref<UsuarioResponse | null>(null)
const savingEdition = shallowRef(false)

const {
  users,
  activeApartments,
  loadingUsers,
  loadingApartments,
  savingUser,
  page: usersPage,
  pageSize: usersPageSize,
  totalItems: usersTotalItems,
  totalPages: usersTotalPages,
  loadUsers,
  loadApartments,
  registerUser,
} = useUserDirectory()

let filterDebounceHandle: ReturnType<typeof window.setTimeout> | undefined

const canListUsers = computed(
  () => auth.role === USER_ROLES.Funcionario || auth.role === USER_ROLES.Sindico,
)

const canCreateUsers = computed(
  () => auth.role === USER_ROLES.Funcionario || auth.role === USER_ROLES.Sindico,
)

const allowedProfiles = computed(() => {
  if (auth.role === USER_ROLES.Sindico) {
    return [
      { label: 'Morador', value: 1 as const, role: USER_ROLES.Morador },
      { label: 'Funcionário', value: 2 as const, role: USER_ROLES.Funcionario },
      { label: 'Síndico', value: 3 as const, role: USER_ROLES.Sindico },
    ]
  }

  return [{ label: 'Morador', value: 1 as const, role: USER_ROLES.Morador }]
})

const editAllowedProfiles = computed(() => {
  if (auth.role === USER_ROLES.Sindico) {
    return [
      { label: 'Morador', value: 1 as const, role: USER_ROLES.Morador },
      { label: 'Funcionário', value: 2 as const, role: USER_ROLES.Funcionario },
      { label: 'Síndico', value: 3 as const, role: USER_ROLES.Sindico },
    ]
  }

  return [
    { label: 'Morador', value: 1 as const, role: USER_ROLES.Morador },
    { label: 'Funcionário', value: 2 as const, role: USER_ROLES.Funcionario },
  ]
})

const editPermissions = computed(() => ({
  canEditNome: true,
  canEditEmail: true,
  canEditTelefone: true,
  canEditSenha: true,
  canEditPerfil: true,
  canEditApartamento: true,
  canEditAtivo: true,
}))

watch(users, (currentUsers) => {
  if (!selectedUser.value) {
    return
  }

  selectedUser.value = currentUsers.find((user) => user.id === selectedUser.value?.id) ?? null
})

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

async function loadUsersPage(nextPage = usersPage.value) {
  listErrorMessage.value = ''

  try {
    await loadUsers({
      page: nextPage,
      search: filterText.value.trim(),
    })
  } catch (error) {
    listErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível carregar os usuários.'
  }
}

async function loadPageData() {
  listErrorMessage.value = ''

  try {
    await Promise.all([
      loadApartments(),
      canListUsers.value ? loadUsersPage(1) : Promise.resolve(),
    ])
  } catch (error) {
    listErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível carregar os usuários.'
  }
}

async function handleCreate(payload: CadastroRequest) {
  fieldErrors.value = {}
  formErrorMessage.value = ''
  formSuccessMessage.value = ''

  try {
    await registerUser(payload)
    formRef.value?.resetForm()
    formSuccessMessage.value = 'Usuário cadastrado com sucesso.'

    if (canListUsers.value) {
      await loadUsersPage(1)
    }
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      fieldErrors.value = error.fieldErrors ?? {}
      return
    }

    formErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível cadastrar o usuário.'
  }
}

function handleSelectUser(user: UsuarioResponse) {
  selectedUser.value = user
  editFieldErrors.value = {}
  editErrorMessage.value = ''
  editSuccessMessage.value = ''
}

function clearSelection() {
  selectedUser.value = null
  editFieldErrors.value = {}
  editErrorMessage.value = ''
  editSuccessMessage.value = ''
}

async function handleUpdate(payload: AtualizacaoUsuarioRequest) {
  if (!selectedUser.value) {
    return
  }

  savingEdition.value = true
  editFieldErrors.value = {}
  editErrorMessage.value = ''
  editSuccessMessage.value = ''

  try {
    const updatedUser = await updateUser(selectedUser.value.id, payload)
    selectedUser.value = updatedUser
    users.value = users.value.map((user) => (user.id === updatedUser.id ? updatedUser : user))

    if (auth.usuario?.id === updatedUser.id) {
      auth.syncProfile(updatedUser)
    }

    editSuccessMessage.value = 'Usuário atualizado com sucesso.'
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      editFieldErrors.value = error.fieldErrors ?? {}
      return
    }

    editErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível salvar as alterações.'
  } finally {
    savingEdition.value = false
  }
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

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section class="space-y-4">
        <div v-if="canListUsers" class="surface-card p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              v-model="filterText"
              type="search"
              class="theme-control soft-ring lg:max-w-sm"
              placeholder="Buscar por nome, e-mail, CPF ou apartamento"
            >

            <button
              v-if="selectedUser && canCreateUsers"
              type="button"
              class="soft-ring rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-ink-900 transition hover:border-slate-400 hover:bg-slate-50"
              @click="clearSelection"
            >
              Novo usuário
            </button>
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
              :selected-user-id="selectedUser?.id ?? null"
              @edit="handleSelectUser"
            />

            <PaginationControls
              v-if="usersTotalPages > 1"
              :page="usersPage"
              :page-size="usersPageSize"
              :total-items="usersTotalItems"
              :total-pages="usersTotalPages"
              :loading="loadingUsers"
              @change="loadUsersPage"
            />
          </div>
        </div>
      </section>

      <aside class="surface-card p-6">
        <div v-if="selectedUser" class="space-y-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-display text-2xl text-ink-950">Editar usuário</h3>
              <p class="mt-2 text-sm text-ink-700">{{ selectedUser.nome }}</p>
            </div>

            <button
              v-if="canCreateUsers"
              type="button"
              class="soft-ring rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-ink-900 transition hover:border-slate-400 hover:bg-slate-50"
              @click="clearSelection"
            >
              Novo
            </button>
          </div>

          <UserEditForm
            :user="selectedUser"
            :loading="savingEdition"
            :field-errors="editFieldErrors"
            :server-message="editErrorMessage"
            :success-message="editSuccessMessage"
            :apartments="activeApartments"
            :allowed-profiles="editAllowedProfiles"
            :permissions="editPermissions"
            @submit="handleUpdate"
          />
        </div>

        <div v-else-if="canCreateUsers" class="space-y-6">
          <div>
            <h3 class="font-display text-2xl text-ink-950">Novo usuário</h3>
          </div>

          <div v-if="loadingApartments" class="text-sm text-ink-700">
            Carregando apartamentos...
          </div>

          <div v-else>
            <UserCreateForm
              ref="userForm"
              :loading="savingUser"
              :field-errors="fieldErrors"
              :server-message="formErrorMessage"
              :success-message="formSuccessMessage"
              :apartments="activeApartments"
              :allowed-profiles="allowedProfiles"
              @submit="handleCreate"
            />
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
