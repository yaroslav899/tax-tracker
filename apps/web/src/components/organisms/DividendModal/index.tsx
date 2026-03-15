import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../atoms/Button'
import { Input } from '../../atoms/Input'
import { Select } from '../../atoms/Select'
import { type DividendModalProps } from './types'
import { type DividendPayload } from '../../../api/dividends'
import { nbpApi } from '../../../lib/nbp'

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

const EMPTY_FORM: DividendPayload = {
  ticker: '', date: '', value: 0, currency: 'USD',
  withholding: 0, valuePln: null, withholdingPln: null,
}

const round2 = (n: number) => Math.round(n * 100) / 100
const fmt2 = (n: number | null | undefined) => n != null ? n.toFixed(2) : '—'

export const DividendModal = ({ isOpen, onClose, onSubmit, initial }: DividendModalProps) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<DividendPayload>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertError, setConvertError] = useState<string | null>(null)
  const [rate, setRate] = useState<number | null>(null)

  const canConvert = !!form.date && Number(form.value) > 0
  const canSave = rate !== null && form.valuePln != null

  useEffect(() => {
    if (initial) {
      const [month, day, year] = initial.date.split('/')
      const newForm = {
        ticker: initial.ticker,
        date: `${year}-${month}-${day}`,
        value: initial.value,
        currency: initial.currency,
        withholding: initial.withholding ?? 0,
        valuePln: initial.valuePln ?? null,
        withholdingPln: initial.withholdingPln ?? null,
      }
      setForm(newForm)
      if (initial.valuePln != null) setRate(-1)
      else setRate(null)
    } else {
      setForm(EMPTY_FORM)
      setRate(null)
    }
    setConvertError(null)
  }, [initial, isOpen])

  if (!isOpen) return null

  const handleConvert = async () => {
    setConverting(true)
    setConvertError(null)
    try {
      const fetchedRate = await nbpApi.getRateForDate(form.currency, form.date)
      const valuePln = round2(Number(form.value) * fetchedRate)
      const withholdingPln = round2(Number(form.withholding) * fetchedRate)
      setRate(fetchedRate)
      setForm((prev) => ({ ...prev, valuePln, withholdingPln }))
    } catch (e) {
      setConvertError(t('dividendModal.convertError'))
    } finally {
      setConverting(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    const payload: DividendPayload = {
      ...form,
      value: Number(form.value),
      withholding: Number(form.withholding),
      valuePln: form.valuePln != null ? Number(form.valuePln) : null,
      withholdingPln: form.withholdingPln != null ? Number(form.withholdingPln) : null,
    }
    await onSubmit(payload)
    setLoading(false)
    onClose()
  }

  const setField = (field: keyof DividendPayload) => (value: string) => {
    if (['date', 'value', 'withholding', 'currency'].includes(field)) {
      setRate(null)
      setForm((prev) => ({ ...prev, [field]: value, valuePln: null, withholdingPln: null }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const rateLabel = rate && rate > 0
    ? `(${t('dividendModal.rateApplied')}: ${rate.toFixed(4)} PLN)`
    : rate === -1 ? `(${t('dividendModal.rateApplied')})` : ''

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md flex flex-col gap-4">

        <h2 className="text-lg font-semibold text-white">
          {initial ? t('dividendModal.edit') : t('dividendModal.add')}
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
              <Select value={form.currency} onChange={setField('currency')} options={CURRENCY_OPTIONS} />
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg p-3 flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.value')}</label>
              <Input value={String(form.value)} onChange={setField('value')} placeholder="9.60" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs text-gray-400">{t('table.withholding')}</label>
              <Input value={String(form.withholding)} onChange={setField('withholding')} placeholder="1.44" />
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={!canConvert || converting}
            className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
              canConvert && !converting
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {converting ? `⏳ ${t('dividendModal.converting')}` : `🔄 ${t('dividendModal.convertBtn')}`}
          </button>

          {convertError && <p className="text-xs text-red-400">{convertError}</p>}

          <div className={`border rounded-lg p-3 flex flex-col gap-3 transition-colors ${
            rate ? 'border-green-800 bg-green-900/10' : 'border-gray-800 opacity-50'
          }`}>
            <span className="text-xs text-gray-500 font-medium">PLN {rateLabel}</span>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-gray-400">{t('table.valuePln')}</label>
                <input
                  readOnly
                  value={fmt2(form.valuePln)}
                  className="bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs text-gray-400">{t('table.withholdingPln')}</label>
                <input
                  readOnly
                  value={fmt2(form.withholdingPln)}
                  className="bg-gray-800/50 text-white px-3 py-2 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {!canSave && (
            <p className="text-xs text-gray-500">
              * {t('dividendModal.saveHint')}
            </p>
          )}

        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>{t('dividendModal.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={!canSave || loading}>
            {loading ? t('auth.loading') : t('dividendModal.save')}
          </Button>
        </div>

      </div>
    </div>
  )
}