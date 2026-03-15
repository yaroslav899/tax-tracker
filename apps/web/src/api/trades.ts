import { supabase } from '../lib/supabase'

const API_URL = 'http://localhost:3000/api'

const getAuthHeaders = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  }
}

export interface TradePayload {
  ticker: string
  type: 'BUY' | 'SELL'
  quantity: number
  price: number
  currency: string
  date: string
}

export const tradesApi = {
  getAll: async () => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/trades`, { headers })
    return res.json()
  },
  create: async (data: TradePayload) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/trades`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: TradePayload) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/trades/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })
    return res.json()
  },
  delete: async (id: string) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/trades/${id}`, {
      method: 'DELETE',
      headers,
    })
    return res.json()
  },
}
