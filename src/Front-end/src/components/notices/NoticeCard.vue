<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { ComunicadoResponse } from '@/types/api'
import { formatDate } from '@/utils/formatters'

const props = defineProps<{
  notice: ComunicadoResponse
  canManage: boolean
}>()

const emit = defineEmits<{
  archive: [id: number]
  removeHighlight: [id: number]
}>()

const badgeClasses = computed(() =>
  props.notice.destaque
    ? 'border-brand-300 bg-brand-100 text-brand-800'
    : 'border-slate-200 bg-slate-50 text-ink-700',
)

const articleClasses = computed(() =>
  props.notice.destaque
    ? 'border border-brand-300 bg-brand-50/40 shadow-[0_0_0_1px_rgba(191,219,254,0.6)]'
    : '',
)
</script>

<template>
  <article class="surface-card p-5" :class="articleClasses">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="pill" :class="badgeClasses">
            {{ notice.destaque ? 'Destaque' : 'Comunicado' }}
          </span>
          <span class="pill">{{ formatDate(notice.dataPublicacao) }}</span>
        </div>

        <div>
          <h3 class="font-display text-2xl text-ink-950">{{ notice.titulo }}</h3>
          <p class="mt-2 max-w-2xl text-sm leading-7 text-ink-700">
            {{ notice.conteudo }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 flex-col gap-3 sm:w-48">
        <RouterLink
          :to="`/avisos/${notice.id}`"
          class="soft-ring rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-ink-950 transition hover:bg-slate-100"
        >
          Ver detalhes
        </RouterLink>

        <button
          v-if="canManage && notice.destaque"
          type="button"
          class="soft-ring rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          @click="emit('removeHighlight', notice.id)"
        >
          Remover destaque
        </button>

        <button
          v-if="canManage"
          type="button"
          class="soft-ring rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          @click="emit('archive', notice.id)"
        >
          Desativar
        </button>
      </div>
    </div>
  </article>
</template>
