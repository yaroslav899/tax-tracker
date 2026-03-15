import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '../../atoms/Table'
import { Input } from '../../atoms/Input'
import { Select } from '../../atoms/Select'
import { type Trade, type TradesTableProps } from './types'

export const TradesTable = ({
  title, data, accentColor = 'green', onEdit, onDelete, headerAction,
}: TradesTableProps) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [selectedYear, setSelectedYear] = useState('all')
  const [sortKey, setSortKey] = useState<keyof Trade>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const COLUMNS = [
    { key: 'ticker' as keyof Trade, label: t('table.ticker'), sortable: true },
    { key: 'date' as keyof Trade, label: t('table.date'), sortable: true },
    { key: 'qty' as keyof Trade, label: t('table.qty'), sortable: true },
    { key: 'price' as keyof Trade, label: t('table.price'), sortable: true },
    { key: 'currency' as keyof Trade, label: t('table.currency'), sortable: false },
  ]

  const yearOptions = useMemo(() => {
    const unique = new Set(data.map((d) => d.date.split('/')[2]))
    return [
      { value: 'all', label: t('table.allYears') },
      ...Array.from(unique).sort((a, b) => Number(b) - Number(a)).map((y) => ({ value: y, label: y })),
    ]
  }, [data, t])

  const handleSort = (key: keyof Trade) => {
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
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
        return 0
      })
  }, [data, filter, selectedYear, sortKey, sortDir])

  const accent = accentColor === 'green' ? 'text-green-400' : 'text-red-400'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className={`text-base font-semibold ${accent}`}>{title}</h3>
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
          qty: String(d.qty),
          price: String(d.price),
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