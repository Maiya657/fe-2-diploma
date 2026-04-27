import cn from "classnames";
import type { RouteCoach, RouteSeat } from "../../../../../store/api/trainApi";
import { formatPrice, getSeatPrice, getSeatPriceLabel } from "../../helpers";
import "./assets/style.css";

interface Props {
  coach: RouteCoach;
  seat: RouteSeat;
  isSelected: boolean;
  onSelect: (seatIndex: number) => void;
}

function SeatButton({ coach, seat, isSelected, onSelect }: Props) {
  const seatPrice = getSeatPrice(coach, seat.index);

  return (
    <button
      type="button"
      className={cn("seat-button", {
        "seat-button_available": seat.available,
        "seat-button_selected": isSelected,
        "seat-button_side": coach.class_type === "third" && seat.index > 32,
      })}
      disabled={!seat.available}
      onClick={() => onSelect(seat.index)}
      title={`${getSeatPriceLabel(coach, seat.index)} место, ${formatPrice(seatPrice)} ₽`}
    >
      {seat.index}
    </button>
  );
}

export default SeatButton
