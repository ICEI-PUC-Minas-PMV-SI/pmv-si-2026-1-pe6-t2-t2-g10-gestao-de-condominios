import { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@/auth/AuthContext'
import { AppButton, Body, Card, ErrorMessage, Kicker, TextField, Title } from '@/components/ui'
import { getErrorMessage } from '@/services/http/errors'
import { BrandMark, ThemeToggle, useTheme } from '@/theme/ThemeContext'
import { validateLoginFields } from '@/utils/validation'

export function LoginScreen() {
  const { signIn } = useAuth()
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    const validationMessage = validateLoginFields(email, senha)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await signIn({ email: email.trim(), senha })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={[styles.container, { backgroundColor: theme.colors.appBg }]}
    >
      <View style={styles.content}>
        <Card>
          <BrandMark />
          <Kicker>SmartSíndico Mobile</Kicker>
          <Title>Portal do condomínio</Title>
          <Body>Acesse sua conta para gerenciar usuários e acompanhar o mural do condomínio.</Body>
          <ThemeToggle />
        </Card>
        <Card>
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />
          <TextField
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            secureTextEntry
          />
          <ErrorMessage message={error} />
          <AppButton title={isSubmitting ? 'Entrando...' : 'Entrar'} onPress={handleSubmit} disabled={isSubmitting} />
        </Card>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    gap: 16,
  },
})
