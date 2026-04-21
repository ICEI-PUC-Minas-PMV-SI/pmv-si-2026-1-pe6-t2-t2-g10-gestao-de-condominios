<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef } from 'vue'

import NoticeCreateForm from '@/components/notices/NoticeCreateForm.vue'
import NoticeList from '@/components/notices/NoticeList.vue'
import { NOTICE_MANAGER_ROLES } from '@/constants/roles'
import { useNoticeBoard } from '@/composables/use-notice-board'
import { AppError } from '@/services/http/errors'
import { useAuthStore } from '@/stores/auth'
import type { CriacaoComunicadoRequest } from '@/types/api'

const auth = useAuthStore()
const formRef = useTemplateRef<InstanceType<typeof NoticeCreateForm>>('noticeForm')
const errorMessage = shallowRef('')
const fieldErrors = shallowRef<Record<string, string[]>>({})

const {
  notices,
  loading,
  saving,
  highlightNotice,
  loadNotices,
  publishNotice,
  archiveNotice,
  removeHighlight,
} = useNoticeBoard()

const canManageNotices = computed(() => !!auth.role && NOTICE_MANAGER_ROLES.includes(auth.role))
const contentGridClass = computed(() =>
  canManageNotices.value ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]' : 'space-y-4',
)

async function refreshBoard() {
  errorMessage.value = ''

  try {
    await loadNotices()
  } catch (error) {
    if (error instanceof AppError) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Não foi possível carregar os comunicados.'
    }
  }
}

async function handleCreate(payload: CriacaoComunicadoRequest) {
  fieldErrors.value = {}
  errorMessage.value = ''

  try {
    await publishNotice(payload)
    formRef.value?.resetForm()
  } catch (error) {
    if (error instanceof AppError && error.type === 'validation') {
      fieldErrors.value = error.fieldErrors ?? {}
      return
    }

    errorMessage.value = error instanceof AppError ? error.message : 'Não foi possível publicar o comunicado.'
  }
}

async function handleArchive(id: number) {
  errorMessage.value = ''

  try {
    await archiveNotice(id)
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Não foi possível desativar o comunicado.'
  }
}

async function handleRemoveHighlight(id: number) {
  errorMessage.value = ''

  try {
    await removeHighlight(id)
  } catch (error) {
    errorMessage.value = error instanceof AppError ? error.message : 'Não foi possível remover o destaque.'
  }
}

onMounted(refreshBoard)
</script>

<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <h2 class="font-display text-3xl text-ink-950">Comunicados</h2>
    </div>

    <div v-if="errorMessage" class="surface-card border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div :class="contentGridClass">
      <section class="surface-card p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-display text-2xl text-ink-950">Mural</h3>
          </div>

          <div
            v-if="highlightNotice"
            class="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800"
          >
            Destaque atual: {{ highlightNotice.titulo }}
          </div>
        </div>

        <div v-if="loading" class="mt-6 text-sm text-ink-700">
          Carregando comunicados...
        </div>

        <div
          v-else-if="!notices.length"
          class="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-ink-700"
        >
          Nenhum comunicado foi localizado neste momento.
        </div>

        <div v-else class="mt-6">
          <NoticeList
            :notices="notices"
            :can-manage="canManageNotices"
            @archive="handleArchive"
            @remove-highlight="handleRemoveHighlight"
          />
        </div>
      </section>

      <aside v-if="canManageNotices" class="surface-card p-6">
        <div class="space-y-6">
          <div v-if="highlightNotice" class="rounded-xl border border-brand-200 bg-brand-50/60 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-brand-700">Em destaque</p>
            <p class="mt-2 text-sm font-semibold text-ink-950">{{ highlightNotice.titulo }}</p>
          </div>

          <div>
            <h3 class="font-display text-2xl text-ink-950">Novo comunicado</h3>
          </div>
        </div>

        <div class="mt-6">
          <NoticeCreateForm
            ref="noticeForm"
            :loading="saving"
            :field-errors="fieldErrors"
            @submit="handleCreate"
          />
        </div>
      </aside>
    </div>
  </section>
</template>
