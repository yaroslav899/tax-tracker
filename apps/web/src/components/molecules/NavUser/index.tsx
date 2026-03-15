import { useTranslation } from 'react-i18next'
import { Button } from '../../atoms/Button'
import { LanguageSwitcher } from '../../atoms/LanguageSwitcher'
import { type NavUserProps } from './types'

export const NavUser = ({ email, onSignOut }: NavUserProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex items-center gap-4">
      <LanguageSwitcher />
      <span className="text-gray-400 text-sm">{email}</span>
      <Button variant="ghost" size="sm" onClick={onSignOut}>{t('nav.signOut')}</Button>
    </div>
  )
}