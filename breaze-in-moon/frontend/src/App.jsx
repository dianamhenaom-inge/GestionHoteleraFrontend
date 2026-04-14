import { useState } from 'react'
import AuthPage from './pages/AuthPage'
import ClientDashboard from './pages/ClientDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  function handleLogin(userData) {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (!user) return <AuthPage onLogin={handleLogin} />

  const isAdmin = user.roles?.includes('ROLE_ADMIN')

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      {isAdmin
        ? <AdminDashboard />
        : <ClientDashboard userId={user.email} />
      }
    </>
  )
}
