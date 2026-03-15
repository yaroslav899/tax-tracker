import { type TradePayload } from '../../../api/trades'
import { type Trade } from '../../molecules/TradesTable/types'

export interface TradeModalProps {
  isOpen: boolean
  type: 'BUY' | 'SELL'
  onClose: () => void
  onSubmit: (payload: TradePayload) => Promise<void>
  initial?: Trade | null
}
