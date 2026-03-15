import { type DividendPayload } from '../../../api/dividends'

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

export const EMPTY_FORM: DividendPayload = {
  ticker: '',
  date: '',
  value: 0,
  currency: 'USD',
  withholding: 0,
}