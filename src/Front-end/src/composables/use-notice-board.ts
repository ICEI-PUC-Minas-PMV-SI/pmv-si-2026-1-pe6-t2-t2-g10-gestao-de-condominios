import { computed, ref, shallowRef } from 'vue'

import { createNotice, fetchNotices, updateNoticeHighlight, updateNoticeStatus } from '@/services/notice.service'
import type { ComunicadoResponse, CriacaoComunicadoRequest } from '@/types/api'

export function useNoticeBoard() {
  const notices = ref<ComunicadoResponse[]>([])
  const loading = shallowRef(false)
  const saving = shallowRef(false)

  const highlightNotice = computed(() => notices.value.find((notice) => notice.destaque))

  async function loadNotices() {
    loading.value = true

    try {
      notices.value = await fetchNotices()
    } finally {
      loading.value = false
    }
  }

  async function publishNotice(payload: CriacaoComunicadoRequest) {
    saving.value = true

    try {
      const created = await createNotice(payload)
      notices.value = [created, ...notices.value]
      return created
    } finally {
      saving.value = false
    }
  }

  async function archiveNotice(id: number) {
    const updated = await updateNoticeStatus(id, { ativo: false })
    notices.value = notices.value.filter((notice) => notice.id !== id)
    return updated
  }

  async function removeHighlight(id: number) {
    const updated = await updateNoticeHighlight(id, { destaque: false })
    notices.value = notices.value.map((notice) => (notice.id === id ? updated : notice))
    return updated
  }

  return {
    notices,
    loading,
    saving,
    highlightNotice,
    loadNotices,
    publishNotice,
    archiveNotice,
    removeHighlight,
  }
}
