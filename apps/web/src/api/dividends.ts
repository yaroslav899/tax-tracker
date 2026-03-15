import { supabase } from '../lib/supabase'

const API_URL = 'http://localhost:3000/api'

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token}`,
  }
}

export interface DividendPayload {
  ticker: string
  date: string
  value: number
  currency: string
  withholding: number
  valuePln?: number | null
  withholdingPln?: number | null
}

export const dividendsApi = {
  getAll: async () => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/dividends`, { headers })
    return res.json()
  },
  create: async (data: DividendPayload) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/dividends`, {
      method: 'POST', headers, body: JSON.stringify(data),
    })
    return res.json()
  },
  update: async (id: string, data: DividendPayload) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/dividends/${id}`, {
      method: 'PUT', headers, body: JSON.stringify(data),
    })
    return res.json()
  },
  delete: async (id: string) => {
    const headers = await getAuthHeaders()
    const res = await fetch(`${API_URL}/dividends/${id}`, {
      method: 'DELETE', headers,
    })
    return res.json()
  },
}