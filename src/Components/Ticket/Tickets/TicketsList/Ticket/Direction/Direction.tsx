import { RouteDirection } from "../../../../../../store/api/trainApi";
import moment from "moment";
import "./assets/style.css";
import cn from "classnames";
import { formatCityName } from "../../../../../../store/api/helpers/formatCityName";

interface Props {
  routeDirection: RouteDirection,
  isArrival?: boolean,
}

const durationFormat = (from: number, to: number): string => {
  const durationInMinutes = Math.floor((to - from) / 60);
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

function Direction({ routeDirection, isArrival }: Props) {
  return (
    <div className={cn("direction-wrapper", {"direction-wrapper-arrival": isArrival})}>
      <div className="direction-from">
        <div className="direction-time">{moment.unix(routeDirection.from.datetime).format('HH:mm')}</div>
        <div className="direction-city">{formatCityName(routeDirection.from.city.name)}</div>
        <div className="direction-station">{routeDirection.from.railway_station_name} вокзал</div>
      </div>
      <div className="direction-middle">
        <div className="duration">
          {durationFormat(routeDirection.from.datetime, routeDirection.to.datetime)}
        </div>
        <i className="yellow-arrow" />
      </div>
      <div className="direction-to">
        <div className="direction-time">{moment.unix(routeDirection.to.datetime).format('HH:mm')}</div>
        <div className="direction-city">{formatCityName(routeDirection.to.city.name)}</div>
        <div className="direction-station">{routeDirection.to.railway_station_name} вокзал</div>
      </div>
    </div>
  );
}

export default Direction
