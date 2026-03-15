import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../../atoms/Table'
import { Input } from '../../atoms/Input'
import { Select } from '../../atoms/Select'
import { type Dividend } from './types'

interface DividendTableProps {
  data: Dividend[]
  onEdit?: (row: Dividend) => void
  onDelete?: (id: string) => void
  headerAction?: React.ReactNode
}

const fmt2 = (n: number) => n.toFixed(2)
const calcTax19 = (valuePln: number | null | undefined): string => {
  if (valuePln == null) return '—'
  return fmt2(valuePln * 0.19)
}

export const DividendTable = ({ data, onEdit, onDelete, headerAction }: DividendTableProps) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [sortKey, setSortKey] = useState<keyof Dividend>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const COLUMNS = [
    { key: 'ticker' as keyof Dividend, label: t('table.ticker'), sortable: true },
    { key: 'date' as keyof Dividend, label: t('table.date'), sortable: true },
    { key: 'value' as keyof Dividend, label: t('table.amount'), sortable: true },
    { key: 'currency' as keyof Dividend, label: t('table.currency'), sortable: false },
    { key: 'valuePln' as keyof Dividend, label: t('table.valuePln'), sortable: true },
    { key: 'tax19' as keyof Dividend, label: t('table.tax19'), sortable: false },
    { key: 'withholding' as keyof Dividend, label: t('table.withholding'), sortable: true },
    { key: 'withholdingPln' as keyof Dividend, label: t('table.withholdingPln'), sortable: true },
  ]

  const yearOptions = useMemo(() => {
    const unique = new Set(data.map((d) => d.date.split('/')[2]))
    return [
      { value: 'all', label: t('table.allYears') },
      ...Array.from(unique).sort((a, b) => Number(b) - Number(a)).map((y) => ({ value: y, label: y })),
    ]
  }, [data, t])

  const handleSort = (key: keyof Dividend) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    return data
      .filter((row) => {
        const matchesTicker = row.ticker.toLowerCase().includes(filter.toLowerCase())
        const matchesYear = selectedYear === 'all' || row.date.split('/')[2] === selectedYear
        return matchesTicker && matchesYear
      })
      .sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
  }, [data, filter, selectedYear, sortKey, sortDir])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-green-400">{t('table.dividends')}</h3>
        <div className="flex items-center gap-6">
          {headerAction && <div>{headerAction}</div>}
          <div className="flex gap-2">
            <Select value={selectedYear} onChange={setSelectedYear} options={yearOptions} />
            <Input value={filter} onChange={setFilter} placeholder={t('table.filterByTicker')} className="w-48" />
          </div>
        </div>
      </div>
      <Table
        columns={COLUMNS}
        data={filtered.map((d) => ({
          ...d,
          value: fmt2(d.value),
          withholding: fmt2(d.withholding),
          valuePln: d.valuePln != null ? fmt2(d.valuePln) : '—',
          tax19: calcTax19(d.valuePln),
          withholdingPln: d.withholdingPln != null ? fmt2(d.withholdingPln) : '—',
        }))}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onEdit={onEdit ? (row) => onEdit(filtered.find((d) => d.id === row.id)!) : undefined}
        onDelete={onDelete}
      />
    </div>
  )
}