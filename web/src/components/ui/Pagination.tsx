import { CaretLeft, CaretRight, CaretDoubleLeft, CaretDoubleRight } from "phosphor-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
}

export function Pagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [5, 10, 15, 20],
}: PaginationProps) {
  // Calcular range atual
  const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between mt-6 pt-4">
      {/* Seletor de itens por página */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Itens por página:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isLoading}
          className="
            px-2 py-1 text-sm border border-gray-200 rounded-md
            bg-white text-gray-600 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-base/20 focus:border-blue-base
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Range e navegação */}
      <div className="flex items-center gap-4">
        {/* Texto do range */}
        <span className="text-sm text-gray-500">
          {startItem}-{endItem} de {total}
        </span>

        {/* Botões de navegação */}
        <div className="flex items-center gap-1">
          {/* Primeira página */}
          <button
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious || isLoading}
            aria-label="Primeira página"
            className="
              w-8 h-8 flex items-center justify-center rounded-md
              text-gray-500 hover:bg-gray-100 transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            "
          >
            <CaretDoubleLeft size={16} weight="bold" />
          </button>

          {/* Página anterior */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious || isLoading}
            aria-label="Página anterior"
            className="
              w-8 h-8 flex items-center justify-center rounded-md
              text-gray-500 hover:bg-gray-100 transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            "
          >
            <CaretLeft size={16} weight="bold" />
          </button>

          {/* Próxima página */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext || isLoading}
            aria-label="Próxima página"
            className="
              w-8 h-8 flex items-center justify-center rounded-md
              text-gray-500 hover:bg-gray-100 transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            "
          >
            <CaretRight size={16} weight="bold" />
          </button>

          {/* Última página */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext || isLoading}
            aria-label="Última página"
            className="
              w-8 h-8 flex items-center justify-center rounded-md
              text-gray-500 hover:bg-gray-100 transition-colors
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            "
          >
            <CaretDoubleRight size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
