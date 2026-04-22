import { computed, shallowRef } from 'vue'

const STORAGE_KEY = 'smartsindico.theme'

const isDark = shallowRef(false)
const isReady = shallowRef(false)

function applyTheme(value: boolean) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', value)
  document.documentElement.style.colorScheme = value ? 'dark' : 'light'
}

function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return false
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark') {
    return true
  }

  if (stored === 'light') {
    return false
  }

  if (typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function persistTheme(value: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light')
}

function setTheme(value: boolean) {
  isDark.value = value
  persistTheme(value)
  applyTheme(value)
}

function toggleTheme() {
  setTheme(!isDark.value)
}

function initTheme() {
  if (isReady.value) {
    return
  }

  isDark.value = resolveInitialTheme()
  applyTheme(isDark.value)
  isReady.value = true
}

export function useTheme() {
  initTheme()

  return {
    isDark: computed(() => isDark.value),
    setTheme,
    toggleTheme,
  }
}
