export interface Column<T> {
  key: keyof T
  label: string
  sortable: boolean
}

export interface TableProps<T extends Record<string, string>> {
  columns: Column<T>[]
  data: T[]
  sortKey: keyof T
  sortDir: 'asc' | 'desc'
  onSort: (key: keyof T) => void
  onEdit?: (row: T) => void
  onDelete?: (id: string) => void
}