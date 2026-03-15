import { useState, useEffect } from 'react'
import { dividendsApi, type DividendPayload } from '../api/dividends'
import { type Dividend } from '../components/molecules/DividendTable/types'

interface RawDividend {
  id: string
  ticker: string
  date: string
  value: number
  currency: string
  withholding: number
  valuePln?: number | null
  withholdingPln?: number | null
}

const toDividend = (d: RawDividend): Dividend => ({
  id: d.id ?? '',
  ticker: d.ticker ?? '',
  date: d.date
    ? new Date(d.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : '',
  value: d.value ?? 0,
  currency: d.currency ?? 'USD',
  withholding: d.withholding ?? 0,
  valuePln: d.valuePln ?? null,
  withholdingPln: d.withholdingPln ?? null,
})

export const useDividends = () => {
  const [dividends, setDividends] = useState<Dividend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDividends = async () => {
    try {
      setLoading(true)
      const data = await dividendsApi.getAll()
      if (Array.isArray(data)) setDividends(data.map(toDividend))
    } catch {
      setError('Failed to fetch dividends')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDividends()
  }, [])

  const create = async (payload: DividendPayload) => {
    const data = await dividendsApi.create(payload)
    if (data?.id) setDividends((prev) => [toDividend(data), ...prev])
  }

  const update = async (id: string, payload: DividendPayload) => {
    const data = await dividendsApi.update(id, payload)
    if (data?.id) setDividends((prev) => prev.map((d) => (d.id === id ? toDividend(data) : d)))
  }

  const remove = async (id: string) => {
    await dividendsApi.delete(id)
    setDividends((prev) => prev.filter((d) => d.id !== id))
  }

  return { dividends, loading, error, create, update, remove }
}
