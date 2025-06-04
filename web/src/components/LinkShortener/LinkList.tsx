import { DownloadCsvButton } from './DownloadCsvButton'
import { EmptyState } from './EmptyState'
import { LinkItem } from './LinkItem'

export type Link = {
  id: string
  url: string
  shortUrl: string
  shortUrlFull: string
  createdAt: string
  accessCount: number
}

export function LinkList({ links, onCopy, onDelete }: { links: Link[], onCopy: (shortUrlFull: string) => void, onDelete: (id: string) => void }) {
  return (
    <div className="min-h-[234px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-600">Meus links</h2>
        <DownloadCsvButton />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {links.length === 0 ? <EmptyState /> : (
          <div className="w-full">
            {links.map((link, idx) => (
              <LinkItem key={link.id} {...link} onCopy={() => onCopy(link.shortUrlFull)} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 