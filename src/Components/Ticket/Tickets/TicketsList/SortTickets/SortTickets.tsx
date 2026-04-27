import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import type { RouteResponse, RouteSort } from '../../../../../store/api/types/routes'
import './assets/style.css'

interface Props {
  route?: RouteResponse,
}

const sortOptions: Array<{ label: string; value: RouteSort }> = [
  { label: 'времени', value: 'date' },
  { label: 'стоимости', value: 'min_price' },
  { label: 'длительности', value: 'duration' },
]

function normalizeSortValue(sortValue: string | null): RouteSort {
  if (sortValue === 'price' || sortValue === 'min_price') {
    return 'min_price'
  }

  if (sortValue === 'duration') {
    return 'duration'
  }

  return 'date'
}

function SortTickets({ route }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement | null>(null)
  const activeSort = normalizeSortValue(searchParams.get('sort'))
  const activeOption =
    sortOptions.find(({ value }) => value === activeSort) ?? sortOptions[0]
  const hasTickets = Boolean(route?.items?.length)

  const handleSortChange = (sortValue: RouteSort) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('sort', sortValue)
    nextSearchParams.set('offset', '0')
    setSearchParams(nextSearchParams)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  return (
    <div className='sort-tickets' ref={selectRef}>
      <button
        type='button'
        className='sort-tickets__trigger'
        disabled={!hasTickets}
        onClick={() => setIsOpen((prevState) => !prevState)}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
      >
        {activeOption.label}
      </button>
      {isOpen && (
        <div className='sort-tickets__dropdown' role='listbox'>
          {sortOptions.map(({ label, value }) => (
            <button
              key={value}
              type='button'
              className='sort-tickets__option'
              data-active={activeSort === value}
              role='option'
              aria-selected={activeSort === value}
              onClick={() => handleSortChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortTickets
