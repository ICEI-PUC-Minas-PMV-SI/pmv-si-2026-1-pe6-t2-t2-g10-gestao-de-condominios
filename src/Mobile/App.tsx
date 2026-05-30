import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

import { AuthProvider, useAuth } from './src/auth/AuthContext'
import { AppNavigator } from './src/navigation/AppNavigator'
import { AuthNavigator } from './src/navigation/AuthNavigator'
import { LoadingScreen } from './src/screens/LoadingScreen'
import { ThemeProvider, useTheme } from './src/theme/ThemeContext'

function Root() {
  const { isBootstrapping, isAuthenticated } = useAuth()
  const { theme } = useTheme()

  if (isBootstrapping) {
    return <LoadingScreen />
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          primary: theme.colors.brand,
          background: theme.colors.appBg,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: theme.colors.dangerText,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      <StatusBar style="auto" />
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ThemeProvider>
  )
}
