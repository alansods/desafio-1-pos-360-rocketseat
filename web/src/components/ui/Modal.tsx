import { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed left-0 -top-6 right-0 z-50 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg space-y-4 animate-in fade-in zoom-in duration-200">
        <div className="space-y-2">
          <h3 className="text-lg font-bold">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        
        {children}

        <div className="flex justify-end gap-2">
          {footer ? footer : (
             <Button variant="ghost" onClick={onClose}>Close</Button>
          )}
        </div>
      </div>
    </div>
  )
}
