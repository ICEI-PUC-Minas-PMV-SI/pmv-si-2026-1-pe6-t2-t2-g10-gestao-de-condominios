<script setup lang="ts">
import { computed, reactive, shallowRef } from 'vue'

import type { CriacaoComunicadoRequest } from '@/types/api'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    fieldErrors?: Record<string, string[]>
  }>(),
  {
    loading: false,
    fieldErrors: () => ({}),
  },
)

const emit = defineEmits<{
  submit: [payload: CriacaoComunicadoRequest]
}>()

const form = reactive<CriacaoComunicadoRequest>({
  titulo: '',
  conteudo: '',
  destaque: false,
})

const localMessage = shallowRef('')

const errors = computed(() => ({
  titulo: props.fieldErrors.titulo?.[0] ?? '',
  conteudo: props.fieldErrors.conteudo?.[0] ?? '',
}))

function resetForm() {
  form.titulo = ''
  form.conteudo = ''
  form.destaque = false
}

function handleSubmit() {
  localMessage.value = ''

  if (!form.titulo.trim() || !form.conteudo.trim()) {
    localMessage.value = 'Preencha título e conteúdo do aviso.'
    return
  }

  emit('submit', {
    titulo: form.titulo.trim(),
    conteudo: form.conteudo.trim(),
    destaque: form.destaque,
  })
}

defineExpose({
  resetForm,
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="titulo">Título</label>
      <input
        id="titulo"
        v-model="form.titulo"
        type="text"
        maxlength="150"
        class="theme-control"
        placeholder="Informe o título do comunicado"
      >
      <p v-if="errors.titulo" class="text-sm text-red-700">{{ errors.titulo }}</p>
    </div>

    <div class="space-y-2">
      <label class="text-sm font-semibold text-ink-950" for="conteudo">Conteúdo</label>
      <textarea
        id="conteudo"
        v-model="form.conteudo"
        rows="5"
        class="theme-control"
        placeholder="Descreva o comunicado a ser publicado."
      />
      <p v-if="errors.conteudo" class="text-sm text-red-700">{{ errors.conteudo }}</p>
    </div>

    <label
      class="flex items-center gap-3 rounded-lg border px-4 py-3 text-sm"
      :style="{ borderColor: 'var(--panel-border-strong)', background: 'var(--panel-muted-bg)', color: 'var(--text-secondary)' }"
    >
      <input
        v-model="form.destaque"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      >
      Marcar como destaque
    </label>

    <p v-if="localMessage" class="theme-danger-banner">
      {{ localMessage }}
    </p>

    <button
      type="submit"
      class="theme-primary-button w-full"
      :disabled="loading"
    >
      {{ loading ? 'Publicando...' : 'Publicar aviso' }}
    </button>
  </form>
</template>
