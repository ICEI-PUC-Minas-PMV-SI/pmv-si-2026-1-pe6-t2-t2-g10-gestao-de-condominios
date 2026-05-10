import { computed, ref, shallowRef } from 'vue'

import { createNotice, fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import type { ComunicadoResponse, CriacaoComunicadoRequest, PaginationQuery } from '@/types/api'

const DEFAULT_PAGE_SIZE = 4

export function useNoticeBoard() {
  const notices = ref<ComunicadoResponse[]>([])
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const page = shallowRef(1)
  const pageSize = shallowRef(DEFAULT_PAGE_SIZE)
  const totalItems = shallowRef(0)
  const totalPages = shallowRef(1)
  const currentAtivo = shallowRef<boolean | undefined>()

  const highlightNotice = computed(() => notices.value.find((notice) => notice.destaque))

  async function loadNotices(options: PaginationQuery = {}) {
    const nextPage = options.page ?? page.value
    const nextPageSize = options.pageSize ?? pageSize.value
    const nextAtivo = Object.prototype.hasOwnProperty.call(options, 'ativo') ? options.ativo : currentAtivo.value
    loading.value = true

    try {
      const response = await fetchNotices({
        page: nextPage,
        pageSize: nextPageSize,
        ativo: nextAtivo,
      })

      notices.value = response.items
      page.value = response.page
      pageSize.value = response.pageSize
      totalItems.value = response.totalItems
      totalPages.value = response.totalPages
      currentAtivo.value = nextAtivo
    } finally {
      loading.value = false
    }
  }

  async function publishNotice(payload: CriacaoComunicadoRequest) {
    saving.value = true

    try {
      return await createNotice(payload)
    } finally {
      saving.value = false
    }
  }

  async function archiveNotice(id: number) {
    const updatedNotice = await updateNoticeStatus(id, { ativo: false })
    notices.value = notices.value.map((notice) => (notice.id === id ? updatedNotice : notice))
    return updatedNotice
  }

  async function activateNotice(id: number) {
    const updatedNotice = await updateNoticeStatus(id, { ativo: true })
    notices.value = notices.value.map((notice) => (notice.id === id ? updatedNotice : notice))
    return updatedNotice
  }

  async function removeHighlight(id: number) {
    return await updateNoticeHighlight(id, { destaque: false })
  }

  async function setHighlight(id: number) {
    return await updateNoticeHighlight(id, { destaque: true })
  }

  return {
    notices,
    loading,
    saving,
    page,
    pageSize,
    totalItems,
    totalPages,
    currentAtivo,
    highlightNotice,
    loadNotices,
    publishNotice,
    archiveNotice,
    activateNotice,
    setHighlight,
    removeHighlight,
  }
}
