import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Select } from '../../atoms/Select'
import { type Dividend } from '../DividendTable/types'

interface DividendChartProps {
  dividends: Dividend[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

interface TooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-green-400 font-semibold">{payload[0].value.toFixed(2)} PLN</p>
    </div>
  )
}

export const DividendChart = ({ dividends }: DividendChartProps) => {
  const { t } = useTranslation()

  const years = useMemo(() => {
    const unique = new Set(dividends.map((d) => d.date.split('/')[2]).filter(Boolean))
    return Array.from(unique).sort((a, b) => Number(b) - Number(a))
  }, [dividends])

  const currentYear = new Date().getFullYear().toString()
  const defaultYear = years.includes(currentYear) ? currentYear : (years[0] ?? '')

  const [selectedYear, setSelectedYear] = useState(defaultYear)

  const { chartData, totalPln, totalUsd } = useMemo(() => {
    const filtered = dividends.filter((d) => d.date.split('/')[2] === selectedYear)

    const monthlyPln = Array(12).fill(0)
    filtered.forEach((d) => {
      const monthIndex = parseInt(d.date.split('/')[0]) - 1
      monthlyPln[monthIndex] += d.valuePln ?? 0
    })

    const data = MONTHS.map((month, i) => ({
      month,
      pln: Math.round((monthlyPln[i] as number) * 100) / 100,
    }))

    const pln = Math.round(filtered.reduce((sum, d) => sum + (d.valuePln ?? 0), 0) * 100) / 100
    const usd = Math.round(filtered.reduce((sum, d) => sum + d.value, 0) * 100) / 100

    return { chartData: data, totalPln: pln, totalUsd: usd }
  }, [dividends, selectedYear])

  if (years.length === 0) return null

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-white/5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{t('chart.title')}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{t('chart.subtitle')}</p>
        </div>
        <Select
          value={selectedYear}
          onChange={setSelectedYear}
          options={years.map((y) => ({ value: y, label: y }))}
          className="text-xs py-1 px-2 shrink-0"
        />
      </div>

      <div className="px-5 pt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-white">
          {totalPln.toFixed(2)}
          <span className="text-sm font-normal text-gray-400 ml-1">PLN</span>
        </span>
        <span className="text-sm text-gray-500">{totalUsd.toFixed(2)} USD</span>
      </div>

      <div className="px-2 pt-2 pb-4">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="pln" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
