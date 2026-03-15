import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type Trade } from '../TradesTable/types'

interface PortfolioWidgetProps {
  buys: Trade[]
  sells: Trade[]
}

export const PortfolioWidget = ({ buys, sells }: PortfolioWidgetProps) => {
  const { t } = useTranslation()

  const positions = useMemo(() => {
    const map: Record<string, number> = {}

    buys.forEach((t) => {
      map[t.ticker] = (map[t.ticker] ?? 0) + t.qty
    })
    sells.forEach((t) => {
      map[t.ticker] = (map[t.ticker] ?? 0) - t.qty
    })

    return Object.entries(map)
      .filter(([, qty]) => qty > 0)
      .sort(([a], [b]) => a.localeCompare(b))
  }, [buys, sells])

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white">{t('portfolio.title')}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{t('portfolio.subtitle')}</p>
      </div>

      <div className="px-5 py-3">
        {positions.length === 0 ? (
          <p className="text-gray-500 text-xs py-4 text-center">{t('portfolio.empty')}</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            <div className="flex justify-between pb-2">
              <span className="text-xs font-medium text-gray-400">{t('table.ticker')}</span>
              <span className="text-xs font-medium text-gray-400">{t('table.qty')}</span>
            </div>
            {positions.map(([ticker, qty]) => (
              <div key={ticker} className="flex justify-between py-2">
                <span className="text-sm font-semibold text-white">{ticker}</span>
                <span className="text-sm text-gray-300">{qty}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-1 border-t border-white/5">
        <p className="text-xs text-gray-500">
          {positions.length} {t('portfolio.positions')}
        </p>
      </div>
    </div>
  )
}
