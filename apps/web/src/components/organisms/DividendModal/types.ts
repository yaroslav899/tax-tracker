import { type Dividend } from '../../molecules/DividendTable/types'
import { type DividendPayload } from '../../../api/dividends'

export interface DividendModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: DividendPayload) => Promise<void>
  initial?: Dividend | null
}