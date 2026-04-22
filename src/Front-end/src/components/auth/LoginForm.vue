<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'

import type { LoginRequest } from '@/types/api'

const emit = defineEmits<{
  submit: [payload: LoginRequest]
}>()

const props = withDefaults(
  defineProps<{
    loading?: boolean
    fieldErrors?: Record<string, string[]>
    serverMessage?: string
  }>(),
  {
    loading: false,
    fieldErrors: () => ({}),
    serverMessage: '',
  },
)

const form = reactive<LoginRequest>({
  email: '',
  senha: '',
})

const localMessage = shallowRef('')

const mergedErrors = computed(() => ({
  email: props.fieldErrors.email?.[0] ?? '',
  senha: props.fieldErrors.senha?.[0] ?? '',
}))

function handleSubmit() {
  localMessage.value = ''

  if (!form.email.trim() || !form.senha.trim()) {
    localMessage.value = 'Preencha e-mail e senha para entrar.'
    return
  }

  emit('submit', {
    email: form.email.trim(),
    senha: form.senha,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="email">E-mail</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        class="theme-control"
        placeholder="Informe seu e-mail"
      >
      <p v-if="mergedErrors.email" class="text-sm text-red-700">{{ mergedErrors.email }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="senha">Senha</label>
      <input
        id="senha"
        v-model="form.senha"
        type="password"
        autocomplete="current-password"
        class="theme-control"
        placeholder="Informe sua senha"
      >
      <p v-if="mergedErrors.senha" class="text-sm text-red-700">{{ mergedErrors.senha }}</p>
    </div>

    <p v-if="localMessage || serverMessage" class="theme-danger-banner">
      {{ localMessage || serverMessage }}
    </p>

    <button
      type="submit"
      class="theme-primary-button w-full"
      :disabled="loading"
    >
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>
  </form>
</template>
