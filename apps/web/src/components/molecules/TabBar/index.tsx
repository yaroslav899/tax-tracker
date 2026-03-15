import { TabItem } from '../../atoms/TabItem'
import { type TabBarProps } from './types'

export const TabBar = ({ tabs, activeTab, onChange }: TabBarProps) => (
  <div className="border-b border-gray-800 px-6">
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <TabItem key={tab.id} label={tab.label} isActive={activeTab === tab.id} onClick={() => onChange(tab.id)} />
      ))}
    </div>
  </div>
)