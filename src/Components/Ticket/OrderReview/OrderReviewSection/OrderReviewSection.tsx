import type { ReactNode } from "react";
import { Link } from "react-router";
import "../assets/style.css";

interface Props {
  children: ReactNode;
  changeUrl?: string | null;
  footer?: ReactNode;
  hasSideAction?: boolean;
  title: string;
}

function OrderReviewSection({
  children,
  changeUrl,
  footer,
  hasSideAction = false,
  title,
}: Props) {
  return (
    <section className="order-review-section">
      <header className="order-review-section__header">
        <h2 className="order-review-section__title">{title}</h2>
      </header>

      <div className={hasSideAction ? "order-review-section__content order-review-section__content_side" : "order-review-section__content"}>
        <div className="order-review-section__body">
          {children}
        </div>

        {changeUrl ? (
          <div className="order-review-section__action">
            {footer}
            <Link className="order-review-section__change" to={changeUrl}>
              Изменить
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default OrderReviewSection
