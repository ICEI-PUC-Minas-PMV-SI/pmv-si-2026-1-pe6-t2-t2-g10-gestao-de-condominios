import { Moon, Sun } from 'lucide-react-native'
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native'

export type ThemeMode = 'light' | 'dark'

export interface AppTheme {
  mode: ThemeMode
  colors: {
    appBg: string
    surface: string
    surfaceSoft: string
    surfaceStrong: string
    border: string
    borderStrong: string
    text: string
    textSecondary: string
    textMuted: string
    brand: string
    brandStrong: string
    brandSoft: string
    mint: string
    primaryButtonBg: string
    primaryButtonText: string
    successBg: string
    successText: string
    dangerBg: string
    dangerText: string
    tabBg: string
  }
  shadow: {
    shadowColor: string
    shadowOpacity: number
    shadowRadius: number
    shadowOffset: { width: number; height: number }
    elevation: number
  }
}

const lightTheme: AppTheme = {
  mode: 'light',
  colors: {
    appBg: '#eef2f7',
    surface: 'rgba(255,255,255,0.96)',
    surfaceSoft: '#f8fafc',
    surfaceStrong: '#ffffff',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    text: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    brand: '#2563eb',
    brandStrong: '#1e40af',
    brandSoft: '#dbeafe',
    mint: '#0f766e',
    primaryButtonBg: '#0f172a',
    primaryButtonText: '#ffffff',
    successBg: '#ecfdf5',
    successText: '#047857',
    dangerBg: '#fef2f2',
    dangerText: '#b91c1c',
    tabBg: '#ffffff',
  },
  shadow: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
}

const darkTheme: AppTheme = {
  mode: 'dark',
  colors: {
    appBg: '#020617',
    surface: 'rgba(15,23,42,0.92)',
    surfaceSoft: '#0f172a',
    surfaceStrong: '#1e293b',
    border: '#334155',
    borderStrong: '#475569',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    brand: '#60a5fa',
    brandStrong: '#2563eb',
    brandSoft: 'rgba(37,99,235,0.18)',
    mint: '#2dd4bf',
    primaryButtonBg: '#2563eb',
    primaryButtonText: '#ffffff',
    successBg: 'rgba(6,78,59,0.28)',
    successText: '#6ee7b7',
    dangerBg: 'rgba(127,29,29,0.28)',
    dangerText: '#fca5a5',
    tabBg: '#020617',
  },
  shadow: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
}

interface ThemeContextValue {
  theme: AppTheme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemTheme = useColorScheme()
  const [manualTheme, setManualTheme] = useState<ThemeMode | null>(null)
  const mode: ThemeMode = manualTheme ?? (systemTheme === 'dark' ? 'dark' : 'light')
  const theme = mode === 'dark' ? darkTheme : lightTheme

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark: theme.mode === 'dark',
    toggleTheme() {
      setManualTheme((current) => {
        const currentMode = current ?? mode
        return currentMode === 'dark' ? 'light' : 'dark'
      })
    },
  }), [mode, theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)

  if (!value) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider.')
  }

  return value
}

export function ThemeToggle() {
  const { isDark, theme, toggleTheme } = useTheme()
  const Icon = isDark ? Sun : Moon

  return (
    <Pressable
      accessibilityRole="button"
      onPress={toggleTheme}
      style={[styles.toggle, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceStrong }]}
    >
      <Icon size={18} color={theme.colors.text} />
      <Text style={[styles.toggleText, { color: theme.colors.text }]}>{isDark ? 'Claro' : 'Escuro'}</Text>
    </Pressable>
  )
}

export function BrandMark() {
  const { theme } = useTheme()

  return (
    <View style={[styles.brandMark, { backgroundColor: theme.colors.brandSoft, borderColor: theme.colors.border }]}>
      <Text style={[styles.brandText, { color: theme.colors.brandStrong }]}>SS</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  toggle: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  brandMark: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
  },
})
