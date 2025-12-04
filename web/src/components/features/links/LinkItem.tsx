import { useState } from 'react'
import { Copy, Trash2 } from 'lucide-react'
import { Link } from '../../../types/link'
import { Button } from '../../ui/Button'

interface LinkItemProps {
  link: Link
  onDelete: (id: string) => void
}

export function LinkItem({ link, onDelete }: LinkItemProps) {
  const [copying, setCopying] = useState(false)
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333'
  const shortUrl = `${backendUrl}/${link.shortUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  const handleLinkClick = () => {
    console.log('[FRONTEND] Link clicado:', link.shortUrl, 'AccessCount atual:', link.accessCount)

    // React Query vai fazer refetch automaticamente quando voltar pra aba
    // graças ao refetchOnWindowFocus: true e refetchInterval
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0">
      <div className="flex-1 min-w-0 space-y-1">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline truncate block"
          onClick={handleLinkClick}
        >
          brev.ly/{link.shortUrl}
        </a>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <p className="truncate max-w-[250px]" title={link.url}>
            {link.url}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex gap-2 items-center">
          <span className="whitespace-nowrap mr-2">{link.accessCount} acessos</span>

          <Button 
            variant="secondary"
            size="icon"
            onClick={handleCopy}
          >
            {copying ? <span className="text-xs font-bold text-green-600">✓</span> : <Copy className="w-4 h-4" />}
          </Button>
          
          <Button 
            variant="secondary"
            size="icon"
            onClick={() => onDelete(link.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
