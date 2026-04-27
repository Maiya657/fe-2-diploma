import { useLocation, useNavigate } from "react-router";
import type { Route } from "../../../../../store/api/trainApi";
import { saveSelectedRoute } from "../../../Order/helpers";
import { getSeatSelectionSearch } from "./helpers";
import TicketSeatsInfo from "./TicketSeatsInfo";
import TrainRouteInfo from "./TrainRouteInfo";
import "./assets/style.css";

interface Props {
  route: Route,
}

function Ticket({route}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const departureId = route.departure?._id ?? route.arrival?._id;
  const arrivalId = route.departure?._id ? route.arrival?._id : undefined;

  return (
    <div className="ticket-wrapper">
      <TrainRouteInfo route={route} />
      <TicketSeatsInfo route={route}>
        <button
          type="button"
          className="btn primary select-seat"
          disabled={!departureId}
          onClick={() => {
            if (!departureId) {
              return;
            }

            saveSelectedRoute(route, departureId, arrivalId);

            navigate({
              pathname: `/tickets/${departureId}/seats`,
              search: getSeatSelectionSearch(location.search, arrivalId),
            }, {
              state: {
                route,
              },
            });
          }}
        >
          Выбрать места
        </button>
      </TicketSeatsInfo>
    </div>
  ); 
}

export default Ticket
