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
      errorMessage.value = 'Nao foi possivel carregar o aviso.'
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
      :class="notice.destaque ? 'border border-brand-300 bg-brand-50/40 shadow-[0_0_0_1px_rgba(191,219,254,0.6)]' : ''"
    >
      <div class="flex flex-wrap gap-2">
        <span
          class="pill"
          :class="notice.destaque ? 'border-brand-300 bg-brand-100 text-brand-800' : 'border-slate-200 bg-slate-50 text-ink-700'"
        >
          {{ notice.destaque ? 'Destaque' : 'Comunicado' }}
        </span>
        <span class="pill bg-sand-100 text-ink-700">{{ formatDate(notice.dataPublicacao) }}</span>
      </div>

      <h2 class="mt-5 max-w-4xl font-display text-4xl leading-tight text-ink-900">
        {{ notice.titulo }}
      </h2>

      <p class="mt-6 max-w-4xl text-base leading-8 text-ink-700">
        {{ notice.conteudo }}
      </p>
    </article>
  </section>
</template>
