<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import { USER_ROLES } from '@/constants/roles'
import type { ApartamentoResponse, CadastroRequest, UserRole } from '@/types/api'

type PerfilOpcao = {
  label: string
  value: CadastroRequest['perfil']
  role: UserRole
}

const props = withDefaults(
  defineProps<{
    loading?: boolean
    fieldErrors?: Record<string, string[]>
    serverMessage?: string
    successMessage?: string
    apartments?: ApartamentoResponse[]
    allowedProfiles: PerfilOpcao[]
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
  submit: [payload: CadastroRequest]
}>()

const initialPerfil = props.allowedProfiles[0]?.value ?? 1

const form = reactive<CadastroRequest>({
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  telefone: null,
  perfil: initialPerfil,
  idApartamento: null,
})

const selectedProfileValue = computed(() => Number(form.perfil) as CadastroRequest['perfil'])

const selectedRole = computed<UserRole>(() => {
  const option = props.allowedProfiles.find((item) => item.value === selectedProfileValue.value)
  return option?.role ?? USER_ROLES.Morador
})

const shouldShowApartment = computed(() => selectedRole.value === USER_ROLES.Morador)
const hasApartments = computed(() => props.apartments.length > 0)

watch(shouldShowApartment, (value) => {
  if (!value) {
    form.idApartamento = null
  }
})

function resetForm() {
  form.nome = ''
  form.email = ''
  form.senha = ''
  form.cpf = ''
  form.telefone = null
  form.perfil = props.allowedProfiles[0]?.value ?? 1
  form.idApartamento = null
}

function handleSubmit() {
  emit('submit', {
    nome: form.nome.trim(),
    email: form.email.trim(),
    senha: form.senha,
    cpf: form.cpf.trim(),
    telefone: form.telefone?.trim() ? form.telefone.trim() : null,
    perfil: selectedProfileValue.value,
    idApartamento: shouldShowApartment.value ? form.idApartamento : null,
  })
}

defineExpose({
  resetForm,
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="nome">Nome</label>
      <input
        id="nome"
        v-model="form.nome"
        type="text"
        class="theme-control"
        placeholder="Informe o nome completo"
      >
      <p v-if="fieldErrors.nome" class="text-sm text-red-700">{{ fieldErrors.nome[0] }}</p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="email">E-mail</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="theme-control"
          placeholder="usuario@dominio.com"
        >
        <p v-if="fieldErrors.email" class="text-sm text-red-700">{{ fieldErrors.email[0] }}</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="senha">Senha</label>
        <input
          id="senha"
          v-model="form.senha"
          type="password"
          class="theme-control"
          placeholder="Defina uma senha"
        >
        <p v-if="fieldErrors.senha" class="text-sm text-red-700">{{ fieldErrors.senha[0] }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="cpf">CPF</label>
        <input
          id="cpf"
          v-model="form.cpf"
          type="text"
          class="theme-control"
          placeholder="Informe o CPF"
        >
        <p v-if="fieldErrors.cpf" class="text-sm text-red-700">{{ fieldErrors.cpf[0] }}</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="telefone">Telefone</label>
        <input
          id="telefone"
          v-model="form.telefone"
          type="text"
          class="theme-control"
          placeholder="Informe um telefone"
        >
        <p v-if="fieldErrors.telefone" class="text-sm text-red-700">{{ fieldErrors.telefone[0] }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="perfil">Perfil</label>
        <select
          id="perfil"
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
        <p v-if="fieldErrors.perfil" class="text-sm text-red-700">{{ fieldErrors.perfil[0] }}</p>
      </div>

      <div v-if="shouldShowApartment" class="space-y-2">
        <label class="text-sm font-semibold text-ink-950" for="apartamento">Apartamento</label>
        <select
          id="apartamento"
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
        <p v-if="!hasApartments" class="text-sm text-ink-700">
          Não há apartamentos disponíveis para vincular no momento.
        </p>
        <p v-if="fieldErrors.idApartamento" class="text-sm text-red-700">{{ fieldErrors.idApartamento[0] }}</p>
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
      {{ loading ? 'Salvando...' : 'Cadastrar usuário' }}
    </button>
  </form>
</template>
