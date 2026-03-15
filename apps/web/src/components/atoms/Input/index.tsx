import { type InputProps } from './types'

export const Input = ({ value, onChange, placeholder, className = '' }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-gray-800 text-white px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 ${className}`}
    />
  )
}