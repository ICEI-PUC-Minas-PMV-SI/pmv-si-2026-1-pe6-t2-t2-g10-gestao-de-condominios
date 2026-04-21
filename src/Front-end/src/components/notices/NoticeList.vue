<script setup lang="ts">
import NoticeCard from './NoticeCard.vue'
import type { ComunicadoResponse } from '@/types/api'

defineProps<{
  notices: ComunicadoResponse[]
  canManage: boolean
}>()

const emit = defineEmits<{
  archive: [id: number]
  removeHighlight: [id: number]
}>()
</script>

<template>
  <div class="space-y-4">
    <NoticeCard
      v-for="notice in notices"
      :key="notice.id"
      :notice="notice"
      :can-manage="canManage"
      @archive="emit('archive', $event)"
      @remove-highlight="emit('removeHighlight', $event)"
    />
  </div>
</template>
