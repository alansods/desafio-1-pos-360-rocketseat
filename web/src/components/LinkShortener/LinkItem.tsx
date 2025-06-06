import { IconButton } from '../ui/IconButton'
import { Copy, Trash } from 'phosphor-react'

type Props = {
  id: string
  url: string
  shortUrlFull: string
  createdAt: string
  accessCount: number
  onCopy: (shortUrlFull: string) => void
  onDelete: (id: string) => void
  onVisit: () => void
}

export function LinkItem({ id, url, shortUrlFull, accessCount, onCopy, onDelete, onVisit }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 w-full">
      <div>
        <a
          href={shortUrlFull}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 hover:underline text-base block"
          onClick={onVisit}
        >
          {shortUrlFull}
        </a>
        <div className="text-xs text-gray-500 break-all mt-1">{url}</div>
      </div>
      <div className="flex items-center gap-2 min-w-[120px] justify-end">
        <span className="text-xs text-gray-400 mr-2">{accessCount} acessos</span>
        <IconButton icon={<Copy size={18} />} aria-label="Copiar link" title="Copiar link" onClick={() => onCopy(shortUrlFull)} />
        <IconButton icon={<Trash size={18} />} aria-label="Deletar link" title="Deletar link" onClick={() => onDelete(id)} />
      </div>
    </div>
  )
} 