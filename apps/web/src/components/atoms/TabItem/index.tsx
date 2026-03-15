import { type TabItemProps } from './types'

export const TabItem = ({ label, isActive, onClick }: TabItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
        isActive
          ? 'border-blue-500 text-white'
          : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  )
}