<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import UserEditForm from '@/components/users/UserEditForm.vue'
import { USER_ROLES } from '@/constants/roles'
import { fetchApartments } from '@/services/apartment.service'
import { AppError } from '@/services/http/errors'
import { fetchUserById, updateUser } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth'
import type {
  ApartamentoResponse,
  AtualizacaoUsuarioRequest,
  UsuarioResponse,
} from '@/types/api'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const user = ref<UsuarioResponse | null>(null)
const apartments = ref<ApartamentoResponse[]>([])
const loading = shallowRef(false)
const saving = shallowRef(false)
const errorMessage = shallowRef('')
const saveErrorMessage = shallowRef('')
const saveSuccessMessage = shallowRef('')
const fieldErrors = shallowRef<Record<string, string[]>>({})

const userId = computed(() => Number(route.params.id))

const allowedProfiles = computed(() => {
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

const permissions = computed(() => ({
  canEditNome: true,
  canEditEmail: true,
  canEditTelefone: true,
  canEditSenha: true,
  canEditPerfil: true,
  canEditApartamento: true,
  canEditAtivo: true,
}))

const activeApartments = computed(() => apartments.value.filter((apartment) => apartment.ativo))

async function loadUser() {
  loading.value = true
  errorMessage.value = ''

  try {
    const [selectedUser, availableApartments] = await Promise.all([
      fetchUserById(userId.value),
      fetchApartments(),
    ])

    user.value = selectedUser
    apartments.value = availableApartments
  } catch (error) {
    errorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível carregar o usuário.'
  } finally {
    loading.value = false
  }
}

async function handleUpdate(payload: AtualizacaoUsuarioRequest) {
  if (!user.value) {
    return
  }

  saving.value = true
  fieldErrors.value = {}
  saveErrorMessage.value = ''
  saveSuccessMessage.value = ''

  try {
    const updatedUser = await updateUser(user.value.id, payload)
    user.value = updatedUser

    if (auth.usuario?.id === updatedUser.id) {
      auth.syncProfile(updatedUser)
    }

    saveSuccessMessage.value = 'Usuário atualizado com sucesso.'
    await router.push('/usuarios')
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      fieldErrors.value = error.fieldErrors ?? {}
      return
    }

    saveErrorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível salvar as alterações.'
  } finally {
    saving.value = false
  }
}

onMounted(loadUser)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="font-display text-3xl text-ink-950">Editar usuário</h2>
        <p v-if="user" class="mt-2 text-sm text-ink-700">{{ user.nome }}</p>
      </div>

      <RouterLink to="/usuarios" class="theme-secondary-button text-center">
        Voltar
      </RouterLink>
    </div>

    <div v-if="loading" class="surface-card p-6 text-sm text-ink-700">
      Carregando usuário...
    </div>

    <div v-else-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <article v-else-if="user" class="surface-card max-w-3xl p-6">
      <UserEditForm
        :user="user"
        :loading="saving"
        :field-errors="fieldErrors"
        :server-message="saveErrorMessage"
        :success-message="saveSuccessMessage"
        :apartments="activeApartments"
        :allowed-profiles="allowedProfiles"
        :permissions="permissions"
        @submit="handleUpdate"
      />
    </article>
  </section>
</template>
