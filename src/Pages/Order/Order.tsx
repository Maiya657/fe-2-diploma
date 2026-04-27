import ScrollToAnchor from "../../Components/ScrollToAnchor";
import OrderStepper from "../../Components/Ticket/OrderStepper";
import Order from "../../Components/Ticket/Order";

const STEP_URLS: (string | null)[] = [null, null, null, null];

function OrderPage() {
  return (
    <>
      <ScrollToAnchor />
      <OrderStepper activeStep={0} stepUrls={STEP_URLS} />
      <Order />
    </>
  );
}

export default OrderPage
