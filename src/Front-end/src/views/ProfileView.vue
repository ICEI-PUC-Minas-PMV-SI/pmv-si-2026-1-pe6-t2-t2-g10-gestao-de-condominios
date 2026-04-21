<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'

import UserEditForm from '@/components/users/UserEditForm.vue'
import { USER_ROLES } from '@/constants/roles'
import { AppError } from '@/services/http/errors'
import { fetchApartments } from '@/services/apartment.service'
import { fetchUserById, updateUser } from '@/services/user.service'
import { useAuthStore } from '@/stores/auth'
import type {
  ApartamentoResponse,
  AtualizacaoUsuarioRequest,
  UsuarioResponse,
} from '@/types/api'
import { formatDate } from '@/utils/formatters'

const auth = useAuthStore()
const profile = ref<UsuarioResponse | null>(null)
const apartments = ref<ApartamentoResponse[]>([])
const loading = shallowRef(false)
const saving = shallowRef(false)
const errorMessage = shallowRef('')
const saveErrorMessage = shallowRef('')
const saveSuccessMessage = shallowRef('')
const fieldErrors = shallowRef<Record<string, string[]>>({})

const allowedProfiles = computed(() => {
  if (auth.role === USER_ROLES.Sindico) {
    return [
      { label: 'Morador', value: 1 as const, role: USER_ROLES.Morador },
      { label: 'Funcionário', value: 2 as const, role: USER_ROLES.Funcionario },
      { label: 'Síndico', value: 3 as const, role: USER_ROLES.Sindico },
    ]
  }

  if (auth.role === USER_ROLES.Funcionario) {
    return [
      { label: 'Morador', value: 1 as const, role: USER_ROLES.Morador },
      { label: 'Funcionário', value: 2 as const, role: USER_ROLES.Funcionario },
    ]
  }

  return [{ label: 'Morador', value: 1 as const, role: USER_ROLES.Morador }]
})

const permissions = computed(() => {
  if (auth.role === USER_ROLES.Sindico || auth.role === USER_ROLES.Funcionario) {
    return {
      canEditNome: true,
      canEditEmail: true,
      canEditTelefone: true,
      canEditSenha: true,
      canEditPerfil: true,
      canEditApartamento: true,
      canEditAtivo: true,
    }
  }

  return {
    canEditNome: true,
    canEditEmail: true,
    canEditTelefone: true,
    canEditSenha: true,
    canEditPerfil: false,
    canEditApartamento: false,
    canEditAtivo: false,
  }
})

const activeApartments = computed(() => apartments.value.filter((apartment) => apartment.ativo))

async function loadProfile() {
  if (!auth.usuario) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const [userProfile, availableApartments] = await Promise.all([
      fetchUserById(auth.usuario.id),
      fetchApartments(),
    ])

    profile.value = userProfile
    apartments.value = availableApartments
  } catch (error) {
    if (error instanceof AppError) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Não foi possível carregar o perfil.'
    }
  } finally {
    loading.value = false
  }
}

async function handleUpdate(payload: AtualizacaoUsuarioRequest) {
  if (!profile.value) {
    return
  }

  saving.value = true
  saveErrorMessage.value = ''
  saveSuccessMessage.value = ''
  fieldErrors.value = {}

  try {
    const updatedProfile = await updateUser(profile.value.id, payload)
    profile.value = updatedProfile
    auth.syncProfile(updatedProfile)
    saveSuccessMessage.value = 'Dados atualizados com sucesso.'
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      fieldErrors.value = error.fieldErrors ?? {}
    } else if (error instanceof AppError) {
      saveErrorMessage.value = error.message
    } else {
      saveErrorMessage.value = 'Não foi possível salvar as alterações.'
    }
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <section class="space-y-6">
    <div v-if="loading" class="surface-card p-6 text-sm text-ink-700">
      Carregando dados do perfil...
    </div>

    <div v-else-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div v-else-if="profile" class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <article class="surface-card p-6">
        <div class="mb-6 space-y-2">
          <h2 class="font-display text-3xl text-ink-950">Perfil</h2>
          <p class="text-sm text-ink-700">Atualize os dados permitidos da sua conta.</p>
        </div>

        <UserEditForm
          :user="profile"
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

      <aside class="surface-card p-6">
        <h3 class="font-display text-2xl text-ink-950">Informações da conta</h3>
        <dl class="mt-6 space-y-5">
          <div>
            <dt class="text-xs uppercase tracking-[0.2em] text-ink-600">CPF</dt>
            <dd class="mt-2 text-sm font-medium text-ink-950">{{ profile.cpf }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.2em] text-ink-600">Criado em</dt>
            <dd class="mt-2 text-sm font-medium text-ink-950">{{ formatDate(profile.dataCriacao) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-[0.2em] text-ink-600">Último login</dt>
            <dd class="mt-2 text-sm font-medium text-ink-950">
              {{ profile.dataUltimoLogin ? formatDate(profile.dataUltimoLogin) : 'Sem registro ainda' }}
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>
</template>
