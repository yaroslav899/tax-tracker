import { type Dividend } from '../components/molecules/DividendTable/types'
import { type Trade } from '../components/molecules/TradesTable/types'

export const MOCK_BUYS: Trade[] = [
  { id: '1', ticker: 'AAPL', date: '03/01/2024', qty: 10, price: 1750.00, currency: 'USD' },
  { id: '2', ticker: 'MSFT', date: '03/05/2024', qty: 5, price: 1900.00, currency: 'USD' },
  { id: '3', ticker: 'NVDA', date: '02/14/2024', qty: 3, price: 1650.00, currency: 'USD' },
]

export const MOCK_SELLS: Trade[] = [
  { id: '4', ticker: 'AAPL', date: '06/15/2024', qty: 5, price: 925.00, currency: 'USD' },
  { id: '5', ticker: 'TSLA', date: '07/20/2024', qty: 8, price: 1440.00, currency: 'USD' },
]

export const MOCK_DIVIDENDS: Dividend[] = [
  { id: '6', ticker: 'AAPL', date: '02/15/2024', qty: 10, value: 9.60, currency: 'USD', withholding: 1.44 },
  { id: '7', ticker: 'MSFT', date: '03/14/2024', qty: 5, value: 15.00, currency: 'USD', withholding: 2.25 },
]