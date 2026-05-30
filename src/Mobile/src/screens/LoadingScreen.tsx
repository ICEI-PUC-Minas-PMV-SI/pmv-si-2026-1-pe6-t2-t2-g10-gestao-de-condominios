import { LoadingMessage, Screen } from '@/components/ui'

export function LoadingScreen() {
  return (
    <Screen>
      <LoadingMessage message="Restaurando sessão..." />
    </Screen>
  )
}
