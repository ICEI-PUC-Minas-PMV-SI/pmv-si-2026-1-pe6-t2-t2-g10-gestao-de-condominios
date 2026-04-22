import { computed, ref, shallowRef } from 'vue'

import { createNotice, fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import type { ComunicadoResponse, CriacaoComunicadoRequest, PaginationQuery } from '@/types/api'

const DEFAULT_PAGE_SIZE = 8

export function useNoticeBoard() {
  const notices = ref<ComunicadoResponse[]>([])
  const loading = shallowRef(false)
  const saving = shallowRef(false)
  const page = shallowRef(1)
  const pageSize = shallowRef(DEFAULT_PAGE_SIZE)
  const totalItems = shallowRef(0)
  const totalPages = shallowRef(1)

  const highlightNotice = computed(() => notices.value.find((notice) => notice.destaque))

  async function loadNotices(options: PaginationQuery = {}) {
    const nextPage = options.page ?? page.value
    const nextPageSize = options.pageSize ?? pageSize.value
    loading.value = true

    try {
      const response = await fetchNotices({
        page: nextPage,
        pageSize: nextPageSize,
      })

      notices.value = response.items
      page.value = response.page
      pageSize.value = response.pageSize
      totalItems.value = response.totalItems
      totalPages.value = response.totalPages
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
    return await updateNoticeStatus(id, { ativo: false })
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
    highlightNotice,
    loadNotices,
    publishNotice,
    archiveNotice,
    setHighlight,
    removeHighlight,
  }
}
