import { useTranslation } from 'react-i18next'
import { Header } from '../../organisms/Header'
import { TabBar } from '../../molecules/TabBar'

interface DashboardTemplateProps {
  email: string
  onSignOut: () => void
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

export const DashboardTemplate = ({ email, onSignOut, activeTab, onTabChange, children }: DashboardTemplateProps) => {
  const { t } = useTranslation()
  const TABS = [
    { id: 'jdg', label: t('tabs.jdg') },
    { id: 'shares', label: t('tabs.shares') },
  ]
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header email={email} onSignOut={onSignOut} />
      <TabBar tabs={TABS} activeTab={activeTab} onChange={onTabChange} />
      <main className="px-6 py-6">{children}</main>
    </div>
  )
}