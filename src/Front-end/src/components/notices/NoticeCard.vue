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
  setHighlight: [id: number]
  removeHighlight: [id: number]
}>()

const badgeClasses = computed(() =>
  props.notice.destaque
    ? 'border-amber-300 bg-amber-100 text-amber-900 shadow-[0_0_0_1px_rgba(251,191,36,0.35)] dark:border-amber-500/60 dark:bg-amber-400 dark:text-slate-950'
    : 'border-slate-200 bg-slate-50 text-ink-800 shadow-[0_0_0_1px_rgba(148,163,184,0.14)] dark:!border-sky-200/80 dark:!bg-sky-200 dark:!text-slate-950 dark:shadow-[0_0_0_1px_rgba(186,230,253,0.34)]'
)

const articleClasses = computed(() =>
  props.notice.destaque
    ? 'border-2 border-amber-300 bg-[linear-gradient(135deg,rgba(254,249,195,0.95),rgba(253,230,138,0.6))] shadow-[0_0_0_2px_rgba(251,191,36,0.18),0_16px_40px_rgba(245,158,11,0.18)] dark:border-amber-500/70 dark:bg-[linear-gradient(135deg,rgba(120,53,15,0.85),rgba(146,64,14,0.68))] dark:shadow-[0_0_0_2px_rgba(251,191,36,0.16),0_18px_44px_rgba(120,53,15,0.42)]'
    : ''
)

const dateBadgeClasses = computed(() =>
  props.notice.destaque
    ? 'border-amber-200/90 bg-white/65 text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.14)] dark:border-amber-300/25 dark:bg-slate-950/28 dark:text-amber-50'
    : ''
)

const titleClasses = computed(() =>
  props.notice.destaque
    ? 'text-amber-950 dark:text-amber-50'
    : 'text-ink-950'
)

const contentClasses = computed(() =>
  props.notice.destaque
    ? 'text-amber-950/90 dark:text-amber-100'
    : 'text-app-secondary'
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
          <span class="pill" :class="dateBadgeClasses">{{ formatDate(notice.dataPublicacao) }}</span>
        </div>

        <div>
          <h3 class="font-display text-2xl" :class="titleClasses">{{ notice.titulo }}</h3>
          <p class="mt-2 max-w-2xl text-sm leading-7" :class="contentClasses">
            {{ notice.conteudo }}
          </p>
        </div>
      </div>

      <div class="flex shrink-0 flex-col gap-3 sm:w-48">
        <RouterLink
          :to="`/avisos/${notice.id}`"
          class="theme-secondary-button text-center"
        >
          Ver detalhes
        </RouterLink>

        <button
          v-if="canManage && !notice.destaque"
          type="button"
          class="soft-ring rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:bg-sky-500/20"
          @click="emit('setHighlight', notice.id)"
        >
          Definir destaque
        </button>

        <button
          v-if="canManage && notice.destaque"
          type="button"
          class="soft-ring rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100 dark:hover:bg-amber-500/20"
          @click="emit('removeHighlight', notice.id)"
        >
          Remover destaque
        </button>

        <button
          v-if="canManage"
          type="button"
          class="soft-ring rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20"
          @click="emit('archive', notice.id)"
        >
          Desativar
        </button>
      </div>
    </div>
  </article>
</template>
