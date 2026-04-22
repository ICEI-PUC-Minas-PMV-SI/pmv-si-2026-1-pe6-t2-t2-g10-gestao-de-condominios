import { afterEach } from 'vitest'
import { config } from '@vue/test-utils'

afterEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  document.documentElement.classList.remove('dark')
  document.documentElement.style.colorScheme = ''
})

config.global.stubs = {
  RouterLink: {
    template: '<a><slot /></a>',
  },
}
