export interface UploadButtonProps {
  label: string
  accept?: string
  onFile: (file: File) => void
}
