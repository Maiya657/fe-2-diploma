import { useEffect } from "react";
import { useSearchParams } from "react-router";
import ScrollToAnchor from "../../Components/ScrollToAnchor";
import OrderStepper from "../../Components/Ticket/OrderStepper";
import TicketsList from "../../Components/Ticket/Tickets";

const STEP_URLS: (string | null)[] = [null, null, null, null];

function Tickets() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();

    if (search) {
      localStorage.setItem("tickets_search", search);
    }
  }, [searchParams]);

  return (
    <>
      <ScrollToAnchor />
      <OrderStepper activeStep={0} stepUrls={STEP_URLS} />
      <TicketsList />
    </>
  );
}

export default Tickets
