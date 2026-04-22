<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits<{
  change: [page: number]
}>()

const startItem = computed(() => {
  if (props.totalItems === 0) {
    return 0
  }

  return (props.page - 1) * props.pageSize + 1
})

const endItem = computed(() => {
  if (props.totalItems === 0) {
    return 0
  }

  return Math.min(props.page * props.pageSize, props.totalItems)
})

const visiblePages = computed(() => {
  if (props.totalPages <= 7) {
    return Array.from({ length: props.totalPages }, (_, index) => index + 1)
  }

  const pages: Array<number | string> = [1]
  const start = Math.max(2, props.page - 1)
  const end = Math.min(props.totalPages - 1, props.page + 1)

  if (start > 2) {
    pages.push('ellipsis-start')
  }

  for (let currentPage = start; currentPage <= end; currentPage += 1) {
    pages.push(currentPage)
  }

  if (end < props.totalPages - 1) {
    pages.push('ellipsis-end')
  }

  pages.push(props.totalPages)
  return pages
})

function goToPage(nextPage: number) {
  if (
    props.loading
    || nextPage < 1
    || nextPage > props.totalPages
    || nextPage === props.page
  ) {
    return
  }

  emit('change', nextPage)
}
</script>

<template>
  <div class="mt-6 flex flex-col gap-4 border-t pt-4" :style="{ borderColor: 'var(--panel-border-strong)' }">
    <p class="text-sm text-app-secondary">
      Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }} registros
    </p>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="theme-secondary-button px-3 py-2"
        :disabled="loading || page <= 1"
        @click="goToPage(page - 1)"
      >
        Anterior
      </button>

      <template v-for="entry in visiblePages" :key="`${entry}`">
        <span
          v-if="typeof entry === 'string'"
          class="px-2 text-sm text-app-secondary"
        >
          ...
        </span>

        <button
          v-else
          type="button"
          class="soft-ring min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition"
          :class="entry === page
            ? 'border-brand-500 bg-brand-600 text-white'
            : 'border-slate-300 bg-white text-ink-900 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800'"
          :disabled="loading || entry === page"
          @click="goToPage(entry)"
        >
          {{ entry }}
        </button>
      </template>

      <button
        type="button"
        class="theme-secondary-button px-3 py-2"
        :disabled="loading || page >= totalPages"
        @click="goToPage(page + 1)"
      >
        Próxima
      </button>
    </div>
  </div>
</template>
