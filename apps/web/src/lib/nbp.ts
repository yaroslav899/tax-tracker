const NBP_API = 'https://api.nbp.pl/api'

// Returns the previous day in YYYY-MM-DD format
const getPreviousDay = (date: string): string => {
  const d = new Date(date)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// Try to get the rate if 404 - backtracks one day (weekends/holidays)
const fetchRate = async (currency: string, date: string, attempt = 0): Promise<number> => {
  if (attempt > 7) throw new Error('No rate found in last 7 days')

  const res = await fetch(
    `${NBP_API}/exchangerates/rates/a/${currency.toLowerCase()}/${date}/?format=json`
  )

  if (res.status === 404) {
    return fetchRate(currency, getPreviousDay(date), attempt + 1)
  }

  if (!res.ok) throw new Error(`NBP API error: ${res.status}`)

  const data = await res.json()
  return data.rates[0].mid
}

export const nbpApi = {
  // Get the exchange rate for the previous business day relative to the date
  getRateForDate: async (currency: string, date: string): Promise<number> => {
    const previousDay = getPreviousDay(date)
    return fetchRate(currency, previousDay)
  },
}