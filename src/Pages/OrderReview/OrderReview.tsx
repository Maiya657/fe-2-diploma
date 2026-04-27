import { useLocation, useParams } from "react-router";
import ScrollToAnchor from "../../Components/ScrollToAnchor";
import OrderStepper from "../../Components/Ticket/OrderStepper";
import OrderReviewContent from "../../Components/Ticket/OrderReview";
import { getTicketsUrl } from "../../Components/Ticket/OrderReview/helpers";

function OrderReview() {
  const { departureId } = useParams();
  const location = useLocation();
  const passangersUrl = departureId ? `/tickets/${departureId}/passangers${location.search}` : null;
  const paymentUrl = departureId ? `/tickets/${departureId}/payment${location.search}` : null;
  const stepUrls: (string | null)[] = [getTicketsUrl(location.search), passangersUrl, paymentUrl, null];

  return (
    <>
      <ScrollToAnchor />
      <OrderStepper activeStep={3} stepUrls={stepUrls} />
      <OrderReviewContent />
    </>
  );
}

export default OrderReview
