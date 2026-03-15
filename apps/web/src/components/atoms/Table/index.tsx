import { type TableProps } from './types'

export const Table = <T extends Record<string, string>>({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  onEdit,
  onDelete,
}: TableProps<T>) => {
  const hasActions = onEdit || onDelete

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => col.sortable && onSort(col.key)}
                className={`px-4 py-3 text-left text-gray-400 font-medium ${
                  col.sortable ? 'cursor-pointer hover:text-white' : ''
                }`}
              >
                {col.label}
                {sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
            {hasActions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-gray-200">
                    {row[col.key]}
                  </td>
                ))}
                {hasActions && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          ✏️
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}