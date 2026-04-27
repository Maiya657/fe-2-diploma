import type { ReviewType } from "./Review/Review";
import Review from "./Review";

import './assets/style.css'

export type Props = {
  reviews: ReviewType[], 
}

function Reviews({reviews}: Props) {
  return (
    <div className="main-content">
      <h3 className="reviews-title" id="reviews">Отзывы</h3>
      <div className="reviews-wrapper">
        {reviews.map((review, i) => (<Review key={i} {...review} />))}
      </div>
      <ul className="dots">
        <li className="dots-dot dots-dot__active">
          <a onClick={e => e.preventDefault()} href="#"></a>
        </li>
        <li className="dots-dot">
          <a onClick={e => e.preventDefault()} href="#"></a>
        </li>
        <li className="dots-dot">
          <a onClick={e => e.preventDefault()} href="#"></a>
        </li>
        <li className="dots-dot">
          <a onClick={e => e.preventDefault()} href="#"></a>
        </li>
        <li className="dots-dot">
          <a onClick={e => e.preventDefault()} href="#"></a>
        </li>
      </ul>
    </div>
  )
}

export default Reviews
