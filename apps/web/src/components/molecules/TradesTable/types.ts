export interface Trade {
  id: string
  ticker: string
  date: string
  qty: number
  price: number
  currency: string
}

export interface TradesTableProps {
  title: string
  data: Trade[]
  accentColor?: 'green' | 'red'
  onEdit?: (row: Trade) => void
  onDelete?: (id: string) => void
  headerAction?: React.ReactNode
}