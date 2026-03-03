import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={`/?page=${currentPage - 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark text-sm font-medium rounded-lg transition-all hover:shadow-md"
        >
          <span className="material-icons text-base">chevron_left</span>
          Anterior
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/5 text-nordic-muted/40 text-sm font-medium rounded-lg cursor-not-allowed">
          <span className="material-icons text-base">chevron_left</span>
          Anterior
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={`/?page=${page}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
              page === currentPage
                ? 'bg-mosque text-white shadow-md shadow-mosque/20'
                : 'bg-white border border-nordic-dark/10 text-nordic-dark hover:border-mosque hover:text-mosque hover:shadow-sm'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next */}
      {hasNext ? (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark text-sm font-medium rounded-lg transition-all hover:shadow-md"
        >
          Siguiente
          <span className="material-icons text-base">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 bg-white border border-nordic-dark/5 text-nordic-muted/40 text-sm font-medium rounded-lg cursor-not-allowed">
          Siguiente
          <span className="material-icons text-base">chevron_right</span>
        </span>
      )}
    </div>
  )
}
