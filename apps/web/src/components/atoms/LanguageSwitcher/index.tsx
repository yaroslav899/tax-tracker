import { useTranslation } from 'react-i18next'
import { LANGUAGES } from './constants'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  return (
    <div className="flex gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
            i18n.language === lang.code
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}