<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import { USER_ROLES } from '@/constants/roles'
import { formatApartment, formatRole } from '@/utils/formatters'
import type {
  ApartamentoResponse,
  AtualizacaoUsuarioRequest,
  UserRole,
  UsuarioResponse,
} from '@/types/api'

type PerfilOpcao = {
  label: string
  value: AtualizacaoUsuarioRequest['perfil']
  role: UserRole
}

type UserEditPermissions = {
  canEditNome: boolean
  canEditEmail: boolean
  canEditTelefone: boolean
  canEditSenha: boolean
  canEditPerfil: boolean
  canEditApartamento: boolean
  canEditAtivo: boolean
}

type EditableFormState = {
  nome: string
  email: string
  senha: string
  telefone: string | null
  perfil: AtualizacaoUsuarioRequest['perfil']
  idApartamento: number | null
  ativo: boolean
}

const ROLE_VALUES: Record<UserRole, AtualizacaoUsuarioRequest['perfil']> = {
  Morador: 1,
  Funcionario: 2,
  Sindico: 3,
}

const props = withDefaults(
  defineProps<{
    user: UsuarioResponse
    loading?: boolean
    fieldErrors?: Record<string, string[]>
    serverMessage?: string
    successMessage?: string
    apartments?: ApartamentoResponse[]
    allowedProfiles: PerfilOpcao[]
    permissions: UserEditPermissions
  }>(),
  {
    loading: false,
    fieldErrors: () => ({}),
    serverMessage: '',
    successMessage: '',
    apartments: () => [],
  },
)

const emit = defineEmits<{
  submit: [payload: AtualizacaoUsuarioRequest]
}>()

const form = reactive<EditableFormState>({
  nome: '',
  email: '',
  senha: '',
  telefone: null,
  perfil: 1,
  idApartamento: null,
  ativo: true,
})

const selectedProfileValue = computed(() => Number(form.perfil) as AtualizacaoUsuarioRequest['perfil'])

const selectedRole = computed<UserRole>(() => {
  const option = props.allowedProfiles.find((item) => item.value === selectedProfileValue.value)
  return option?.role ?? props.user.perfil
})

const shouldShowApartment = computed(() => selectedRole.value === USER_ROLES.Morador)
const hasApartments = computed(() => props.apartments.length > 0)

watch(
  () => props.user,
  (user) => {
    form.nome = user.nome
    form.email = user.email
    form.senha = ''
    form.telefone = user.telefone
    form.perfil = ROLE_VALUES[user.perfil]
    form.idApartamento = user.idApartamento
    form.ativo = user.ativo
  },
  { immediate: true },
)

watch(shouldShowApartment, (value) => {
  if (!value) {
    form.idApartamento = null
  }
})

function handleSubmit() {
  emit('submit', {
    nome: form.nome.trim(),
    email: form.email.trim(),
    senha: form.senha.trim() ? form.senha.trim() : null,
    telefone: form.telefone?.trim() ? form.telefone.trim() : null,
    perfil: selectedProfileValue.value,
    idApartamento: shouldShowApartment.value ? form.idApartamento : null,
    ativo: form.ativo,
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="edit-nome">Nome</label>
      <input
        id="edit-nome"
        v-model="form.nome"
        type="text"
        :disabled="!permissions.canEditNome"
        class="theme-control"
        placeholder="Informe o nome completo"
      >
      <p v-if="fieldErrors.nome" class="text-sm text-red-700">{{ fieldErrors.nome[0] }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="edit-email">E-mail</label>
        <input
          id="edit-email"
          v-model="form.email"
          type="email"
          :disabled="!permissions.canEditEmail"
          class="theme-control"
          placeholder="usuario@dominio.com"
        >
        <p v-if="fieldErrors.email" class="text-sm text-red-700">{{ fieldErrors.email[0] }}</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950">CPF</label>
        <div class="theme-static-field">
          {{ user.cpf }}
        </div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="edit-telefone">Telefone</label>
        <input
          id="edit-telefone"
          v-model="form.telefone"
          type="text"
          :disabled="!permissions.canEditTelefone"
          class="theme-control"
          placeholder="Informe um telefone"
        >
        <p v-if="fieldErrors.telefone" class="text-sm text-red-700">{{ fieldErrors.telefone[0] }}</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="edit-senha">Nova senha</label>
        <input
          id="edit-senha"
          v-model="form.senha"
          type="password"
          :disabled="!permissions.canEditSenha"
          class="theme-control"
          placeholder="Preencha apenas se quiser alterar"
        >
        <p v-if="fieldErrors.senha" class="text-sm text-red-700">{{ fieldErrors.senha[0] }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950">Perfil</label>
        <select
          v-if="permissions.canEditPerfil"
          v-model="form.perfil"
          class="theme-control"
        >
          <option
            v-for="profile in allowedProfiles"
            :key="profile.value"
            :value="profile.value"
          >
            {{ profile.label }}
          </option>
        </select>
        <div
          v-else
          class="theme-static-field"
        >
          {{ formatRole(user.perfil) }}
        </div>
        <p v-if="fieldErrors.perfil" class="text-sm text-red-700">{{ fieldErrors.perfil[0] }}</p>
      </div>

      <div v-if="shouldShowApartment" class="space-y-2">
        <label class="text-sm font-semibold text-ink-950">Apartamento</label>
        <select
          v-if="permissions.canEditApartamento"
          v-model="form.idApartamento"
          class="theme-control"
          :disabled="!hasApartments"
        >
          <option :value="null">
            {{ hasApartments ? 'Selecione um apartamento' : 'Nenhum apartamento disponível' }}
          </option>
          <option
            v-for="apartment in apartments"
            :key="apartment.id"
            :value="apartment.id"
          >
            {{ apartment.numero }}
          </option>
        </select>
        <div
          v-else
          class="theme-static-field"
        >
          {{ formatApartment(user.idApartamento) }}
        </div>
        <p v-if="permissions.canEditApartamento && !hasApartments" class="text-sm text-ink-700">
          Não há apartamentos disponíveis para vincular no momento.
        </p>
        <p v-if="fieldErrors.idApartamento" class="text-sm text-red-700">{{ fieldErrors.idApartamento[0] }}</p>
      </div>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950">Status</label>
      <label
        v-if="permissions.canEditAtivo"
        class="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
        :style="{ borderColor: 'var(--panel-border-strong)', background: 'var(--panel-bg)', color: 'var(--text-primary)' }"
      >
        <input v-model="form.ativo" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-brand-600">
        <span>{{ form.ativo ? 'Usuário ativo' : 'Usuário inativo' }}</span>
      </label>
      <div
        v-else
        class="theme-static-field"
      >
        {{ user.ativo ? 'Ativo' : 'Inativo' }}
      </div>
    </div>

    <p v-if="serverMessage" class="theme-danger-banner">
      {{ serverMessage }}
    </p>

    <p v-if="successMessage" class="theme-success-banner">
      {{ successMessage }}
    </p>

    <button
      type="submit"
      class="theme-primary-button"
      :disabled="loading"
    >
      {{ loading ? 'Salvando...' : 'Salvar alterações' }}
    </button>
  </form>
</template>
