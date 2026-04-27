import { useLocation, useParams } from "react-router";
import ScrollToAnchor from "../../Components/ScrollToAnchor";
import OrderStepper from "../../Components/Ticket/OrderStepper";
import PassangersContent from "../../Components/Ticket/Passangers";

function Passangers() {
  const { departureId } = useParams();
  const location = useLocation();
  const seatsUrl = departureId ? `/tickets/${departureId}/seats${location.search}` : null;
  const savedSearch = localStorage.getItem("tickets_search");
  const ticketsUrl = savedSearch ? `/tickets?${savedSearch}` : "/tickets";
  const stepUrls: (string | null)[] = [ticketsUrl, seatsUrl, null, null];

  return (
    <>
      <ScrollToAnchor />
      <OrderStepper activeStep={1} stepUrls={stepUrls} />
      <PassangersContent />
    </>
  );
}

export default Passangers
