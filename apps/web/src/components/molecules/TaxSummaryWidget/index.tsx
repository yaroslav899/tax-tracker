import { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '../../atoms/Select'
import { Button } from '../../atoms/Button'
import { type Dividend } from '../DividendTable/types'

interface TaxSummaryWidgetProps {
  dividends: Dividend[]
}

const fmt2 = (n: number) => Math.round(n * 100) / 100

interface StatRowProps {
  label: string
  sublabel?: string
  usd: number
  pln?: number | null
  negative?: boolean
  highlight?: boolean
}

const StatRow = ({ label, sublabel, usd, pln, negative = false, highlight = false }: StatRowProps) => (
  <div className="flex flex-col gap-1.5 py-3 border-b border-white/5 last:border-0">
    <div className="flex flex-col gap-0.5">
      <span className={`text-xs font-medium ${highlight ? 'text-yellow-400' : 'text-gray-300'}`}>
        {label}
      </span>
      {sublabel && (
        <span className="text-xs text-gray-500 leading-tight">{sublabel}</span>
      )}
    </div>
    <div className="flex items-baseline gap-3">
      <span className={`text-sm font-semibold ${highlight ? 'text-yellow-400' : negative ? 'text-red-400' : 'text-white'}`}>
        {negative ? '−' : ''}{Number(usd).toFixed(2)}
        <span className="text-xs font-normal ml-1 text-gray-500">USD</span>
      </span>
      <span className={`text-sm font-medium ${
        pln != null
          ? highlight ? 'text-yellow-300' : negative ? 'text-red-300' : 'text-gray-300'
          : 'text-gray-600'
      }`}>
        {pln != null ? `${negative ? '−' : ''}${Number(pln).toFixed(2)}` : '—'}
        <span className="text-xs font-normal ml-1 text-gray-500">PLN</span>
      </span>
    </div>
  </div>
)

export const TaxSummaryWidget = ({ dividends }: TaxSummaryWidgetProps) => {
  const { t } = useTranslation()

  const years = useMemo(() => {
    const unique = new Set(dividends.map((d) => d.date.split('/')[2]).filter(Boolean))
    return Array.from(unique).sort((a, b) => Number(b) - Number(a))
  }, [dividends])

  const [selectedYear, setSelectedYear] = useState<string>('')
  const [calculated, setCalculated] = useState(false)

  useEffect(() => {
    if (years.length > 0 && !selectedYear) setSelectedYear(years[0])
  }, [years])

  const result = useMemo(() => {
    if (!calculated || !selectedYear) return null
    const filtered = dividends.filter((d) => d.date.split('/')[2] === selectedYear)
    if (filtered.length === 0) return null

    const grossUsd = fmt2(filtered.reduce((sum, d) => sum + d.value, 0))
    const grossPln = filtered.some((d) => d.valuePln != null)
      ? fmt2(filtered.reduce((sum, d) => sum + (d.valuePln ?? 0), 0))
      : null

    const withholdingUsd = fmt2(filtered.reduce((sum, d) => sum + d.withholding, 0))
    const withholdingPln = filtered.some((d) => d.withholdingPln != null)
      ? fmt2(filtered.reduce((sum, d) => sum + (d.withholdingPln ?? 0), 0))
      : null

    const taxBaseUsd = fmt2(grossUsd * 0.19)
    const taxBasePln = filtered.some((d) => d.valuePln != null)
      ? fmt2(filtered.reduce((sum, d) => sum + (d.valuePln != null ? d.valuePln * 0.19 : 0), 0))
      : null

    const taxDueUsd = fmt2(Math.max(0, taxBaseUsd - withholdingUsd))
    const taxDuePln = taxBasePln != null && withholdingPln != null
      ? fmt2(Math.max(0, taxBasePln - withholdingPln))
      : null

    return { grossUsd, grossPln, withholdingUsd, withholdingPln, taxBaseUsd, taxBasePln, taxDueUsd, taxDuePln }
  }, [calculated, selectedYear, dividends])

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setCalculated(false)
  }

  return (
    <div className="w-full xl:w-80 shrink-0">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">{t('taxWidget.title')}</h3>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              options={years.map((y) => ({ value: y, label: y }))}
              className="text-xs py-1 px-2 shrink-0"
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-2">
          {!calculated && (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500 text-xs text-center">{t('taxWidget.hint')}</span>
            </div>
          )}

          {calculated && !result && (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500 text-xs text-center">No data for {selectedYear}</span>
            </div>
          )}

          {result && (
            <div>
              <StatRow
                label={t('taxWidget.grossDividends')}
                usd={result.grossUsd}
                pln={result.grossPln}
              />
              <StatRow
                label="Tax base (19%)"
                sublabel="podatek obliczony od przychodów, o którym mowa w art. 30a ust. 1 pkt 1-5 ustawy"
                usd={result.taxBaseUsd}
                pln={result.taxBasePln}
              />
              <StatRow
                label="Withholding paid"
                sublabel="podatek zapłacony za granicą, o którym mowa w art. 30a ust. 9"
                usd={result.withholdingUsd}
                pln={result.withholdingPln}
                negative
              />
              <StatRow
                label={t('taxWidget.taxDue')}
                usd={result.taxDueUsd}
                pln={result.taxDuePln}
                highlight
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3">
          <Button onClick={() => setCalculated(true)} className="w-full justify-center">
            {t('taxWidget.calculate')} {selectedYear}
          </Button>
        </div>

      </div>
    </div>
  )
}