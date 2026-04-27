import type { ReviewPassenger } from "../helpers";
import "../assets/style.css";

interface Props {
  passenger: ReviewPassenger;
}

function OrderReviewPassenger({ passenger }: Props) {
  return (
    <article className="order-review-passenger">
      <div className="order-review-passenger__type">
        <span className="order-review-passenger__icon" aria-hidden="true" />
        <span>{passenger.typeLabel}</span>
      </div>
      <div className="order-review-passenger__body">
        <h3 className="order-review-passenger__name">{passenger.fullName}</h3>
        <p>Пол {passenger.genderLabel}</p>
        <p>Дата рождения {passenger.birthdayLabel}</p>
        <p>{passenger.documentLabel}</p>
      </div>
    </article>
  );
}

export default OrderReviewPassenger
