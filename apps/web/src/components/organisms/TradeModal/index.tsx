import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../atoms/Button'
import { Input } from '../../atoms/Input'
import { Select } from '../../atoms/Select'
import { type TradeModalProps } from './types'
import { type TradePayload } from '../../../api/trades'

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

const emptyForm = (type: 'BUY' | 'SELL'): TradePayload => ({
  ticker: '',
  type,
  quantity: 0,
  price: 0,
  currency: 'USD',
  date: '',
})

const getInitialForm = (
  type: 'BUY' | 'SELL',
  initial?: TradeModalProps['initial']
): TradePayload => {
  if (!initial) return emptyForm(type)
  const [month, day, year] = initial.date.split('/')
  return {
    ticker: initial.ticker,
    type,
    quantity: initial.qty,
    price: initial.price,
    currency: initial.currency,
    date: `${year}-${month}-${day}`,
  }
}

export const TradeModal = ({ isOpen, type, onClose, onSubmit, initial }: TradeModalProps) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<TradePayload>(() => getInitialForm(type, initial ?? undefined))
  const [loading, setLoading] = useState(false)

  // Reset form when modal opens
  if (!isOpen) return null

  const handleSubmit = async () => {
    setLoading(true)
    await onSubmit({ ...form, quantity: Number(form.quantity), price: Number(form.price) })
    setLoading(false)
    onClose()
  }

  const setField = (field: keyof TradePayload) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const title = type === 'BUY' ? t('tradeModal.addBuy') : t('tradeModal.addSell')

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-white">
          {initial ? t('tradeModal.edit') : title}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400">{t('table.ticker')}</label>
            <Input value={form.ticker} onChange={setField('ticker')} placeholder="AAPL" />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.date')}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setField('date')(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.currency')}</label>
              <Select
                value={form.currency}
                onChange={setField('currency')}
                options={CURRENCY_OPTIONS}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.qty')}</label>
              <Input
                value={String(form.quantity)}
                onChange={setField('quantity')}
                placeholder="10"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.price')}</label>
              <Input value={String(form.price)} onChange={setField('price')} placeholder="150.00" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            {t('dividendModal.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('auth.loading') : t('dividendModal.save')}
          </Button>
        </div>
      </div>
    </div>
  )
}
