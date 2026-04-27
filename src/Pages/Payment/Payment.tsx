import { useLocation, useParams } from "react-router";
import ScrollToAnchor from "../../Components/ScrollToAnchor";
import OrderStepper from "../../Components/Ticket/OrderStepper";
import PaymentContent from "../../Components/Ticket/Payment";

const getTicketsUrl = (search: string): string => {
  if (typeof window !== "undefined") {
    const savedSearch = window.localStorage.getItem("tickets_search");

    if (savedSearch) {
      return `/tickets?${savedSearch}`;
    }
  }

  const searchParams = new URLSearchParams(search);

  searchParams.delete("arrivalId");

  const nextSearch = searchParams.toString();

  return nextSearch ? `/tickets?${nextSearch}` : "/tickets";
};

function Payment() {
  const { departureId } = useParams();
  const location = useLocation();
  const passangersUrl = departureId ? `/tickets/${departureId}/passangers${location.search}` : null;
  const stepUrls: (string | null)[] = [getTicketsUrl(location.search), passangersUrl, null, null];

  return (
    <>
      <ScrollToAnchor />
      <OrderStepper activeStep={2} stepUrls={stepUrls} />
      <PaymentContent />
    </>
  );
}

export default Payment
