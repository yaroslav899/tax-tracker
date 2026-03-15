import { type SidebarItemProps } from './types'

export const SidebarItem = ({ label, isActive, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
        isActive
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}