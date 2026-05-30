import type { LucideIcon } from 'lucide-react-native'
import type { PropsWithChildren } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

import { useTheme } from '@/theme/ThemeContext'

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: LucideIcon
}

interface FieldProps {
  label: string
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad'
  multiline?: boolean
}

interface OptionCardProps {
  title: string
  description: string
  eyebrow?: string
  icon: LucideIcon
  onPress: () => void
  disabled?: boolean
}

interface CardProps extends PropsWithChildren {
  variant?: 'default' | 'highlight'
}

interface HighlightBadgeProps {
  label?: string
  icon?: LucideIcon
}

export function Screen({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <View style={[styles.screen, { backgroundColor: theme.colors.appBg }]}>{children}</View>
}

export function Card({ children, variant = 'default' }: CardProps) {
  const { theme } = useTheme()
  const isHighlight = variant === 'highlight'
  return (
    <View style={[
      styles.card,
      theme.shadow,
      {
        backgroundColor: isHighlight ? theme.colors.brandSoft : theme.colors.surface,
        borderColor: isHighlight ? theme.colors.brand : theme.colors.border,
        borderWidth: isHighlight ? 2 : 1,
      },
    ]}>
      {isHighlight ? <View style={[styles.highlightStripe, { backgroundColor: theme.colors.brand }]} /> : null}
      {children}
    </View>
  )
}

export function Title({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <Text style={[styles.title, { color: theme.colors.text }]}>{children}</Text>
}

export function Subtitle({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <Text style={[styles.subtitle, { color: theme.colors.text }]}>{children}</Text>
}

export function Kicker({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <Text style={[styles.kicker, { color: theme.colors.textMuted }]}>{children}</Text>
}

export function Body({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{children}</Text>
}

export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'brand' | 'success' | 'danger' }>) {
  const { theme } = useTheme()
  const palette = {
    neutral: { bg: theme.colors.surfaceSoft, fg: theme.colors.textSecondary, border: theme.colors.border },
    brand: { bg: theme.colors.brandSoft, fg: theme.colors.brandStrong, border: theme.colors.border },
    success: { bg: theme.colors.successBg, fg: theme.colors.successText, border: theme.colors.successText },
    danger: { bg: theme.colors.dangerBg, fg: theme.colors.dangerText, border: theme.colors.dangerText },
  }[tone]

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg, borderColor: palette.border }]}>
      <Text style={[styles.badgeText, { color: palette.fg }]}>{children}</Text>
    </View>
  )
}

export function HighlightBadge({ label = 'Destaque', icon: Icon }: HighlightBadgeProps) {
  const { theme } = useTheme()

  return (
    <View
      style={[
        styles.highlightBadge,
        {
          backgroundColor: theme.colors.primaryButtonBg,
          borderColor: theme.colors.brand,
        },
      ]}
    >
      {Icon ? <Icon size={14} color={theme.colors.primaryButtonText} /> : null}
      <Text style={[styles.highlightBadgeText, { color: theme.colors.primaryButtonText }]}>{label}</Text>
    </View>
  )
}

export function HighlightTitle({ children }: PropsWithChildren) {
  const { theme } = useTheme()
  return <Text style={[styles.highlightTitle, { color: theme.colors.brandStrong }]}>{children}</Text>
}

export function ErrorMessage({ message }: { message?: string | null }) {
  const { theme } = useTheme()

  if (!message) {
    return null
  }

  return <Text style={[styles.banner, { backgroundColor: theme.colors.dangerBg, color: theme.colors.dangerText }]}>{message}</Text>
}

export function SuccessMessage({ message }: { message?: string | null }) {
  const { theme } = useTheme()

  if (!message) {
    return null
  }

  return <Text style={[styles.banner, { backgroundColor: theme.colors.successBg, color: theme.colors.successText }]}>{message}</Text>
}

export function LoadingMessage({ message = 'Carregando...' }: { message?: string }) {
  const { theme } = useTheme()
  return (
    <View style={[styles.loading, { backgroundColor: theme.colors.appBg }]}>
      <ActivityIndicator color={theme.colors.brand} />
      <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>{message}</Text>
    </View>
  )
}

export function AppButton({ title, onPress, disabled = false, variant = 'primary', icon: Icon }: ButtonProps) {
  const { theme } = useTheme()
  const variantStyle = {
    primary: { backgroundColor: theme.colors.primaryButtonBg, borderColor: theme.colors.primaryButtonBg },
    secondary: { backgroundColor: theme.colors.surfaceStrong, borderColor: theme.colors.borderStrong },
    danger: { backgroundColor: theme.colors.dangerText, borderColor: theme.colors.dangerText },
  }[variant]
  const textColor = variant === 'secondary' ? theme.colors.text : theme.colors.primaryButtonText

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        disabled ? styles.disabledButton : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      {Icon ? <Icon size={17} color={textColor} /> : null}
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </Pressable>
  )
}

export function TextField(props: FieldProps) {
  const { theme } = useTheme()

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={theme.colors.textMuted}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        multiline={props.multiline}
        autoCapitalize={props.keyboardType === 'email-address' ? 'none' : 'sentences'}
        style={[
          styles.input,
          {
            borderColor: theme.colors.borderStrong,
            backgroundColor: theme.colors.surfaceStrong,
            color: theme.colors.text,
          },
          props.multiline ? styles.textArea : null,
        ]}
      />
    </View>
  )
}

export function FilterBar<T extends string | number | boolean | undefined>({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: T }>
  value: T
  onChange: (value: T) => void
}) {
  const { theme } = useTheme()

  return (
    <View style={[styles.filterBar, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceSoft }]}>
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <Pressable
            key={String(option.label)}
            onPress={() => onChange(option.value)}
            style={[styles.filterOption, isActive ? { backgroundColor: theme.colors.surfaceStrong } : null]}
          >
            <Text style={[styles.filterText, { color: isActive ? theme.colors.text : theme.colors.textSecondary }]}>
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export function OptionCard({ title, description, eyebrow, icon: Icon, onPress, disabled = false }: OptionCardProps) {
  const { theme } = useTheme()

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.optionCard,
        theme.shadow,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabledButton : null,
      ]}
    >
      <View style={[styles.optionIcon, { backgroundColor: theme.colors.brandSoft }]}>
        <Icon size={22} color={theme.colors.brandStrong} />
      </View>
      <View style={styles.optionText}>
        {eyebrow ? <Kicker>{eyebrow}</Kicker> : null}
        <Text style={[styles.optionTitle, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>{description}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  highlightStripe: {
    height: 5,
    marginTop: -16,
    marginHorizontal: -16,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  highlightBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  highlightBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  highlightTitle: {
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0,
  },
  banner: {
    overflow: 'hidden',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  button: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
  },
  disabledButton: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 46,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  filterBar: {
    flexDirection: 'row',
    gap: 4,
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
  },
  filterOption: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '800',
  },
  optionCard: {
    minHeight: 118,
    flexDirection: 'row',
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  optionIcon: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  optionText: {
    flex: 1,
    gap: 6,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
})
