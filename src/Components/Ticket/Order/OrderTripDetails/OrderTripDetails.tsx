import moment from "moment";
import { Link } from "react-router";
import { formatCityName } from "../../../../store/api/helpers/formatCityName";
import type { Route, RouteDirection } from "../../../../store/api/trainApi";
import { formatDuration, getTrainName } from "../helpers";
import "./assets/style.css";

interface Props {
  route?: Route;
  routeDirection: RouteDirection | null;
}

const getDirections = (route?: Route): RouteDirection[] => [
  route?.departure,
  route?.arrival,
].filter((direction): direction is RouteDirection => Boolean(direction));

function OrderTripDetails({ route, routeDirection }: Props) {
  const directions = getDirections(route);

  return (
    <aside className="order-trip-details">
      <div className="order-trip-details__title-row">
        <i className="order-trip-details__title-icon" />
        <h1 className="order-trip-details__title">Детали поездки</h1>
      </div>

      <Link className="order-trip-details__change-link" to="/tickets">
        Выбрать другой поезд
      </Link>

      {routeDirection ? (
        <div className="order-trip-details__train">
          <i className="order-trip-details__train-icon" />
          <div>
            <div className="order-trip-details__train-name">{getTrainName(route)}</div>
            <div className="order-trip-details__route">
              {formatCityName(routeDirection.from.city.name)}
              <i className="order-trip-details__route-arrow" />
              {formatCityName(routeDirection.to.city.name)}
            </div>
          </div>
        </div>
      ) : (
        <div className="order-trip-details__empty">Данные выбранного поезда недоступны.</div>
      )}

      {directions.map((direction, index) => (
        <div key={`${direction.from.datetime}-${direction.to.datetime}`} className="order-trip-details__direction">
          <div className="order-trip-details__direction-label">
            {index === 0 ? "Туда" : "Обратно"}
          </div>
          <div className="order-trip-details__date">
            {moment.unix(direction.from.datetime).format("DD.MM.YYYY")}
          </div>
          <div className="order-trip-details__points">
            <div>
              <div className="order-trip-details__time">
                {moment.unix(direction.from.datetime).format("HH:mm")}
              </div>
              <div className="order-trip-details__city">
                {formatCityName(direction.from.city.name)}
              </div>
              <div className="order-trip-details__station">
                {direction.from.railway_station_name} вокзал
              </div>
            </div>
            <div className="order-trip-details__duration">
              {formatDuration(direction.duration)}
            </div>
            <div>
              <div className="order-trip-details__time">
                {moment.unix(direction.to.datetime).format("HH:mm")}
              </div>
              <div className="order-trip-details__city">
                {formatCityName(direction.to.city.name)}
              </div>
              <div className="order-trip-details__station">
                {direction.to.railway_station_name} вокзал
              </div>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}

export default OrderTripDetails
