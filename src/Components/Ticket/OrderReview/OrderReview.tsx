import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { useCreateOrderMutation } from "../../../store/api/trainApi";
import { clearStoredOrderDraft, formatPrice } from "../Order/helpers";
import PassangersTripDetails from "../PassangersTripDetails";
import {
  buildCreateOrderRequest,
  buildOrderSuccessSummary,
  generateOrderNumber,
  getOrderReviewData,
  getTicketsUrl,
  saveOrderSuccessSummary,
} from "./helpers";
import OrderReviewPassenger from "./OrderReviewPassenger";
import OrderReviewSection from "./OrderReviewSection";
import OrderReviewTrain from "./OrderReviewTrain";
import "./assets/style.css";

const hasOrderResponseError = (response: unknown): boolean =>
  typeof response === "object" && response !== null && "error" in response;

function OrderReview() {
  const { departureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const arrivalId = searchParams.get("arrivalId");
  const reviewData = useMemo(
    () => getOrderReviewData(departureId, arrivalId),
    [arrivalId, departureId],
  );
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const ticketsUrl = getTicketsUrl(location.search);
  const passangersUrl = departureId ? `/tickets/${departureId}/passangers${location.search}` : null;
  const paymentUrl = departureId ? `/tickets/${departureId}/payment${location.search}` : null;

  const handleConfirmClick = async () => {
    if (!departureId || !reviewData) {
      return;
    }

    const orderRequest = buildCreateOrderRequest(reviewData, departureId, arrivalId);

    if (!orderRequest) {
      setErrorMessage("Не удалось подготовить данные заказа. Проверьте заполненные шаги.");

      return;
    }

    try {
      const orderNumber = generateOrderNumber();
      const response = await createOrder(orderRequest).unwrap();

      if (hasOrderResponseError(response)) {
        throw new Error("Order response contains error");
      }

      saveOrderSuccessSummary(buildOrderSuccessSummary(reviewData, orderNumber), departureId, arrivalId);
      clearStoredOrderDraft(departureId, arrivalId);
      navigate({
        pathname: `/tickets/${departureId}/order/success`,
        search: location.search,
      });
    } catch {
      setErrorMessage("Не удалось сохранить заказ. Попробуйте ещё раз.");
    }
  };

  return (
    <main className="order-review-page">
      <div className="main-content order-review-page__content">
        {reviewData?.selection ? (
          <PassangersTripDetails selection={reviewData.selection} />
        ) : (
          <div className="order-review-page__details-placeholder" aria-hidden="true" />
        )}

        <section className="order-review-page__workspace">
          {!reviewData ? (
            <div className="order-review-page__empty">
              <h1 className="order-review-page__title">Проверка заказа</h1>
              <p>Сначала выберите места, заполните данные пассажиров и способ оплаты.</p>
              <Link className="btn primary order-review-page__back-link" to={ticketsUrl}>
                Вернуться к билетам
              </Link>
            </div>
          ) : (
            <>
              <OrderReviewSection title="Поезд">
                {reviewData.selection.route ? (
                  <OrderReviewTrain route={reviewData.selection.route}>
                    <Link className="order-review-train__change" to={ticketsUrl}>
                      Изменить
                    </Link>
                  </OrderReviewTrain>
                ) : (
                  <p className="order-review-page__fallback">Данные поезда недоступны.</p>
                )}
              </OrderReviewSection>

              <OrderReviewSection
                title="Пассажиры"
                changeUrl={passangersUrl}
                hasSideAction
                footer={(
                  <div className="order-review-page__total">
                    <span>Всего</span>
                    <strong>
                      {formatPrice(reviewData.totalPrice)}
                      <span>₽</span>
                    </strong>
                  </div>
                )}
              >
                <div className="order-review-page__passengers">
                  {reviewData.passengers.map((passenger) => (
                    <OrderReviewPassenger key={passenger.id} passenger={passenger} />
                  ))}
                </div>
              </OrderReviewSection>

              <OrderReviewSection title="Способ оплаты" changeUrl={paymentUrl} hasSideAction>
                <p className="order-review-page__payment">{reviewData.paymentMethodLabel}</p>
              </OrderReviewSection>

              <footer className="order-review-page__footer">
                {errorMessage ? <span className="order-review-page__error">{errorMessage}</span> : null}
                <button
                  className="btn primary order-review-page__confirm"
                  type="button"
                  disabled={isLoading}
                  onClick={handleConfirmClick}
                >
                  {isLoading ? "Отправка..." : "Подтвердить"}
                </button>
              </footer>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default OrderReview
