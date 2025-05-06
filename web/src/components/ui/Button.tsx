import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonProps = {
  variant?: 'primary' | 'secondary'
  leftIcon?: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  leftIcon,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 rounded py-2.5 px-4 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-base';
  const variants = {
    primary:
      'bg-blue-700 text-white hover:bg-blue-800 disabled:bg-blue-200 disabled:text-white',
    secondary:
      'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-blue-700 disabled:bg-gray-100 disabled:text-gray-300 disabled:border-gray-100',
  }
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
    </button>
  )
} 