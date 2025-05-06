import { ButtonHTMLAttributes, ReactNode, useState } from 'react'

// Tooltip component
function Tooltip({ text, children }: { text: string, children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={-1}
    >
      {children}
      <span
        className={`absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap shadow-lg pointer-events-none transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden={!visible}
      >
        {text}
      </span>
    </span>
  )
}

export type IconButtonProps = {
  icon: ReactNode
  title?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({ icon, className = '', title, ...props }: IconButtonProps) {
  const button = (
    <button
      type="button"
      className={`flex items-center justify-center w-8 h-8 rounded bg-gray-200 text-gray-600 hover:border-blue-base border border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {icon && (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      )}
    </button>
  )
  return title ? <Tooltip text={title}>{button}</Tooltip> : button
} 