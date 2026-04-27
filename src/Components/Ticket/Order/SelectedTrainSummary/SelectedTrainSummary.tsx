import moment from "moment";
import { Link } from "react-router";
import { formatCityName } from "../../../../store/api/helpers/formatCityName";
import type { Route, RouteDirection } from "../../../../store/api/trainApi";
import { formatDuration, getTrainName } from "../helpers";
import "./assets/style.css";

interface Props {
  backToSearchPath: string;
  route?: Route;
  routeDirection: RouteDirection | null;
  showBackLink?: boolean;
  isArrival?: boolean;
}

function SelectedTrainSummary({
  backToSearchPath,
  route,
  routeDirection,
  showBackLink = true,
  isArrival = false,
}: Props) {
  return (
    <section className="selected-train-summary">
      {showBackLink ? (
        <div className={`selected-train-summary__action${isArrival ? " selected-train-summary__action_right" : ""}`}>
          <Link className="selected-train-summary__change-link" to={backToSearchPath}>
            <i className={`selected-train-summary__change-icon${isArrival ? " selected-train-summary__change-icon_rotated" : ""}`} />
            <button className="selected-train-summary__change-btn">Выбрать другой поезд</button>
          </Link>
        </div>
      ) : null}

      {routeDirection ? (
        <div className="selected-train-summary__info">
          <div className="selected-train-summary__train">
            <i className="selected-train-summary__train-icon" />
            <div>
              <div className="selected-train-summary__train-name">{getTrainName(route)}</div>
              <div className="selected-train-summary__route-point">
                {formatCityName(routeDirection.from.city.name)}
                <i className="selected-train-summary__route-arrow" />
              </div>
              <div className="selected-train-summary__route-point">
                {formatCityName(routeDirection.to.city.name)}
              </div>
            </div>
          </div>

          <div className="selected-train-summary__route">
            <div className="selected-train-summary__time-point">
              <div className="selected-train-summary__time">
                {moment.unix(routeDirection.from.datetime).format("HH:mm")}
              </div>
              <div className="selected-train-summary__city">
                {formatCityName(routeDirection.from.city.name)}
              </div>
              <div className="selected-train-summary__station">
                {routeDirection.from.railway_station_name} вокзал
              </div>
            </div>

            <i className="selected-train-summary__direction-arrow" />

            <div className="selected-train-summary__time-point">
              <div className="selected-train-summary__time">
                {moment.unix(routeDirection.to.datetime).format("HH:mm")}
              </div>
              <div className="selected-train-summary__city">
                {formatCityName(routeDirection.to.city.name)}
              </div>
              <div className="selected-train-summary__station">
                {routeDirection.to.railway_station_name} вокзал
              </div>
            </div>
          </div>

          <div className="selected-train-summary__duration">
            <i className="selected-train-summary__clock" />
            <span>{formatDuration(routeDirection.duration)}</span>
          </div>
        </div>
      ) : (
        <div className="selected-train-summary__fallback">
          Данные выбранного направления недоступны. Вернитесь к поиску и выберите поезд заново.
        </div>
      )}
    </section>
  );
}

export default SelectedTrainSummary
