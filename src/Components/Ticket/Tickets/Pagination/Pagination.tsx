import { useEffect, useState } from 'react'
import './assets/style.css'

interface Props {
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

type PaginationItem = number | 'ellipsis'

const getPageItems = (totalPages: number, currentPage: number): PaginationItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ]
}

function Pagination({
  currentPage = 1,
  totalPages = 3,
  onPageChange,
}: Props) {
  const [activePage, setActivePage] = useState(currentPage)
  const normalizedTotalPages = Math.max(totalPages, 1)
  const pageItems = getPageItems(normalizedTotalPages, activePage)

  useEffect(() => {
    setActivePage(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === activePage) {
      return
    }

    setActivePage(page)
    onPageChange?.(page)
  }

  return (
    <nav className="pagination" aria-label="Навигация по страницам">
      <button
        type="button"
        className="pagination__button pagination__button_arrow"
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage === 1}
        aria-label="Предыдущая страница"
      >
        <span className="pagination__arrow pagination__arrow_left" />
      </button>
      {pageItems.map((item, index) => (
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="pagination__ellipsis"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className="pagination__button"
            data-active={item === activePage}
            onClick={() => handlePageChange(item)}
            aria-current={item === activePage ? 'page' : undefined}
          >
            {item}
          </button>
        )
      ))}
      <button
        type="button"
        className="pagination__button pagination__button_arrow"
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage === normalizedTotalPages}
        aria-label="Следующая страница"
      >
        <span className="pagination__arrow pagination__arrow_right" />
      </button>
    </nav>
  )
}

export default Pagination
