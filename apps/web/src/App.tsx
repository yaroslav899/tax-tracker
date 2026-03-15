import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { SharesPage } from './pages/SharesPage'
import { DashboardTemplate } from './components/templates/DashboardTemplate'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('jdg')

  return (
    <DashboardTemplate
      email={user?.email ?? ''}
      onSignOut={signOut}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'jdg' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">JDG</h2>
          <p className="text-gray-400">Jednoosobowa Działalność Gospodarcza</p>
        </div>
      )}
      {activeTab === 'shares' && <SharesPage />}
    </DashboardTemplate>
  )
}

const AppContent = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Завантаження...</div>
      </div>
    )
  }

  return user ? <Dashboard /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}