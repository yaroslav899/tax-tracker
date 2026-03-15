export interface Dividend {
  id: string
  ticker: string
  date: string
  value: number
  currency: string
  valuePln?: number | null
  withholding: number
  withholdingPln?: number | null
}

export interface DividendTableProps {
  data: Dividend[]
  onEdit?: (row: Dividend) => void
  onDelete?: (id: string) => void
  headerAction?: React.ReactNode
}