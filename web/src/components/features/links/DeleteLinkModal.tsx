import { CircleNotch } from "phosphor-react";
import { Button } from "../../ui/Button";
import { Modal } from "../../ui/Modal";

interface DeleteLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteLinkModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteLinkModalProps) {
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
            className="rounded-lg bg-white hover:bg-gray-100 hover:text-gray-600"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center justify-center gap-2">
                <CircleNotch size={20} className="animate-spin" />
                Excluindo...
              </span>
            ) : (
              "Excluir"
            )}
          </Button>
        </>
      }
    />
  );
}
