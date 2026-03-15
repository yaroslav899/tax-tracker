export interface DashboardTemplateProps {
  email: string
  onSignOut: () => void
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}