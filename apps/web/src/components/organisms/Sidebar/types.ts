export interface SidebarOption {
  id: string
  label: string
}

export interface SidebarProps {
  options: SidebarOption[]
  activeId: string
  onChange: (id: string) => void
}