import type {
  CreateOrderRequest,
  OrderDirection,
  OrderPersonInfo,
  OrderSeat,
} from "../../../store/api/trainApi";
import {
  getStoredPassengersFormData,
  getStoredPassengersSelection,
  getStoredPaymentFormData,
} from "../Order/helpers";
import type {
  StoredPassengerFormData,
  StoredPassengersFormData,
  StoredPaymentFormData,
} from "../Order/helpers";
import type {
  PassengerSelectionItem,
  PassengerSelectionType,
  PassengersSelectionState,
  SelectedSeatInfo,
} from "../Order/types";

const ORDER_SUCCESS_STORAGE_KEY_PREFIX = "order-success-summary";
const ORDER_NUMBER_LETTERS = ["А", "В", "Е", "К", "М", "Н", "Р", "С", "Т", "Х"];

export interface ReviewPassenger {
  birthdayLabel: string;
  documentLabel: string;
  fullName: string;
  genderLabel: string;
  id: string;
  typeLabel: string;
}

export interface OrderReviewData {
  passengers: ReviewPassenger[];
  passengersFormData: StoredPassengersFormData;
  paymentFormData: StoredPaymentFormData;
  paymentMethodLabel: string;
  selection: PassengersSelectionState;
  totalPrice: number;
}

export interface OrderSuccessSummary {
  customerName: string;
  orderNumber: string;
  totalPrice: number;
}

export const getTicketsUrl = (search: string): string => {
  if (typeof window !== "undefined") {
    const savedSearch = window.localStorage.getItem("tickets_search");

    if (savedSearch) {
      return `/tickets?${savedSearch}`;
    }
  }

  const searchParams = new URLSearchParams(search);

  searchParams.delete("arrivalId");

  const nextSearch = searchParams.toString();

  return nextSearch ? `/tickets?${nextSearch}` : "/tickets";
};

export const getOrderSuccessSummaryStorageKey = (
  departureId?: string | null,
  arrivalId?: string | null,
): string => `${ORDER_SUCCESS_STORAGE_KEY_PREFIX}:${departureId ?? ""}:${arrivalId ?? ""}`;

export const saveOrderSuccessSummary = (
  summary: OrderSuccessSummary,
  departureId?: string | null,
  arrivalId?: string | null,
): void => {
  if (typeof window === "undefined" || !departureId) {
    return;
  }

  window.sessionStorage.setItem(getOrderSuccessSummaryStorageKey(departureId, arrivalId), JSON.stringify(summary));
};

export const getStoredOrderSuccessSummary = (
  departureId?: string | null,
  arrivalId?: string | null,
): OrderSuccessSummary | undefined => {
  if (typeof window === "undefined" || !departureId) {
    return undefined;
  }

  const rawSummary = window.sessionStorage.getItem(getOrderSuccessSummaryStorageKey(departureId, arrivalId));

  if (!rawSummary) {
    return undefined;
  }

  try {
    return JSON.parse(rawSummary) as OrderSuccessSummary;
  } catch {
    return undefined;
  }
};

export const generateOrderNumber = (): string => {
  const number = Math.floor(100 + Math.random() * 900);
  const firstLetter = ORDER_NUMBER_LETTERS[Math.floor(Math.random() * ORDER_NUMBER_LETTERS.length)];
  const secondLetter = ORDER_NUMBER_LETTERS[Math.floor(Math.random() * ORDER_NUMBER_LETTERS.length)];

  return `${number}${firstLetter}${secondLetter}`;
};

export const getOrderReviewData = (
  departureId?: string | null,
  arrivalId?: string | null,
): OrderReviewData | null => {
  const selection = getStoredPassengersSelection(departureId, arrivalId);
  const passengersFormData = getStoredPassengersFormData(departureId, arrivalId);
  const paymentFormData = getStoredPaymentFormData(departureId, arrivalId);

  if (!selection || !passengersFormData || !paymentFormData || !paymentFormData.paymentMethod) {
    return null;
  }

  return {
    passengers: getReviewPassengers(selection.passengers, passengersFormData),
    passengersFormData,
    paymentFormData,
    paymentMethodLabel: paymentFormData.paymentMethod === "online" ? "Онлайн" : "Наличными",
    selection,
    totalPrice: getTotalPrice(selection),
  };
};

export const buildCreateOrderRequest = (
  reviewData: OrderReviewData,
  departureId?: string,
  arrivalId?: string | null,
): CreateOrderRequest | null => {
  const paymentMethod = reviewData.paymentFormData.paymentMethod;
  const departure = buildDirectionOrder(
    "departure",
    reviewData.selection,
    reviewData.passengersFormData,
    reviewData.selection.route?.departure?._id ?? reviewData.selection.route?.arrival?._id ?? departureId,
  );
  const arrival = reviewData.selection.arrival
    ? buildDirectionOrder(
      "arrival",
      reviewData.selection,
      reviewData.passengersFormData,
      reviewData.selection.route?.arrival?._id ?? arrivalId ?? undefined,
    )
    : undefined;

  if (!departure || !paymentMethod || (reviewData.selection.arrival && !arrival)) {
    return null;
  }

  return {
    user: {
      email: reviewData.paymentFormData.email,
      first_name: reviewData.paymentFormData.firstName,
      last_name: reviewData.paymentFormData.lastName,
      patronymic: reviewData.paymentFormData.patronymic,
      payment_method: paymentMethod,
      phone: reviewData.paymentFormData.phone,
    },
    departure,
    arrival: arrival ?? undefined,
  };
};

export const buildOrderSuccessSummary = (
  reviewData: OrderReviewData,
  orderNumber: string,
): OrderSuccessSummary => ({
  customerName: getFullName({
    firstName: reviewData.paymentFormData.firstName,
    lastName: "",
    patronymic: reviewData.paymentFormData.patronymic,
  }).trim(),
  orderNumber,
  totalPrice: reviewData.totalPrice,
});

const getTotalPrice = (selection: PassengersSelectionState): number => [
  ...selection.departure.selectedSeatInfos,
  ...(selection.arrival?.selectedSeatInfos ?? []),
].reduce((sum, seat) => sum + seat.price, 0);

const getReviewPassengers = (
  passengers: PassengerSelectionItem[],
  forms: StoredPassengersFormData,
): ReviewPassenger[] => passengers.map((passenger) => {
  const formData = forms[passenger.id];

  return {
    birthdayLabel: formData ? formatDate(formData.birthday) : "",
    documentLabel: formData ? getDocumentLabel(formData) : "",
    fullName: formData ? getFullName(formData) : "Пассажир",
    genderLabel: formData?.gender === "male" ? "мужской" : "женский",
    id: passenger.id,
    typeLabel: getPassengerTypeLabel(passenger.type),
  };
});

const buildDirectionOrder = (
  direction: "departure" | "arrival",
  selection: PassengersSelectionState,
  forms: StoredPassengersFormData,
  routeDirectionId?: string,
): OrderDirection | null => {
  if (!routeDirectionId) {
    return null;
  }

  const includeChildrenSeatIds = getAdultPassengerIdsWithChildrenSeat(selection, direction);
  const seats = selection.passengers.reduce<OrderSeat[]>((accumulator, passenger) => {
    const seat = direction === "departure" ? passenger.departureSeat : passenger.arrivalSeat;
    const formData = forms[passenger.id];

    if (!seat || !formData || passenger.type === "child_without_seat") {
      return accumulator;
    }

    accumulator.push(buildOrderSeat(
      seat,
      formData,
      passenger.type,
      includeChildrenSeatIds.has(passenger.id),
    ));

    return accumulator;
  }, []);

  return {
    route_direction_id: routeDirectionId,
    seats,
  };
};

const buildOrderSeat = (
  seat: SelectedSeatInfo,
  formData: StoredPassengerFormData,
  passengerType: PassengerSelectionType,
  includeChildrenSeat: boolean,
): OrderSeat => ({
  coach_id: seat.coachId,
  include_children_seat: includeChildrenSeat,
  is_child: passengerType === "child",
  person_info: buildPersonInfo(formData, passengerType === "adult"),
  seat_number: seat.seatIndex,
});

const buildPersonInfo = (
  formData: StoredPassengerFormData,
  isAdult: boolean,
): OrderPersonInfo => ({
  birthday: formData.birthday,
  document_data: getDocumentData(formData),
  document_type: formData.documentType,
  first_name: formData.firstName,
  gender: formData.gender === "male",
  is_adult: isAdult,
  last_name: formData.lastName,
  patronymic: formData.patronymic,
});

const getAdultPassengerIdsWithChildrenSeat = (
  selection: PassengersSelectionState,
  direction: "departure" | "arrival",
): Set<string> => {
  const childWithoutSeatCount = selection.passengers.filter(({ type }) => type === "child_without_seat").length;
  const adultPassengersWithSeat = selection.passengers.filter((passenger) =>
    passenger.type === "adult" && (direction === "departure" ? passenger.departureSeat : passenger.arrivalSeat),
  );

  return new Set(adultPassengersWithSeat.slice(0, childWithoutSeatCount).map(({ id }) => id));
};

const getPassengerTypeLabel = (type: PassengerSelectionType): string => {
  if (type === "adult") {
    return "Взрослый";
  }

  return type === "child" ? "Детский" : "Детский без места";
};

const getFullName = (data: Pick<StoredPassengerFormData, "firstName" | "lastName" | "patronymic">): string =>
  [data.lastName, data.firstName, data.patronymic].filter(Boolean).join(" ");

const getDocumentData = (data: StoredPassengerFormData): string =>
  data.documentSeries ? `${data.documentSeries} ${data.documentNumber}` : data.documentNumber;

const getDocumentLabel = (data: StoredPassengerFormData): string =>
  data.documentType === "passport"
    ? `Паспорт РФ ${getDocumentData(data)}`
    : `Свидетельство о рождении ${data.documentNumber}`;

const formatDate = (value: string): string => {
  const [year, month, day] = value.split("-");

  return year && month && day ? `${day}.${month}.${year}` : value;
};
