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
        class="soft-ring w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-500"
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
        class="soft-ring w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-500"
        placeholder="Descreva o comunicado a ser publicado."
      />
      <p v-if="errors.conteudo" class="text-sm text-red-700">{{ errors.conteudo }}</p>
    </div>

    <label class="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink-700">
      <input
        v-model="form.destaque"
        type="checkbox"
        class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      >
      Marcar como destaque
    </label>

    <p v-if="localMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ localMessage }}
    </p>

    <button
      type="submit"
      class="soft-ring w-full rounded-lg bg-ink-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-700/60"
      :disabled="loading"
    >
      {{ loading ? 'Publicando...' : 'Publicar aviso' }}
    </button>
  </form>
</template>
