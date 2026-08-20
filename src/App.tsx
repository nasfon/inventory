import { useAuth } from './hooks/useAuth'
import LoginPage from './features/auth/LoginPage'
import DashboardLayout from './layouts/DashboardLayout'
import Loading from './components/feedback/Loading'

function App() {
  const { initializing, user } = useAuth()

  if (initializing) {
    return <Loading />
  }

  if (!user) {
    return <LoginPage />
  }

  return <DashboardLayout />
}

export default App