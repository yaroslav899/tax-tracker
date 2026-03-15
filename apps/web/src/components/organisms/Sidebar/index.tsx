import { SidebarItem } from '../../atoms/SidebarItem'
import { type SidebarProps } from './types'

export const Sidebar = ({ options, activeId, onChange }: SidebarProps) => (
  <aside className="w-56 shrink-0">
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 flex flex-col gap-1">
      {options.map((option) => (
        <SidebarItem
          key={option.id} label={option.label} isActive={activeId === option.id}
          onClick={() => onChange(option.id)}
        />
      ))}
    </div>
  </aside>
)