import { useState } from 'react'
import { Download } from 'lucide-react'
import { useLinks } from '../../../hooks/useLinks'
import { Button } from '../../ui/Button'
import { LinkItem } from './LinkItem'
import { DeleteLinkModal } from './DeleteLinkModal'

export function LinkList() {
  const { links, isLoading, deleteLink, exportCsv, refetch } = useLinks()
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)

  const handleLinkClick = () => {
    console.log('[LINKLIST] handleLinkClick chamado, chamando refetch...')
    refetch()
  }

  const handleDelete = () => {
    if (deleteConfirmationId) {
      deleteLink.mutate(deleteConfirmationId)
      setDeleteConfirmationId(null)
    }
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-600">Meus links</h2>
        <Button 
          variant="secondary"
          onClick={exportCsv} 
          disabled={!links || links.length === 0}
          className="h-9 px-3 gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Carregando...</div>
      ) : (
        <div>
          {links?.map((link) => (
            <LinkItem
              key={link.id}
              link={link}
              onDelete={setDeleteConfirmationId}
              onLinkClick={handleLinkClick}
            />
          ))}
          {links?.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              Nenhum link criado ainda.
            </div>
          )}
        </div>
      )}

      <DeleteLinkModal 
        isOpen={!!deleteConfirmationId}
        onClose={() => setDeleteConfirmationId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
