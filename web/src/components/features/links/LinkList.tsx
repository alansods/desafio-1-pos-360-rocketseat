import { useState } from "react";
import { DownloadSimple, CircleNotch, Link as LinkIcon } from "phosphor-react";
import { useLinks } from "../../../hooks/useLinks";
import { Button } from "../../ui/Button";
import { LinkItem } from "./LinkItem";
import { DeleteLinkModal } from "./DeleteLinkModal";
import { Pagination } from "../../ui/Pagination";

export function LinkList() {
  const { 
    links, 
    isLoading, 
    isFetching,
    deleteLink, 
    exportCsv, 
    isExporting,
    pagination,
    currentPage,
    pageSize,
    goToPage,
    changePageSize
  } = useLinks();
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);

  const handleDelete = () => {
    if (deleteConfirmationId) {
      deleteLink.mutate(deleteConfirmationId, {
        onSettled: () => {
          setDeleteConfirmationId(null);
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 space-y-5">
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <h2 className="text-lg font-bold text-gray-600">Meus links</h2>
        <Button
          variant="secondary"
          size="sm"
          onClick={exportCsv}
          disabled={pagination.total === 0 || isExporting}
        >
          {isExporting ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <DownloadSimple size={16} />
          )}
          {isExporting ? "Exportando..." : "Baixar CSV"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-400">Carregando...</div>
      ) : (
        <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
          {links && links.length > 0 ? (
            <>
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  onDelete={setDeleteConfirmationId}
                />
              ))}
              
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                total={pagination.total}
                pageSize={pageSize}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
                isLoading={isFetching}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <LinkIcon size={32} className="text-gray-300" />
              <p className="text-xs text-gray-500 uppercase">
                ainda não existem links cadastrados
              </p>
            </div>
          )}
        </div>
      )}

      <DeleteLinkModal
        isOpen={!!deleteConfirmationId}
        onClose={() => setDeleteConfirmationId(null)}
        onConfirm={handleDelete}
        isDeleting={deleteLink.isPending}
      />
    </div>
  );
}
