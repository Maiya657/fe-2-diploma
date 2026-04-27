import { skipToken } from '@reduxjs/toolkit/query'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { getRouteRequestFromSearchParams } from '../../../../store/api/helpers/getRouteRequestFromSearchParams'
import { isValidRouteRequest } from '../../../../store/api/helpers/isValidRouteRequest'
import { useGetRoutesQuery } from '../../../../store/api/trainApi'
import type { RouteRequest } from '../../../../store/api/types/routes'
import Pagination from '../Pagination'
import Ticket from './Ticket'
import SortTickets from './SortTickets'
import StatusState from './StatusState'
import './assets/style.css'

const limitOptions = [2, 5, 10, 20]

function TicketsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeLimit = Number(searchParams.get('limit')) || 5
  const activeOffset = Number(searchParams.get('offset')) || 0
  const routeRequest = useMemo<RouteRequest | null>(() => {
    const normalizedParams = getRouteRequestFromSearchParams(searchParams)
    const rawSort = searchParams.get('sort')

    if (rawSort === 'price') {
      normalizedParams.sort = 'min_price'
    }

    if (!isValidRouteRequest(normalizedParams)) {
      return null
    }

    return normalizedParams
  }, [searchParams])

  const {
    data: routes,
    isLoading,
    isFetching,
    isError,
  } = useGetRoutesQuery(routeRequest ?? skipToken)
  const routeItems = routes?.items ?? []
  const totalCount = routes?.total_count || 0
  const totalPages = Math.ceil(totalCount / activeLimit)
  const currentPage = Math.floor(activeOffset / activeLimit) + 1

  const handleLimitChange = (limitValue: number) => {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.set('limit', String(limitValue))
    nextSearchParams.set('offset', '0')
    setSearchParams(nextSearchParams)
  }

  const handlePageChange = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    const nextOffset = (page - 1) * activeLimit

    nextSearchParams.set('offset', String(nextOffset))
    setSearchParams(nextSearchParams)
  }

  if (!routeRequest) {
    return (
      <StatusState
        title='Укажите направление'
        description='Заполните города отправления и назначения, чтобы мы подобрали подходящие билеты.'
      />
    )
  }

  if (isLoading || isFetching) {
    return (
      <StatusState
        title='Подбираем билеты'
        description='Обновляем список маршрутов и самые выгодные варианты для выбранного направления.'
        tone='loading'
      />
    )
  }

  if (isError) {
    return (
      <StatusState
        title='Не удалось загрузить билеты'
        description='Попробуйте обновить параметры поиска или повторить запрос чуть позже.'
        tone='error'
      />
    )
  }

  return (
    <>
      <div className='ticket-sorted'>
        <div className='ticket-found'>найдено {totalCount}</div>
        <div className='ticket-sorted__filters'>
          <div className='sorted'>
            <span className='ticket-sorted__label'>сортировать по:</span>
            <SortTickets route={routes} />
          </div>
          <div className='show-by'>
            <span className='ticket-sorted__label'>показывать по:</span>
            <div className='ticket-limit'>
              {limitOptions.map((limitValue) => (
                <button
                  key={limitValue}
                  type='button'
                  className='ticket-limit__button'
                  data-active={activeLimit === limitValue}
                  onClick={() => handleLimitChange(limitValue)}
                >
                  {limitValue}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {routeItems.map((item, i) => (<Ticket key={i} route={item} />))}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  )
}

export default TicketsList
