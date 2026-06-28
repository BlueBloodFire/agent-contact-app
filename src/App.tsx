import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import { LoginScreen } from './screens/LoginScreen'
import { AppShell } from './components/AppShell'

export default function App() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  useEffect(() => {
    // prevent bounce scroll on iOS
    document.body.addEventListener('touchmove', (e) => {
      if ((e.target as HTMLElement).closest('.scroll-area') === null) {
        e.preventDefault()
      }
    }, { passive: false })
  }, [])

  if (!isLoggedIn) return <LoginScreen />
  return <AppShell />
}
