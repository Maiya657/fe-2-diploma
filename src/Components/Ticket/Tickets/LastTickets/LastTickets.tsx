import { formatCityName } from '../../../../store/api/helpers/formatCityName'
import { useGetLastRoutesQuery } from '../../../../store/api/trainApi'
import type { Route, RouteDirection } from '../../../../store/api/types/routes'
import './assets/style.css'

const getTicketDirection = (route: Route): RouteDirection | null =>
  route.departure ?? route.arrival

function LastTickets() {
  const {
    data: routes = [],
    isLoading,
    isFetching,
    isError,
  } = useGetLastRoutesQuery()

  if (isLoading || isFetching) {
    return (
      <div className="last-ticket-wrapper">
        <div className="last-tickets">Последние билеты</div>
        <div className="last-ticket__status">Загружаем последние билеты...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="last-ticket-wrapper">
        <div className="last-tickets">Последние билеты</div>
        <div className="last-ticket__status">Не удалось загрузить последние билеты.</div>
      </div>
    )
  }

  if (!routes.length) {
    return (
      <div className="last-ticket-wrapper">
        <div className="last-tickets">Последние билеты</div>
        <div className="last-ticket__status">Последние билеты пока недоступны.</div>
      </div>
    )
  }

  return (
    <div className="last-ticket-wrapper">
      <div className="last-tickets">Последние билеты</div>
      <div className="last-ticket-list">
        {routes.map((route, index) => {
          const routeDirection = getTicketDirection(route)

          if (!routeDirection) {
            return null
          }

          return (
            <div
              key={routeDirection._id ?? `${route.min_price}-${index}`}
              className="last-ticket-card"
            >
              <div className="last-ticket__direction">
                <div className="last-ticket__direction-from">
                  <div className="last-ticket__direction-city">
                    {formatCityName(routeDirection.from.city.name)}
                  </div>
                  <div className="last-ticket__direction-station">
                    {routeDirection.from.railway_station_name} вокзал
                  </div>
                </div>
                <div className="last-ticket__direction-to">
                  <div className="last-ticket__direction-city">
                    {formatCityName(routeDirection.to.city.name)}
                  </div>
                  <div className="last-ticket__direction-station">
                    {routeDirection.to.railway_station_name} вокзал
                  </div>
                </div>
              </div>
              <div className="last-ticket__container">
                <div className="ticket-service">
                  {routeDirection.have_wifi && <i className="wi-fi" />}
                  {routeDirection.is_express && <i className="express" />}
                  {routeDirection.have_air_conditioning && <i className="air-condition" />}
                </div>
                <div className="last-ticket__price">
                  <span className="price-from">от</span>
                  {routeDirection.min_price}
                  <span className="last-ticket-currency">₽</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LastTickets
