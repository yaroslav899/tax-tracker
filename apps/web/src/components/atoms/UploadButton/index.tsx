import { useRef } from 'react'
import { type UploadButtonProps } from './types'

export const UploadButton = ({ label, accept = '.csv', onFile }: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFile(file)
      e.target.value = ''
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors border border-gray-700"
      >
        {label}
      </button>
    </>
  )
}
