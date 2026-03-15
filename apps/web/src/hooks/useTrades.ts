import { useState, useEffect } from 'react'
import { tradesApi, type TradePayload } from '../api/trades'
import { type Trade } from '../components/molecules/TradesTable/types'

interface RawTrade {
  id: string
  ticker: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  currency: string
  date: string
}

const toTrade = (d: RawTrade): Trade => ({
  id: d.id ?? '',
  ticker: d.ticker ?? '',
  date: d.date
    ? new Date(d.date).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })
    : '',
  qty: d.quantity ?? 0,
  price: d.price ?? 0,
  currency: d.currency ?? 'USD',
})

export const useTrades = () => {
  const [buys, setBuys] = useState<Trade[]>([])
  const [sells, setSells] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTrades = async () => {
    try {
      setLoading(true)
      const data = await tradesApi.getAll()
      if (Array.isArray(data)) {
        setBuys(data.filter((t: RawTrade) => t.type === 'BUY').map(toTrade))
        setSells(data.filter((t: RawTrade) => t.type === 'SELL').map(toTrade))
      }
    } catch {
      console.error('Failed to fetch trades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrades()
  }, [])

  const create = async (payload: TradePayload) => {
    const data = await tradesApi.create(payload)
    if (data?.id) {
      const trade = toTrade(data)
      if (payload.type === 'BUY') setBuys((prev) => [trade, ...prev])
      else setSells((prev) => [trade, ...prev])
    }
  }

  const update = async (id: string, payload: TradePayload) => {
    const data = await tradesApi.update(id, payload)
    if (data?.id) {
      const trade = toTrade(data)
      if (payload.type === 'BUY') setBuys((prev) => prev.map((t) => (t.id === id ? trade : t)))
      else setSells((prev) => prev.map((t) => (t.id === id ? trade : t)))
    }
  }

  const remove = async (id: string, type: 'BUY' | 'SELL') => {
    await tradesApi.delete(id)
    if (type === 'BUY') setBuys((prev) => prev.filter((t) => t.id !== id))
    else setSells((prev) => prev.filter((t) => t.id !== id))
  }

  return { buys, sells, loading, create, update, remove }
}
