import { useTheme } from '@/composables/use-theme'

describe('useTheme', () => {
  it('aplica e persiste o modo dark', () => {
    const { isDark, setTheme } = useTheme()

    setTheme(true)

    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('smartsindico.theme')).toBe('dark')
  })
})
