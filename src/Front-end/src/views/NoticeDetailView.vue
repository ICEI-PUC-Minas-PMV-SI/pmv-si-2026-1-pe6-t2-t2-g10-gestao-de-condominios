<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { AppError } from '@/services/http/errors'
import { fetchNoticeById } from '@/services/notice.service'
import type { ComunicadoResponse } from '@/types/api'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const notice = ref<ComunicadoResponse | null>(null)
const loading = shallowRef(false)
const errorMessage = shallowRef('')

const noticeId = computed(() => Number(route.params.id))

async function loadNotice() {
  loading.value = true
  errorMessage.value = ''

  try {
    notice.value = await fetchNoticeById(noticeId.value)
  } catch (error) {
    if (error instanceof AppError) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Não foi possível carregar o aviso.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(loadNotice)
</script>

<template>
  <section class="space-y-6">
    <RouterLink
      to="/avisos"
      class="soft-ring inline-flex rounded-full bg-sand-100 px-4 py-2 text-sm font-semibold text-ink-900 transition hover:bg-brand-100"
    >
      Voltar ao mural
    </RouterLink>

    <div v-if="loading" class="surface-card p-6 text-sm text-ink-700">
      Carregando aviso...
    </div>

    <div v-else-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <article
      v-else-if="notice"
      class="surface-card p-6 sm:p-8"
      :class="notice.destaque ? 'border-2 border-indigo-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.98),rgba(219,234,254,0.82))] shadow-[0_0_0_2px_rgba(99,102,241,0.08),0_16px_40px_rgba(37,99,235,0.10)] dark:border-sky-400/35 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9))] dark:shadow-[0_0_0_2px_rgba(56,189,248,0.12),0_18px_44px_rgba(2,6,23,0.48)]' : ''"
    >
      <div class="flex flex-wrap gap-2">
        <span
          class="pill"
          :class="notice.destaque ? 'border-indigo-200 bg-indigo-50 text-indigo-800 shadow-[0_0_0_1px_rgba(99,102,241,0.18)] dark:border-sky-400/50 dark:bg-sky-500/20 dark:text-sky-100' : 'border-slate-200 bg-slate-50 text-ink-800 shadow-[0_0_0_1px_rgba(148,163,184,0.14)] dark:!border-sky-400/60 dark:!bg-sky-500/20 dark:!text-sky-100 dark:shadow-[0_0_0_1px_rgba(56,189,248,0.22)]'"
        >
          {{ notice.destaque ? 'Destaque' : 'Comunicado' }}
        </span>
        <span
          class="pill"
          :class="notice.destaque ? 'border-indigo-200/80 bg-white/70 text-slate-700 shadow-[0_0_0_1px_rgba(99,102,241,0.10)] dark:border-sky-300/25 dark:bg-slate-950/30 dark:text-sky-100' : 'bg-sand-100 text-ink-700'"
        >
          {{ formatDate(notice.dataPublicacao) }}
        </span>
      </div>

      <h2
        class="mt-5 max-w-4xl font-display text-4xl leading-tight"
        :class="notice.destaque ? 'text-slate-950 dark:text-sky-50' : 'text-ink-900'"
      >
        {{ notice.titulo }}
      </h2>

      <p
        class="mt-6 max-w-4xl text-base leading-8"
        :class="notice.destaque ? 'text-slate-700 dark:text-slate-200' : 'text-ink-700'"
      >
        {{ notice.conteudo }}
      </p>
    </article>
  </section>
</template>
