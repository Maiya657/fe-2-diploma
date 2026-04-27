import { Link, useParams, useSearchParams } from "react-router";
import { formatPrice } from "../Order/helpers";
import { getStoredOrderSuccessSummary } from "../OrderReview/helpers";
import OrderSuccessInstruction from "./OrderSuccessInstruction";
import OrderSuccessRating from "./OrderSuccessRating";
import "./assets/style.css";

const instructions = [
  {
    icon: "/icons/sendTicket.svg",
    text: "билеты будут отправлены на ваш e-mail",
  },
  {
    icon: "/icons/printTicket.svg",
    text: "распечатайте и сохраняйте билеты до даты поездки",
  },
  {
    icon: "/icons/showTicket.svg",
    text: "предъявите распечатанные билеты при посадке",
  },
];

function OrderSuccess() {
  const { departureId } = useParams();
  const [searchParams] = useSearchParams();
  const arrivalId = searchParams.get("arrivalId");
  const summary = getStoredOrderSuccessSummary(departureId, arrivalId);
  const customerName = summary?.customerName || "Уважаемый пассажир";

  return (
    <main className="order-success-page">
      <section className="main-content order-success-page__content">
        <h1 className="order-success__title">Благодарим Вас за заказ!</h1>
        <div className="order-success-card">
          <header className="order-success-card__header">
            <h2>№Заказа {summary?.orderNumber ?? "оформлен"}</h2>
            {summary ? (
              <div className="order-success-card__sum">
                <span>сумма</span>
                <strong>
                  {formatPrice(summary.totalPrice)}
                  <span>₽</span>
                </strong>
              </div>
            ) : null}
          </header>

          <div className="order-success-card__instructions">
            {instructions.map((instruction) => (
              <OrderSuccessInstruction
                key={instruction.icon}
                icon={instruction.icon}
                text={instruction.text}
              />
            ))}
          </div>

          <div className="order-success-card__message">
            <h3>{customerName}!</h3>
            <p>
              Ваш заказ успешно оформлен.
              <br />
              В ближайшее время с вами свяжется наш оператор для подтверждения.
            </p>
            <p>Благодарим Вас за оказанное доверие и желаем приятного путешествия!</p>
          </div>

          <footer className="order-success-card__footer">
            <OrderSuccessRating />
            <Link className="btn order-success-card__home" to="/">
              Вернуться на главную
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess
