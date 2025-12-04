import { Button } from '../../ui/Button'
import { Modal } from '../../ui/Modal'

interface DeleteLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteLinkModal({ isOpen, onClose, onConfirm, isDeleting = false }: DeleteLinkModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tem certeza?"
      description="Esta ação não pode ser desfeita. Isso excluirá permanentemente o link."
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </>
      }
    />
  )
}
