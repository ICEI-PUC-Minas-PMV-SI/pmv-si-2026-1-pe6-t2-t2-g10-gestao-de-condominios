<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'

import { fetchNotices } from '@/services/notice.service'
import { AppError } from '@/services/http/errors'
import { useAuthStore } from '@/stores/auth'
import type { ComunicadoResponse } from '@/types/api'
import { formatDate } from '@/utils/formatters'

const auth = useAuthStore()

const firstName = computed(() => auth.usuario?.nome?.split(' ')[0] ?? 'Usuário')
const recentNotices = shallowRef<ComunicadoResponse[]>([])
const noticesLoading = shallowRef(false)
const noticesError = shallowRef('')

async function loadRecentNotices() {
  noticesLoading.value = true
  noticesError.value = ''

  try {
    const notices = await fetchNotices()
    recentNotices.value = [...notices]
      .filter((notice) => notice.ativo)
      .sort((left, right) => new Date(right.dataPublicacao).getTime() - new Date(left.dataPublicacao).getTime())
      .slice(0, 4)
  } catch (error) {
    noticesError.value = error instanceof AppError ? error.message : 'Não foi possível carregar os comunicados.'
  } finally {
    noticesLoading.value = false
  }
}

onMounted(loadRecentNotices)
</script>

<template>
  <section class="space-y-4">
    <div class="surface-card p-6">
      <h2 class="font-display text-3xl text-ink-950">
        Olá, {{ firstName }}.
      </h2>
      <p class="mt-3 text-sm leading-7 text-ink-700">
        Aqui estão os comunicados mais recentes.
      </p>
    </div>

    <section class="surface-card p-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="section-kicker">Comunicados</p>
          <h3 class="mt-2 font-display text-2xl text-ink-950">Últimos avisos</h3>
        </div>

        <RouterLink
          to="/avisos"
          class="soft-ring rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-slate-100"
        >
          Ver todos
        </RouterLink>
      </div>

      <div v-if="noticesLoading" class="mt-6 text-sm text-ink-700">
        Carregando comunicados...
      </div>

      <div v-else-if="noticesError" class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ noticesError }}
      </div>

      <div
        v-else-if="!recentNotices.length"
        class="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-ink-700"
      >
        Nenhum comunicado disponível neste momento.
      </div>

      <div v-else class="mt-6 space-y-4">
        <article
          v-for="notice in recentNotices"
          :key="notice.id"
          class="rounded-xl border border-slate-200 bg-white p-5"
          :class="notice.destaque ? 'border-brand-300 bg-brand-50/40 shadow-[0_0_0_1px_rgba(191,219,254,0.6)]' : ''"
        >
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="pill"
              :class="notice.destaque ? 'border-brand-300 bg-brand-100 text-brand-800' : 'border-slate-200 bg-slate-50 text-ink-700'"
            >
              {{ notice.destaque ? 'Destaque' : 'Comunicado' }}
            </span>
            <span class="pill">{{ formatDate(notice.dataPublicacao) }}</span>
          </div>

          <h4 class="mt-4 text-lg font-semibold text-ink-950">{{ notice.titulo }}</h4>
          <p class="mt-2 text-sm leading-7 text-ink-700">
            {{ notice.conteudo }}
          </p>

          <div class="mt-4 flex items-center justify-between gap-4">
            <RouterLink
              :to="`/avisos/${notice.id}`"
              class="ml-auto text-sm font-semibold text-brand-700 transition hover:text-brand-800"
            >
              Ver detalhes
            </RouterLink>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
