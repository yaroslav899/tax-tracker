import { type StatRowProps } from './types'

export const StatRow = ({ label, usd, pln, negative = false, highlight = false }: StatRowProps) => (
  <div className={`flex flex-col gap-1 ${highlight ? 'pt-3 border-t border-gray-700' : ''}`}>
    <span className="text-xs text-gray-400">{label}</span>
    <div className="flex items-baseline gap-3">
      <span className={`text-base font-semibold ${highlight ? 'text-yellow-400' : negative ? 'text-red-400' : 'text-white'}`}>
        {negative ? '−' : ''}{Number(usd).toFixed(2)}
        <span className="text-xs font-normal ml-1 text-gray-400">USD</span>
      </span>
      <span className={`text-sm font-medium ${pln != null ? (highlight ? 'text-yellow-300' : negative ? 'text-red-300' : 'text-gray-300') : 'text-gray-600'}`}>
        {pln != null ? `${negative ? '−' : ''}${Number(pln).toFixed(2)}` : '—'}
        <span className="text-xs font-normal ml-1 text-gray-500">PLN</span>
      </span>
    </div>
  </div>
)