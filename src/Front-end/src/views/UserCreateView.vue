<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import UserCreateForm from '@/components/users/UserCreateForm.vue'
import { USER_ROLES } from '@/constants/roles'
import { useUserDirectory } from '@/composables/use-user-directory'
import { AppError } from '@/services/http/errors'
import { useAuthStore } from '@/stores/auth'
import type { CadastroRequest } from '@/types/api'

const auth = useAuthStore()
const router = useRouter()
const formRef = useTemplateRef<InstanceType<typeof UserCreateForm>>('userForm')
const fieldErrors = shallowRef<Record<string, string[]>>({})
const errorMessage = shallowRef('')
const successMessage = shallowRef('')

const {
  activeApartments,
  loadingApartments,
  savingUser,
  loadApartments,
  registerUser,
} = useUserDirectory()

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

async function handleCreate(payload: CadastroRequest) {
  fieldErrors.value = {}
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await registerUser(payload)
    formRef.value?.resetForm()
    successMessage.value = 'Usuário cadastrado com sucesso.'
    await router.push('/usuarios')
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      fieldErrors.value = error.fieldErrors ?? {}
      return
    }

    errorMessage.value =
      error instanceof AppError ? error.message : 'Não foi possível cadastrar o usuário.'
  }
}

onMounted(loadApartments)
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="font-display text-3xl text-ink-950">Novo usuário</h2>
      </div>

      <RouterLink to="/usuarios" class="theme-secondary-button text-center">
        Voltar
      </RouterLink>
    </div>

    <div class="surface-card max-w-3xl p-6">
      <div v-if="loadingApartments" class="text-sm text-ink-700">
        Carregando apartamentos...
      </div>

      <UserCreateForm
        v-else
        ref="userForm"
        :loading="savingUser"
        :field-errors="fieldErrors"
        :server-message="errorMessage"
        :success-message="successMessage"
        :apartments="activeApartments"
        :allowed-profiles="allowedProfiles"
        @submit="handleCreate"
      />
    </div>
  </section>
</template>
