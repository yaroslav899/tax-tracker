import { NavUser } from '../../molecules/NavUser'
import { type HeaderProps } from './types'

export const Header = ({ email, onSignOut }: HeaderProps) => {
  return (
    <header className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">Tax Tracker</span>
        <span className="text-lg">🇵🇱</span>
      </div>
      <NavUser email={email} onSignOut={onSignOut} />
    </header>
  )
}