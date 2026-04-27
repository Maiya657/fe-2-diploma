import cn from "classnames";
import type { RouteCoach, RouteSeatsResponseItem } from "../../../../store/api/trainApi";
import { formatPrice } from "../helpers";
import type { ExtraOptionKey, SelectedExtraOptions } from "../types";
import "./assets/style.css";

interface Props {
  coachItem: RouteSeatsResponseItem;
  coachLabel: string;
  onExtraOptionToggle: (optionKey: ExtraOptionKey) => void;
  selectedExtraOptions: SelectedExtraOptions;
}

interface PriceLine {
  label: string;
  value?: number;
}

interface ServiceOption {
  iconClassName: string;
  isClickable: boolean;
  isIncluded: boolean;
  isSelected: boolean;
  isUnavailable: boolean;
  id: "air" | "wifi" | "linens";
  toggleKey?: ExtraOptionKey;
  title: string;
}

const getPriceLines = (coach: RouteCoach): PriceLine[] => [
  { label: "верхние", value: coach.top_price },
  { label: "нижние", value: coach.bottom_price },
  { label: "боковые", value: coach.side_price },
  { label: "купе", value: coach.price },
].filter(({ value }) => Boolean(value && value > 0));

const getServiceOptions = (
  coach: RouteCoach,
  selectedExtraOptions: SelectedExtraOptions,
): ServiceOption[] => [
  {
    iconClassName: "coach-info__service-icon_air",
    isClickable: false,
    isIncluded: false,
    isSelected: coach.have_air_conditioning,
    isUnavailable: !coach.have_air_conditioning,
    id: "air",
    title: "Кондиционер",
  },
  {
    iconClassName: "coach-info__service-icon_wifi",
    isClickable: coach.have_wifi && Boolean(coach.wifi_price),
    isIncluded: coach.have_wifi && !coach.wifi_price,
    isSelected: coach.have_wifi && Boolean(coach.wifi_price)
      ? selectedExtraOptions.wifi
      : coach.have_wifi && !coach.wifi_price,
    isUnavailable: !coach.have_wifi,
    id: "wifi",
    toggleKey: "wifi",
    title: coach.wifi_price ? `Wi-Fi +${formatPrice(coach.wifi_price)} ₽` : "Wi-Fi",
  },
  {
    iconClassName: "coach-info__service-icon_linens",
    isClickable: !coach.is_linens_included && Boolean(coach.linens_price),
    isIncluded: coach.is_linens_included,
    isSelected: !coach.is_linens_included && Boolean(coach.linens_price)
      ? selectedExtraOptions.linens
      : coach.is_linens_included,
    isUnavailable: !coach.is_linens_included && !coach.linens_price,
    id: "linens",
    toggleKey: "linens",
    title: coach.is_linens_included
      ? "Постельное белье включено"
      : coach.linens_price
        ? `Постельное белье +${formatPrice(coach.linens_price)} ₽`
        : "Постельное белье недоступно",
  },
];

function CoachInfo({
  coachItem,
  coachLabel,
  onExtraOptionToggle,
  selectedExtraOptions,
}: Props) {
  const { coach, seats } = coachItem;
  const upperSeats = seats.filter((seat) => seat.available && seat.index % 2 === 0 && seat.index <= 36).length;
  const lowerSeats = seats.filter((seat) => seat.available && seat.index % 2 === 1 && seat.index <= 36).length;
  const sideSeats = seats.filter((seat) => seat.available && seat.index > 36).length;
  const priceLines = getPriceLines(coach);
  const serviceOptions = getServiceOptions(coach, selectedExtraOptions);

  return (
    <section className="coach-info">
      <div className="coach-info__sidebar">
        <div className="coach-info__number">{coachLabel}</div>
        <div className="coach-info__caption">вагон</div>
      </div>

      <div className="coach-info__body">
        <div className="coach-info__column">
          <div className="coach-info__label">Места
            <span className="coach-info__metric">{coach.available_seats}</span>
          </div>
          {coach.class_type !== "first" && <div className="coach-info__metric">Верхние <strong>{upperSeats}</strong></div>}
          {coach.class_type !== "first" && <div className="coach-info__metric">Нижние <strong>{lowerSeats}</strong></div>}
          {coach.class_type === "third" && <div className="coach-info__metric">Боковые <strong>{sideSeats}</strong></div>}
        </div>

        <div className="coach-info__column">
          <div className="coach-info__label">Стоимость</div>
          {priceLines.map((line) => (
            <div key={line.label} className="coach-info__price">
              <strong>{formatPrice(line.value ?? 0)}
                <span className="currency">₽</span>
              </strong>
            </div>
          ))}
        </div>

        <div className="coach-info__column">
          <div className="coach-info__label">Доп. опции в вагонах</div>
          <div className="coach-info__services">
            {serviceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={cn("coach-info__service", {
                  "coach-info__service_clickable": option.isClickable,
                  "coach-info__service_included": option.isIncluded,
                  "coach-info__service_selected": option.isSelected && !option.isIncluded,
                  "coach-info__service_unavailable": option.isUnavailable,
                })}
                disabled={!option.isClickable}
                onClick={() => {
                  if (option.isClickable && option.toggleKey) {
                    onExtraOptionToggle(option.toggleKey);
                  }
                }}
                aria-label={option.title}
              >
                <i className={cn("coach-info__service-icon", option.iconClassName)} />
                <span className="coach-info__tooltip" role="tooltip">
                  {option.title}
                </span>
              </button>
            ))}
          </div>
          <div className="coach-info__services-note">
            Доступны: кондиционер, Wi-Fi и постельное белье.
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoachInfo
