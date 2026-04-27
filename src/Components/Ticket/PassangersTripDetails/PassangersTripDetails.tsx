import { useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { formatCityName } from "../../../store/api/helpers/formatCityName";
import type { RouteDirection } from "../../../store/api/trainApi";
import { formatPrice, getTrainName } from "../Order/helpers";
import type {
  PassengerSelectionType,
  PassengersSelectionState,
  SelectedSeatInfo,
} from "../Order/types";
import "./assets/style.css";

interface Props {
  selection: PassengersSelectionState;
}

interface DirectionDetails {
  direction: RouteDirection | null;
  isArrival?: boolean;
  title: string;
}

interface PassengerPriceGroup {
  count: number;
  label: string;
  price: number;
  type: PassengerSelectionType;
}

type SectionKey = "departure" | "arrival" | "passengers";

const getCompactDuration = (durationInSeconds: number): string => {
  const durationInMinutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return `${hours} : ${String(minutes).padStart(2, "0")}`;
};

const getDirectionName = (direction: RouteDirection): string => {
  const from = formatCityName(direction.from.city.name);
  const to = formatCityName(direction.to.city.name);

  return `${from} - ${to}`;
};

const getDirectionDetails = (selection: PassengersSelectionState): DirectionDetails[] => {
  const route = selection.route;
  const departureDirection = route?.departure ?? route?.arrival ?? null;
  const directions: DirectionDetails[] = [
    {
      direction: departureDirection,
      title: "Туда",
    },
  ];

  if (selection.arrival) {
    directions.push({
      direction: route?.arrival ?? null,
      isArrival: true,
      title: "Обратно",
    });
  }

  return directions;
};

const getSeatSum = (
  seats: SelectedSeatInfo[],
  ticketType: SelectedSeatInfo["ticketType"],
): number =>
  seats
    .filter((seat) => seat.ticketType === ticketType)
    .reduce((sum, seat) => sum + seat.price, 0);

const getPassengerTypeLabel = (type: PassengerSelectionType, count: number): string => {
  if (type === "adult") {
    return count === 1 ? "Взрослый" : "Взрослых";
  }

  if (type === "child_without_seat") {
    return count === 1 ? "Ребенок без места" : "Детей без места";
  }

  return count === 1 ? "Ребенок" : "Детей";
};

const getPassengerGroups = (selection: PassengersSelectionState): PassengerPriceGroup[] => {
  const seats = [
    ...selection.departure.selectedSeatInfos,
    ...(selection.arrival?.selectedSeatInfos ?? []),
  ];
  const adultCount = selection.passengers.filter((passenger) => passenger.type === "adult").length;
  const childCount = selection.passengers.filter((passenger) => passenger.type === "child").length;
  const childWithoutSeatCount = selection.passengers.filter((passenger) => passenger.type === "child_without_seat").length;
  const groups: PassengerPriceGroup[] = [
    {
      count: adultCount,
      label: getPassengerTypeLabel("adult", adultCount),
      price: getSeatSum(seats, "adult"),
      type: "adult",
    },
    {
      count: childCount,
      label: getPassengerTypeLabel("child", childCount),
      price: getSeatSum(seats, "child"),
      type: "child",
    },
    {
      count: childWithoutSeatCount,
      label: getPassengerTypeLabel("child_without_seat", childWithoutSeatCount),
      price: 0,
      type: "child_without_seat",
    },
  ];

  return groups.filter((group) => group.count > 0);
};

const getTotalPrice = (selection: PassengersSelectionState): number => [
  ...selection.departure.selectedSeatInfos,
  ...(selection.arrival?.selectedSeatInfos ?? []),
].reduce((sum, seat) => sum + seat.price, 0);

function PassangersTripDetails({ selection }: Props) {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    arrival: true,
    departure: true,
    passengers: true,
  });
  const directionDetails = getDirectionDetails(selection);
  const passengerGroups = getPassengerGroups(selection);
  const totalPrice = getTotalPrice(selection);

  const handleSectionToggle = (sectionKey: SectionKey) => {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionKey]: !currentSections[sectionKey],
    }));
  };

  return (
    <aside className="passangers-trip-details" aria-label="Детали поездки">
      <h2 className="passangers-trip-details__title">Детали поездки</h2>

      {directionDetails.map(({ direction, isArrival = false, title }, index) => {
        const sectionKey: SectionKey = isArrival ? "arrival" : "departure";
        const isOpen = openSections[sectionKey];

        return (
          <section key={`${title}-${index}`} className="passangers-trip-details__section">
            <button
              className="passangers-trip-details__section-head"
              type="button"
              aria-expanded={isOpen}
              onClick={() => handleSectionToggle(sectionKey)}
            >
              <span className={classNames(
                "passangers-trip-details__direction-icon",
                { "passangers-trip-details__direction-icon_arrival": isArrival },
              )}
              />
              <div className="passangers-trip-details__info-date">
                <span className="passangers-trip-details__section-title">{title}</span>
                {direction ? (
                  <span className="passangers-trip-details__section-date">
                    {moment.unix(direction.from.datetime).format("DD.MM.YYYY")}
                  </span>
                ) : null}
              </div>
              
              <span className="passangers-trip-details__collapse-icon" aria-hidden="true" />
            </button>

            {isOpen ? (
              direction ? (
                <div className="passangers-trip-details__direction-body">
                  <div className="passangers-trip-details__meta-row">
                    <span>№ Поезда</span>
                    <strong>{direction.train.name || getTrainName(selection.route)}</strong>
                  </div>
                  <div className="passangers-trip-details__meta-row">
                    <span>Название</span>
                    <strong>{getDirectionName(direction)}</strong>
                  </div>

                  <div className="passangers-trip-details__route-row">
                    <div className="passangers-trip-details__route-point">
                      <strong>{moment.unix(direction.from.datetime).format("HH:mm")}</strong>
                      <span>{moment.unix(direction.from.datetime).format("DD.MM.YYYY")}</span>
                    </div>
                    <div className="passangers-trip-details__duration">
                      <span>{getCompactDuration(direction.duration)}</span>
                      <i className={classNames(
                        "passangers-trip-details__duration-arrow",
                        { "passangers-trip-details__duration-arrow_arrival": isArrival },
                      )}
                      />
                    </div>
                    <div className="passangers-trip-details__route-point passangers-trip-details__route-point_end">
                      <strong>{moment.unix(direction.to.datetime).format("HH:mm")}</strong>
                      <span>{moment.unix(direction.to.datetime).format("DD.MM.YYYY")}</span>
                    </div>
                  </div>

                  <div className="passangers-trip-details__stations">
                    <div>
                      <strong>{formatCityName(direction.from.city.name)}</strong>
                      <span>{direction.from.railway_station_name} вокзал</span>
                    </div>
                    <div>
                      <strong>{formatCityName(direction.to.city.name)}</strong>
                      <span>{direction.to.railway_station_name} вокзал</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="passangers-trip-details__empty">Данные направления недоступны.</p>
              )
            ) : null}
          </section>
        );
      })}

      <section className="passangers-trip-details__section">
        <button
          className="passangers-trip-details__section-head"
          type="button"
          aria-expanded={openSections.passengers}
          onClick={() => handleSectionToggle("passengers")}
        >
          <span className="passangers-trip-details__passenger-icon" />
          <span className="passangers-trip-details__section-title">Пассажиры</span>
          <span className="passangers-trip-details__collapse-icon" aria-hidden="true" />
        </button>

        {openSections.passengers ? (
          <div className="passangers-trip-details__passengers">
            {passengerGroups.map((group) => (
              <div key={group.type} className="passangers-trip-details__passenger-row">
                <span>{group.count} {group.label}</span>
                <strong>
                  {formatPrice(group.price)}
                  <span className="passangers-trip-details__currency">₽</span>
                </strong>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="passangers-trip-details__total">
        <span className="passangers-trip-details__total-label">Итог</span>
        <strong>
          {formatPrice(totalPrice)}
          <span className="passangers-trip-details__total-currency">₽</span>
        </strong>
      </div>
    </aside>
  );
}

export default PassangersTripDetails
