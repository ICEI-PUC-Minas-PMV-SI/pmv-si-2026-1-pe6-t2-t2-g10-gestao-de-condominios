<script setup lang="ts">
import { computed } from 'vue'

import { useTheme } from '@/composables/use-theme'

const props = withDefaults(
  defineProps<{
    inverted?: boolean
    fullWidth?: boolean
  }>(),
  {
    inverted: false,
    fullWidth: false,
  },
)

const { isDark, toggleTheme } = useTheme()

const buttonClass = computed(() => [
  'soft-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition',
  props.fullWidth ? 'w-full' : '',
  props.inverted
    ? 'border border-white/12 bg-white/8 text-white hover:bg-white/14'
    : 'theme-secondary-button',
])

const label = computed(() => (isDark.value ? 'Claro' : 'Escuro'))
</script>

<template>
  <button type="button" :class="buttonClass" @click="toggleTheme">
    <svg
      v-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
      class="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.2" />
      <path d="M12 19.8V22" />
      <path d="m4.93 4.93 1.56 1.56" />
      <path d="m17.51 17.51 1.56 1.56" />
      <path d="M2 12h2.2" />
      <path d="M19.8 12H22" />
      <path d="m4.93 19.07 1.56-1.56" />
      <path d="m17.51 6.49 1.56-1.56" />
    </svg>

    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.8"
      class="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>

    <span>{{ label }}</span>
  </button>
</template>
