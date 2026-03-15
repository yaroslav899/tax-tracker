export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}