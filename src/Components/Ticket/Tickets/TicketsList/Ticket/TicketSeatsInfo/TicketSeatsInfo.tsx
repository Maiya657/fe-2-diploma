import type { ReactNode } from "react";
import type { Route } from "../../../../../../store/api/trainApi";
import {
  getMinSeatPrice,
  getMinSeats,
  getSeatName,
  hasSeatClass,
  seatClassOrder,
} from "../helpers";
import "../assets/style.css";

interface Props {
  children?: ReactNode;
  route: Route;
}

function TicketSeatsInfo({ children, route }: Props) {
  return (
    <div className="ticket-seats">
      <div className="ticket-seats__list">
        {seatClassOrder.map((seatClass) => (
          hasSeatClass(route.departure, route.arrival, seatClass) ? (
            <div key={seatClass} className="ticket-seat">
              <div className="ticket-seat__type">{getSeatName(seatClass)}</div>
              <div className="ticket-seat__available">
                {getMinSeats(route.departure, route.arrival, seatClass)}
              </div>
              <div className="ticket-seat__min-price">
                <span className="price-from">от</span>
                {getMinSeatPrice(route.departure, route.arrival, seatClass)}
                <span className="currency">₽</span>
              </div>
            </div>
          ) : null
        ))}
      </div>
      <div>
        <div className="ticket-service">
          {(route.departure?.have_wifi || route.arrival?.have_wifi) ? <i className="wi-fi" /> : null}
          {(route.departure?.is_express || route.arrival?.is_express) ? <i className="express" /> : null}
          {(route.departure?.have_air_conditioning || route.arrival?.have_air_conditioning) ? (
            <i className="air-condition" />
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}

export default TicketSeatsInfo
