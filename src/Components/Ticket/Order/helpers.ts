import type {
  CoachClassType,
  Route,
  RouteCoach,
  RouteDirection,
  RouteSeatsResponseItem,
} from "../../../store/api/trainApi";
import type {
  CoachClassOption,
  PassengerSelectionItem,
  PassengersSelectionDirection,
  PassengersSelectionState,
  SelectedSeatAssignment,
  SelectedSeatInfo,
  TicketQuantityOption,
} from "./types";

const SELECTED_ROUTE_STORAGE_KEY_PREFIX = "selected-route";
const SELECTED_PASSENGERS_SELECTION_STORAGE_KEY_PREFIX = "selected-passengers-selection";
const PASSENGERS_FORM_DATA_STORAGE_KEY_PREFIX = "passengers-form-data";
const PAYMENT_FORM_DATA_STORAGE_KEY_PREFIX = "payment-form-data";

export interface StoredPassengerFormData {
  birthday: string;
  documentNumber: string;
  documentSeries: string;
  documentType: string;
  firstName: string;
  gender: string;
  isLimitedMobility: boolean;
  lastName: string;
  patronymic: string;
}

export type StoredPassengersFormData = Record<string, StoredPassengerFormData>;

export interface StoredPaymentFormData {
  email: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  paymentMethod: "online" | "cash" | "";
  phone: string;
}

export const coachClassOrder: CoachClassType[] = ["first", "second", "third", "fourth"];

export const coachClassLabels: Record<CoachClassType, string> = {
  first: "Люкс",
  second: "Купе",
  third: "Плацкарт",
  fourth: "Сидячий",
};

export const getPrimaryDirection = (route?: Route): RouteDirection | null =>
  route?.departure ?? route?.arrival ?? null;

export const getSelectedRouteStorageKey = (
  departureId?: string | null,
  arrivalId?: string | null,
): string => `${SELECTED_ROUTE_STORAGE_KEY_PREFIX}:${departureId ?? ""}:${arrivalId ?? ""}`;

export const getPassengersSelectionStorageKey = (
  departureId?: string | null,
  arrivalId?: string | null,
): string => `${SELECTED_PASSENGERS_SELECTION_STORAGE_KEY_PREFIX}:${departureId ?? ""}:${arrivalId ?? ""}`;

export const getPassengersFormDataStorageKey = (
  departureId?: string | null,
  arrivalId?: string | null,
): string => `${PASSENGERS_FORM_DATA_STORAGE_KEY_PREFIX}:${departureId ?? ""}:${arrivalId ?? ""}`;

export const getPaymentFormDataStorageKey = (
  departureId?: string | null,
  arrivalId?: string | null,
): string => `${PAYMENT_FORM_DATA_STORAGE_KEY_PREFIX}:${departureId ?? ""}:${arrivalId ?? ""}`;

export const clearStoredOrderDraft = (
  departureId?: string | null,
  arrivalId?: string | null,
): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  [
    getSelectedRouteStorageKey(departureId, arrivalId),
    getPassengersSelectionStorageKey(departureId, arrivalId),
    getPassengersFormDataStorageKey(departureId, arrivalId),
    getPaymentFormDataStorageKey(departureId, arrivalId),
  ].forEach((storageKey) => {
    window.sessionStorage.removeItem(storageKey);
  });
};

export const saveSelectedRoute = (route: Route, departureId?: string | null, arrivalId?: string | null): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  window.sessionStorage.setItem(getSelectedRouteStorageKey(departureId, arrivalId), JSON.stringify(route));
};

export const getStoredSelectedRoute = (
  departureId?: string | null,
  arrivalId?: string | null,
): Route | undefined => {
  if (typeof window === "undefined" || !departureId) {
    return undefined;
  }

  const rawRoute = window.sessionStorage.getItem(getSelectedRouteStorageKey(departureId, arrivalId));

  if (!rawRoute) {
    return undefined;
  }

  try {
    return JSON.parse(rawRoute) as Route;
  } catch {
    return undefined;
  }
};

export const savePassengersSelection = (
  selection: PassengersSelectionState,
  departureId?: string | null,
  arrivalId?: string | null,
): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  window.sessionStorage.setItem(getPassengersSelectionStorageKey(departureId, arrivalId), JSON.stringify(selection));
};

export const getStoredPassengersSelection = (
  departureId?: string | null,
  arrivalId?: string | null,
): PassengersSelectionState | undefined => {
  if (typeof window === "undefined" || !departureId) {
    return undefined;
  }

  const rawSelection = window.sessionStorage.getItem(getPassengersSelectionStorageKey(departureId, arrivalId));

  if (!rawSelection) {
    return undefined;
  }

  try {
    return JSON.parse(rawSelection) as PassengersSelectionState;
  } catch {
    return undefined;
  }
};

export const savePassengersFormData = (
  data: StoredPassengersFormData,
  departureId?: string | null,
  arrivalId?: string | null,
): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  window.sessionStorage.setItem(getPassengersFormDataStorageKey(departureId, arrivalId), JSON.stringify(data));
};

export const getStoredPassengersFormData = (
  departureId?: string | null,
  arrivalId?: string | null,
): StoredPassengersFormData | undefined => {
  if (typeof window === "undefined" || !departureId) {
    return undefined;
  }

  const rawData = window.sessionStorage.getItem(getPassengersFormDataStorageKey(departureId, arrivalId));

  if (!rawData) {
    return undefined;
  }

  try {
    return JSON.parse(rawData) as StoredPassengersFormData;
  } catch {
    return undefined;
  }
};

export const savePaymentFormData = (
  data: StoredPaymentFormData,
  departureId?: string | null,
  arrivalId?: string | null,
): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  window.sessionStorage.setItem(getPaymentFormDataStorageKey(departureId, arrivalId), JSON.stringify(data));
};

export const getStoredPaymentFormData = (
  departureId?: string | null,
  arrivalId?: string | null,
): StoredPaymentFormData | undefined => {
  if (typeof window === "undefined" || !departureId) {
    return undefined;
  }

  const rawData = window.sessionStorage.getItem(getPaymentFormDataStorageKey(departureId, arrivalId));

  if (!rawData) {
    return undefined;
  }

  try {
    return JSON.parse(rawData) as StoredPaymentFormData;
  } catch {
    return undefined;
  }
};

export const getBackToSearchPath = (search: string): string => {
  const searchParams = new URLSearchParams(search);

  searchParams.delete("arrivalId");

  const nextSearch = searchParams.toString();

  return nextSearch ? `/tickets?${nextSearch}` : "/tickets";
};

export const getTrainName = (route?: Route): string => {
  const trainName = route?.departure?.train.name || route?.arrival?.train.name || "";

  if (!trainName || trainName.toLowerCase().includes("undefined")) {
    return "Поезд";
  }

  return trainName;
};

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat("ru-RU").format(value).replace(/\u00A0|\u202F/g, " ");

export const formatDuration = (durationInSeconds: number): string => {
  const durationInMinutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  return `${hours} часов ${minutes} минут`;
};

export const getCoachDisplayLabel = (coachName: string, index: number): string => {
  const coachNumber = coachName.match(/\d+/)?.[0];

  return coachNumber ?? String(index + 1).padStart(2, "0");
};

export const getCoachMinPrice = (coach: RouteCoach): number => {
  const prices = [
    coach.price,
    coach.bottom_price,
    coach.top_price,
    coach.side_price,
  ].filter((value): value is number => Boolean(value && value > 0));

  return prices.length ? Math.min(...prices) : 0;
};

export const getSeatPrice = (coach: RouteCoach, seatIndex: number): number => {
  switch (coach.class_type) {
    case "first":
      return coach.price ?? coach.bottom_price ?? coach.top_price ?? 0;
    case "second":
      return seatIndex % 2 === 1
        ? coach.bottom_price ?? coach.price ?? 0
        : coach.top_price ?? coach.price ?? 0;
    case "third":
      if (seatIndex > 32) {
        return coach.side_price ?? coach.top_price ?? coach.bottom_price ?? 0;
      }

      return seatIndex % 2 === 1
        ? coach.bottom_price ?? coach.price ?? 0
        : coach.top_price ?? coach.price ?? 0;
    case "fourth":
      return coach.bottom_price ?? coach.top_price ?? coach.price ?? 0;
  }
};

export const getSeatPriceLabel = (coach: RouteCoach, seatIndex: number): string => {
  if (coach.class_type === "third" && seatIndex > 32 && coach.side_price) {
    return "боковое";
  }

  if (coach.class_type === "second" || coach.class_type === "third") {
    return seatIndex % 2 === 1 ? "нижнее" : "верхнее";
  }

  if (coach.class_type === "fourth") {
    return "место";
  }

  return "купе";
};

export const getClassOptions = (coaches: RouteSeatsResponseItem[]): CoachClassOption[] =>
  coachClassOrder.reduce<CoachClassOption[]>((accumulator, classType) => {
    const coachesByClass = coaches.filter(({ coach }) => coach.class_type === classType);

    if (!coachesByClass.length) {
      return accumulator;
    }

    accumulator.push({
      type: classType,
      label: coachClassLabels[classType],
      coaches: coachesByClass,
      seatsCount: coachesByClass.reduce((sum, item) => sum + item.coach.available_seats, 0),
      minPrice: Math.min(...coachesByClass.map(({ coach }) => getCoachMinPrice(coach))),
    });

    return accumulator;
  }, []);

export const getSelectedSeatInfos = (
  coaches: RouteSeatsResponseItem[],
  selectedSeatAssignments: SelectedSeatAssignment[],
): SelectedSeatInfo[] => coaches.flatMap((coachItem, index) => {
  const coachAssignments = selectedSeatAssignments.filter(
    ({ coachId }) => coachId === coachItem.coach._id,
  );
  const coachLabel = getCoachDisplayLabel(coachItem.coach.name, index);

  return coachAssignments.map(({ seatIndex, ticketType }) => ({
    coachId: coachItem.coach._id,
    coachLabel,
    seatIndex,
    price: getSeatPrice(coachItem.coach, seatIndex),
    ticketType,
  }));
}).sort((left, right) => {
  if (left.coachLabel === right.coachLabel) {
    return left.seatIndex - right.seatIndex;
  }

  return left.coachLabel.localeCompare(right.coachLabel, "ru", { numeric: true });
});

export const arePassengerDirectionsCompatible = (
  departure: PassengersSelectionDirection,
  arrival?: PassengersSelectionDirection,
): boolean => {
  if (!arrival) {
    return true;
  }

  const departureAdultCount = departure.selectedSeatInfos.filter(({ ticketType }) => ticketType === "adult").length;
  const departureChildCount = departure.selectedSeatInfos.filter(({ ticketType }) => ticketType === "child").length;
  const arrivalAdultCount = arrival.selectedSeatInfos.filter(({ ticketType }) => ticketType === "adult").length;
  const arrivalChildCount = arrival.selectedSeatInfos.filter(({ ticketType }) => ticketType === "child").length;

  return departureAdultCount === arrivalAdultCount
    && departureChildCount === arrivalChildCount
    && departure.childWithoutSeatCount === arrival.childWithoutSeatCount;
};

const getSeatsByTicketType = (
  seats: SelectedSeatInfo[],
  ticketType: SelectedSeatInfo["ticketType"],
): SelectedSeatInfo[] => seats.filter((seat) => seat.ticketType === ticketType);

export const buildPassengerSelections = (
  departure: PassengersSelectionDirection,
  arrival?: PassengersSelectionDirection,
): PassengerSelectionItem[] => {
  const departureAdultSeats = getSeatsByTicketType(departure.selectedSeatInfos, "adult");
  const departureChildSeats = getSeatsByTicketType(departure.selectedSeatInfos, "child");
  const arrivalAdultSeats = arrival ? getSeatsByTicketType(arrival.selectedSeatInfos, "adult") : [];
  const arrivalChildSeats = arrival ? getSeatsByTicketType(arrival.selectedSeatInfos, "child") : [];

  return [
    ...departureAdultSeats.map((seat, index) => ({
      arrivalSeat: arrivalAdultSeats[index],
      departureSeat: seat,
      id: `adult-${index + 1}`,
      type: "adult" as const,
    })),
    ...departureChildSeats.map((seat, index) => ({
      arrivalSeat: arrivalChildSeats[index],
      departureSeat: seat,
      id: `child-${index + 1}`,
      type: "child" as const,
    })),
    ...Array.from({ length: departure.childWithoutSeatCount }, (_, index) => ({
      id: `child-without-seat-${index + 1}`,
      type: "child_without_seat" as const,
    })),
  ];
};

export const buildPassengersSelectionState = (
  route: Route | undefined,
  departure: PassengersSelectionDirection,
  arrival?: PassengersSelectionDirection,
): PassengersSelectionState => ({
  arrival,
  departure,
  passengers: buildPassengerSelections(departure, arrival),
  route,
});

export const getTicketQuantityOptions = (
  adultCount: number,
  childCount: number,
): TicketQuantityOption[] => [
  {
    count: adultCount,
    hint: `Можно добавить еще ${Math.max(0, 4 - adultCount)} пассажиров`,
    title: "Взрослых",
    type: "adult",
  },
  {
    count: childCount,
    hint: `Можно добавить еще ${Math.max(0, 3 - childCount)} детей до 10 лет. Свое место в вагоне дешевле в среднем на 50-65%.`,
    title: "Детских",
    type: "child",
  },
];
