import { InputHTMLAttributes, ReactNode } from 'react'

export type InputProps = {
  label?: string
  error?: string
  leftIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function Input({
  label,
  error,
  leftIcon,
  className = '',
  ...props
}: InputProps) {
  const base =
    'w-full px-4 py-3 rounded border text-gray-700 focus:outline-none transition-colors text-base';
  const state =
    error
      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
      : 'border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-100';
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className={`block text-xs font-semibold mb-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>{label}</label>
      )}
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-3 text-gray-400">{leftIcon}</span>}
        <input
          className={`${base} ${state} ${leftIcon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-600 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
} 