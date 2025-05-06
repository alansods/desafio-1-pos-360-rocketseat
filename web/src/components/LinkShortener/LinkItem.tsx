import { IconButton } from '../ui/IconButton'
import { Copy, Trash } from 'phosphor-react'

type Props = {
  original: string
  short: string
  visits: number
  onCopy: (short: string) => void
  onDelete: (short: string) => void
}

export function LinkItem({ original, short, visits, onCopy, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0 w-full">
      <div>
        <a
          href={short}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 hover:underline text-base block"
        >
          {short}
        </a>
        <div className="text-xs text-gray-500 break-all mt-1">{original}</div>
      </div>
      <div className="flex items-center gap-2 min-w-[120px] justify-end">
        <span className="text-xs text-gray-400 mr-2">{visits} acessos</span>
        <IconButton icon={<Copy size={18} />} aria-label="Copiar link" title="Copiar link" onClick={() => onCopy(short)} />
        <IconButton icon={<Trash size={18} />} aria-label="Deletar link" title="Deletar link" onClick={() => onDelete(short)} />
      </div>
    </div>
  )
} 