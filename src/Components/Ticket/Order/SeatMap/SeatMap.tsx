import cn from "classnames";
import type { CoachClassType, RouteSeat, RouteSeatsResponseItem } from "../../../../store/api/trainApi";
import SeatButton from "./SeatButton";
import "./assets/style.css";

interface Props {
  coachItem: RouteSeatsResponseItem;
  coachLabel: string;
  selectedSeats: number[];
  onSeatSelect: (seatIndex: number) => void;
}

const SEAT_TOTALS: Record<CoachClassType, number> = {
  first: 18,
  second: 32,
  third: 48,
  fourth: 62,
};

function padSeats(seats: RouteSeat[], total: number): RouteSeat[] {
  const map = new Map(seats.map((s) => [s.index, s]));
  return Array.from({ length: total }, (_, i) => map.get(i + 1) ?? { index: i + 1, available: false });
}

function groupInto<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

function interleaveForGrid(seats: RouteSeat[]): RouteSeat[] {
  const result: RouteSeat[] = [];
  for (let i = 0; i < seats.length; i += 2) {
    result.push(seats[i + 1]);
    result.push(seats[i]);
  }
  return result;
}

function SeatMap({ coachItem, coachLabel, selectedSeats, onSeatSelect }: Props) {
  const { coach, seats } = coachItem;
  const fullSeats = padSeats(seats, SEAT_TOTALS[coach.class_type]);

  const renderSeat = (seat: RouteSeat) => (
    <SeatButton
      key={seat.index}
      coach={coach}
      seat={seat}
      isSelected={selectedSeats.includes(seat.index)}
      onSelect={onSeatSelect}
    />
  );

  const renderCompartments = (compartmentSeats: RouteSeat[], isFirst: boolean) => {
    const size = isFirst ? 2 : 4;
    const compartments = groupInto(compartmentSeats, size);
    return compartments.map((comp, i) => (
      <div
        key={i}
        className={cn("seat-map__compartment", isFirst ? "seat-map__compartment_first" : "seat-map__compartment_second")}
      >
        {isFirst ? (
          <>
            {renderSeat(comp[1])}
            {renderSeat(comp[0])}
          </>
        ) : (
          <>
            {renderSeat(comp[1])}
            {renderSeat(comp[3])}
            {renderSeat(comp[0])}
            {renderSeat(comp[2])}
          </>
        )}
      </div>
    ));
  };

  const renderBody = () => {
    switch (coach.class_type) {
      case "first":
        return (
          <div className="seat-map__compartments">
            {renderCompartments(fullSeats, true)}
          </div>
        );

      case "second":
        return (
          <div className="seat-map__compartments">
            {renderCompartments(fullSeats, false)}
          </div>
        );

      case "third": {
        const mainSeats = fullSeats.slice(0, 32);
        const sideSeats = fullSeats.slice(32);
        return (
          <>
            <div className="seat-map__compartments">
              {renderCompartments(mainSeats, false)}
            </div>
            <div className="seat-map__corridor" />
            <div className="seat-map__side-berths">
              {sideSeats.map(renderSeat)}
            </div>
          </>
        );
      }

      case "fourth": {
        const sectionA = interleaveForGrid(fullSeats.slice(0, 32));
        const sectionB = interleaveForGrid(fullSeats.slice(32));
        return (
          <>
            <div className="seat-map__section seat-map__section_a">
              {sectionA.map(renderSeat)}
            </div>
            <div className="seat-map__corridor" />
            <div className="seat-map__section seat-map__section_b">
              {sectionB.map(renderSeat)}
            </div>
          </>
        );
      }
    }
  };

  return (
    <section className="seat-map">
      <div className={cn("seat-map__coach", `seat-map__coach_${coach.class_type}`)}>
        <div className="seat-map__entrance seat-map__entrance_left">
          <div className="seat-map__coach-number">{coachLabel}</div>
          <i className="seat-map__icon seat-map__icon_toilet" />
          <i className="seat-map__icon seat-map__icon_staff" />
        </div>

        <div className="seat-map__body">
          {renderBody()}
        </div>

        <div className="seat-map__entrance seat-map__entrance_right">
          <i className="seat-map__icon seat-map__icon_toilet" />
          <i className="seat-map__icon seat-map__icon_no-smoking" />
          <i className="seat-map__icon seat-map__icon_trash" />
        </div>
      </div>
    </section>
  );
}

export default SeatMap
