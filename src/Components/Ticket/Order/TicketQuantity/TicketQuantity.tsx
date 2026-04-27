import type { PassengerTicketType, SelectedSeatInfo, TicketQuantityOption } from "../types";
import "./assets/style.css";

interface Props {
  activeTicketType: PassengerTicketType;
  childWithoutSeatCount: number;
  options: TicketQuantityOption[];
  selectedSeatInfos: SelectedSeatInfo[];
  onChildWithoutSeatCountChange: (value: number) => void;
  onTicketTypeChange: (value: PassengerTicketType) => void;
}

const getSelectedSeatsByType = (
  selectedSeatInfos: SelectedSeatInfo[],
  ticketType: PassengerTicketType,
) => selectedSeatInfos.filter((seat) => seat.ticketType === ticketType);

function TicketQuantity({
  activeTicketType,
  childWithoutSeatCount,
  options,
  selectedSeatInfos,
  onChildWithoutSeatCountChange,
  onTicketTypeChange,
}: Props) {
  return (
    <section className="ticket-quantity">
      <h2 className="ticket-quantity__title">Количество билетов</h2>
      <div className="ticket-quantity__options">
        {options.map((option) => {
          const selectedSeats = getSelectedSeatsByType(selectedSeatInfos, option.type);

          return (
            <button
              key={option.type}
              type="button"
              className={`ticket-quantity__option${activeTicketType === option.type ? " ticket-quantity__option_active" : ""}`}
              onClick={() => onTicketTypeChange(option.type)}
            >
              <span className="ticket-quantity__option-title">{option.title} — {option.count}</span>
              <span className="ticket-quantity__hint">{option.hint}</span>
              {selectedSeats.length ? (
                <ul className="ticket-quantity__list">
                  {selectedSeats.map((seat) => (
                    <li key={`${seat.ticketType}-${seat.coachId}-${seat.seatIndex}`} className="ticket-quantity__list-item">
                      Вагон {seat.coachLabel}, место {seat.seatIndex}
                    </li>
                  ))}
                </ul>
              ) : null}
            </button>
          );
        })}
        <div className="ticket-quantity__option ticket-quantity__option_static">
          <span className="ticket-quantity__option-title">Детских «без места» — {childWithoutSeatCount}</span>
          <input
            className="ticket-quantity__input"
            type="number"
            min="0"
            max="3"
            value={childWithoutSeatCount}
            onChange={(event) => onChildWithoutSeatCountChange(Math.max(0, Math.min(3, Number(event.target.value) || 0)))}
          />
        </div>
      </div>
    </section>
  );
}

export default TicketQuantity
