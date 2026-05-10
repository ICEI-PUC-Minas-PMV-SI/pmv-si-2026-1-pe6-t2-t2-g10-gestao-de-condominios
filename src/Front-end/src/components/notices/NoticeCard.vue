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
  activate: [id: number]
  setHighlight: [id: number]
  removeHighlight: [id: number]
}>()

const badgeClasses = computed(() =>
  props.notice.destaque
    ? 'border-indigo-200 bg-indigo-50 text-indigo-800 shadow-[0_0_0_1px_rgba(99,102,241,0.18)] dark:border-sky-400/50 dark:bg-sky-500/20 dark:text-sky-100'
    : 'border-slate-200 bg-slate-50 text-ink-800 shadow-[0_0_0_1px_rgba(148,163,184,0.14)] dark:!border-sky-400/60 dark:!bg-sky-500/20 dark:!text-sky-100 dark:shadow-[0_0_0_1px_rgba(56,189,248,0.22)]'
)

const articleClasses = computed(() =>
  props.notice.destaque
    ? 'border-2 border-indigo-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(219,234,254,0.82))] shadow-[0_0_0_2px_rgba(99,102,241,0.08),0_16px_40px_rgba(37,99,235,0.10)] dark:border-sky-400/35 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))] dark:shadow-[0_0_0_2px_rgba(56,189,248,0.12),0_18px_44px_rgba(2,6,23,0.48)]'
    : ''
)

const dateBadgeClasses = computed(() =>
  props.notice.destaque
    ? 'border-indigo-200/80 bg-white/70 text-slate-700 shadow-[0_0_0_1px_rgba(99,102,241,0.10)] dark:border-sky-300/25 dark:bg-slate-950/30 dark:text-sky-100'
    : ''
)

const titleClasses = computed(() =>
  props.notice.destaque
    ? 'text-slate-950 dark:text-sky-50'
    : 'text-ink-950'
)

const contentClasses = computed(() =>
  props.notice.destaque
    ? 'text-slate-700 dark:text-slate-200'
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
          <span
            v-if="!notice.ativo"
            class="pill border-red-200 bg-red-50 text-red-700 shadow-[0_0_0_1px_rgba(248,113,113,0.18)] dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100"
          >
            Inativo
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
          v-if="canManage && notice.ativo && !notice.destaque"
          type="button"
          class="soft-ring rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:bg-sky-500/20"
          @click="emit('setHighlight', notice.id)"
        >
          Definir destaque
        </button>

        <button
          v-if="canManage && notice.ativo && notice.destaque"
          type="button"
          class="soft-ring rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-100 dark:hover:bg-sky-500/20"
          @click="emit('removeHighlight', notice.id)"
        >
          Remover destaque
        </button>

        <button
          v-if="canManage && notice.ativo"
          type="button"
          class="soft-ring rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/20"
          @click="emit('archive', notice.id)"
        >
          Desativar
        </button>

        <button
          v-if="canManage && !notice.ativo"
          type="button"
          class="soft-ring rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100 dark:hover:bg-emerald-500/20"
          @click="emit('activate', notice.id)"
        >
          Reativar
        </button>
      </div>
    </div>
  </article>
</template>
