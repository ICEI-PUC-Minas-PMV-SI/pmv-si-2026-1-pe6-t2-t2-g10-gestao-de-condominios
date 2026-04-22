<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'

import { AppError } from '@/services/http/errors'
import { fetchNotices } from '@/services/notice.service'
import { useAuthStore } from '@/stores/auth'
import type { ComunicadoResponse } from '@/types/api'
import { formatDate } from '@/utils/formatters'

const auth = useAuthStore()

const firstName = computed(() => auth.usuario?.nome?.split(' ')[0] ?? 'Usuário')
const highlightedNotices = shallowRef<ComunicadoResponse[]>([])
const noticesLoading = shallowRef(false)
const noticesError = shallowRef('')

async function loadHighlightedNotices() {
  noticesLoading.value = true
  noticesError.value = ''

  try {
    const response = await fetchNotices({ page: 1, pageSize: 4 })
    highlightedNotices.value = response.items.filter((notice) => notice.destaque)
  } catch (error) {
    noticesError.value = error instanceof AppError ? error.message : 'Não foi possível carregar os comunicados.'
  } finally {
    noticesLoading.value = false
  }
}

onMounted(loadHighlightedNotices)
</script>

<template>
  <section class="space-y-4">
    <div class="surface-card p-6">
      <h2 class="font-display text-3xl text-ink-950">
        Olá, {{ firstName }}.
      </h2>
      <p class="mt-3 text-sm leading-7 text-app-secondary">
        Aqui estão os comunicados em destaque.
      </p>
    </div>

    <section class="surface-card p-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="section-kicker">Comunicados</p>
          <h3 class="mt-2 font-display text-2xl text-ink-950">Destaques</h3>
        </div>

        <RouterLink
          to="/avisos"
          class="theme-secondary-button py-2 text-center"
        >
          Ver todos
        </RouterLink>
      </div>

      <div v-if="noticesLoading" class="mt-6 text-sm text-app-secondary">
        Carregando comunicados...
      </div>

      <div v-else-if="noticesError" class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ noticesError }}
      </div>

      <div
        v-else-if="!highlightedNotices.length"
        class="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-app-secondary"
      >
        Nenhum comunicado em destaque neste momento.
      </div>

      <div v-else class="mt-6 space-y-4">
        <article
          v-for="notice in highlightedNotices"
          :key="notice.id"
          class="relative overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(254,240,138,0.78))] p-6 shadow-[0_0_0_2px_rgba(251,191,36,0.16),0_18px_42px_rgba(245,158,11,0.18)] dark:border-amber-400/70 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(69,39,8,0.94))] dark:shadow-[0_0_0_2px_rgba(251,191,36,0.14),0_22px_48px_rgba(2,6,23,0.56)]"
        >
          <div class="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,rgba(245,158,11,0.95),rgba(251,191,36,1),rgba(245,158,11,0.95))]" />

          <div class="flex flex-wrap items-center gap-2">
            <span
              class="pill border-amber-300 bg-amber-100 text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.35)] dark:border-amber-300/40 dark:bg-amber-300 dark:text-slate-950"
            >
              Destaque
            </span>
            <span
              class="pill border-amber-200/90 bg-white/75 text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.14)] dark:border-amber-300/25 dark:bg-slate-950/40 dark:text-amber-50"
            >
              {{ formatDate(notice.dataPublicacao) }}
            </span>
          </div>

          <h4 class="mt-5 max-w-3xl font-display text-2xl leading-tight text-slate-950 dark:text-white">
            {{ notice.titulo }}
          </h4>
          <p class="mt-3 max-w-3xl text-sm leading-7 text-slate-800 dark:text-slate-100">
            {{ notice.conteudo }}
          </p>

          <div class="mt-4 flex items-center justify-end gap-4">
            <RouterLink
              :to="`/avisos/${notice.id}`"
              class="inline-flex items-center rounded-lg border border-amber-300/80 bg-white/75 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-white dark:border-amber-300/30 dark:bg-slate-950/35 dark:text-amber-50 dark:hover:bg-slate-950/55"
            >
              Ver detalhes
            </RouterLink>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
