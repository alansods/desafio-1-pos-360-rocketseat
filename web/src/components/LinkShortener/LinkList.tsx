import { DownloadCsvButton } from './DownloadCsvButton'
import { EmptyState } from './EmptyState'
import { LinkItem } from './LinkItem'

export type Link = {
  original: string
  short: string
  visits: number
}

export function LinkList({ links, onCopy, onDelete }: { links: Link[], onCopy: (short: string) => void, onDelete: (short: string) => void }) {
  return (
    <div className="min-h-[234px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-600">Meus links</h2>
        <DownloadCsvButton disabled />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {links.length === 0 ? <EmptyState /> : (
          <div className="w-full">
            {links.map((link, idx) => (
              <LinkItem key={idx} {...link} onCopy={onCopy} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 