import type { Route } from "../../../../../../store/api/trainApi";
import { getTrainName } from "../../../../Order/helpers";
import { getRoutePoints } from "../helpers";
import Direction from "../Direction";
import "../assets/style.css";

interface Props {
  route: Route;
}

function TrainRouteInfo({ route }: Props) {
  const routePoints = getRoutePoints(route);

  return (
    <>
      <div className="route">
        <i className="train-icon" />
        <div className="route__name">{getTrainName(route)}</div>
        <div className="route__points">
          {routePoints.map((point, index) => (
            <div key={`${point}-${index}`} className="route__point">
              <span className={index === 0 ? "route__point-text route__point-text_muted" : "route__point-text"}>
                {point}
              </span>
              {index < routePoints.length - 1 ? <i className="arrow" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="direction-group">
        {route.departure ? <Direction routeDirection={route.departure} /> : null}
        {route.arrival ? <Direction routeDirection={route.arrival} isArrival /> : null}
      </div>
    </>
  );
}

export default TrainRouteInfo
