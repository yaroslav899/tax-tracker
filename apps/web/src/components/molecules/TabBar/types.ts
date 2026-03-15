export interface Tab {
  id: string
  label: string
}

export interface TabBarProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}