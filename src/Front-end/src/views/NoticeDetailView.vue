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
      :class="notice.destaque ? 'border-2 border-amber-300 bg-[linear-gradient(135deg,rgba(254,249,195,0.95),rgba(253,230,138,0.6))] shadow-[0_0_0_2px_rgba(251,191,36,0.18),0_16px_40px_rgba(245,158,11,0.18)] dark:border-amber-500/70 dark:bg-[linear-gradient(135deg,rgba(120,53,15,0.85),rgba(146,64,14,0.68))] dark:shadow-[0_0_0_2px_rgba(251,191,36,0.16),0_18px_44px_rgba(120,53,15,0.42)]' : ''"
    >
      <div class="flex flex-wrap gap-2">
        <span
          class="pill"
          :class="notice.destaque ? 'border-amber-300 bg-amber-100 text-amber-900 shadow-[0_0_0_1px_rgba(251,191,36,0.35)] dark:border-amber-500/60 dark:bg-amber-400 dark:text-slate-950' : 'border-slate-200 bg-slate-50 text-ink-800 shadow-[0_0_0_1px_rgba(148,163,184,0.14)] dark:!border-sky-200/80 dark:!bg-sky-200 dark:!text-slate-950 dark:shadow-[0_0_0_1px_rgba(186,230,253,0.34)]'"
        >
          {{ notice.destaque ? 'Destaque' : 'Comunicado' }}
        </span>
        <span
          class="pill"
          :class="notice.destaque ? 'border-amber-200/90 bg-white/65 text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.14)] dark:border-amber-300/25 dark:bg-slate-950/28 dark:text-amber-50' : 'bg-sand-100 text-ink-700'"
        >
          {{ formatDate(notice.dataPublicacao) }}
        </span>
      </div>

      <h2
        class="mt-5 max-w-4xl font-display text-4xl leading-tight"
        :class="notice.destaque ? 'text-amber-950 dark:text-amber-50' : 'text-ink-900'"
      >
        {{ notice.titulo }}
      </h2>

      <p
        class="mt-6 max-w-4xl text-base leading-8"
        :class="notice.destaque ? 'text-amber-950/90 dark:text-amber-100' : 'text-ink-700'"
      >
        {{ notice.conteudo }}
      </p>
    </article>
  </section>
</template>
