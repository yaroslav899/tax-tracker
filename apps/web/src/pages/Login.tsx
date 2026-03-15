import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { LanguageSwitcher } from '../components/atoms/LanguageSwitcher'

export const Login = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage(t('auth.checkEmail'))
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{t('app.name')} 🇵🇱</h1>
            <p className="text-gray-400">
              {isRegister ? t('auth.register') : t('auth.login')}
            </p>
          </div>
          <LanguageSwitcher />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-900/30 border border-green-500 text-green-400 p-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? t('auth.loading') : isRegister ? t('auth.registerBtn') : t('auth.loginBtn')}
          </button>
        </div>

        <p className="text-gray-400 text-center mt-4">
          {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 hover:underline"
          >
            {isRegister ? t('auth.loginBtn') : t('auth.registerBtn')}
          </button>
        </p>
      </div>
    </div>
  )
}