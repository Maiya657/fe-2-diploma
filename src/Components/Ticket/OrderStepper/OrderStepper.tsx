import cn from "classnames";
import { Link } from "react-router";
import "./assets/style.css";

const STEPS = ["Билеты", "Пассажиры", "Оплата", "Проверка"];

interface Props {
  activeStep: number;
  stepUrls: (string | null)[];
}

function OrderStepper({ activeStep, stepUrls }: Props) {
  return (
    <nav className={cn('order-stepper', {'order-stepper_done': activeStep+1 === STEPS.length})} aria-label="Шаги оформления заказа">
      <div className="order-stepper__content header-content">
        {STEPS.map((label, index) => {
          const isActive = index === activeStep;
          const isPast = index < activeStep;
          const url = stepUrls[index] ?? null;

          return (
            <div key={label} className={cn("order-stepper__item", { "order-stepper__item_active": isActive, "order-stepper__item_done": isPast })}>
              {isPast && url ? (
                <Link className="order-stepper__link" to={url}>
                  <span className="order-stepper__number">{index + 1}</span>
                  <span className="order-stepper__label">{label}</span>
                </Link>
              ) : (
                <>
                  <span className="order-stepper__number">{index + 1}</span>
                  <span className="order-stepper__label">{label}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default OrderStepper
