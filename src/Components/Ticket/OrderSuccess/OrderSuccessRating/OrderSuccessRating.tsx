import "../assets/style.css";

import ratingStar from "../../../../../public/icons/ratingStar.svg";

const RATING_VALUES = [1, 2, 3, 4, 5];

function OrderSuccessRating() {
  return (
    <div className="order-success-rating">
      <span className="order-success-rating__label">Оценить сервис</span>
      <div className="order-success-rating__stars" aria-label="Оценка сервиса">
        {RATING_VALUES.map((value) => (
          <button key={value} className="order-success-rating__star" type="button" aria-label={`${value} из 5`}>
            <img src={ratingStar} alt={`star-${value}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default OrderSuccessRating
