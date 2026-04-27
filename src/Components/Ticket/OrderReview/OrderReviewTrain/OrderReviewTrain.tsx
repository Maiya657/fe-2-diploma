import type { ReactNode } from "react";
import type { Route } from "../../../../store/api/trainApi";
import TicketSeatsInfo from "../../Tickets/TicketsList/Ticket/TicketSeatsInfo";
import TrainRouteInfo from "../../Tickets/TicketsList/Ticket/TrainRouteInfo";
import "../assets/style.css";

interface Props {
  children?: ReactNode;
  route: Route;
}

function OrderReviewTrain({ children, route }: Props) {
  return (
    <div className="ticket-wrapper order-review-train">
      <TrainRouteInfo route={route} />
      <TicketSeatsInfo route={route}>
        {children}
      </TicketSeatsInfo>
    </div>
  );
}

export default OrderReviewTrain
