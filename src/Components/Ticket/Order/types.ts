import type {
  CoachClassType,
  Route,
  RouteSeatsResponseItem,
} from "../../../store/api/trainApi";

export interface OrderLocationState {
  route?: Route;
}

export interface CoachClassOption {
  type: CoachClassType;
  label: string;
  coaches: RouteSeatsResponseItem[];
  seatsCount: number;
  minPrice: number;
}

export type PassengerTicketType = "adult" | "child";
export type PassengerSelectionType = PassengerTicketType | "child_without_seat";
export type ExtraOptionKey = "wifi" | "linens";

export interface SelectedSeatAssignment {
  coachId: string;
  seatIndex: number;
  ticketType: PassengerTicketType;
}

export interface SelectedExtraOptions {
  linens: boolean;
  wifi: boolean;
}

export interface SelectedSeatInfo {
  coachId: string;
  coachLabel: string;
  seatIndex: number;
  price: number;
  ticketType: PassengerTicketType;
}

export interface PassengersSelectionDirection {
  childWithoutSeatCount: number;
  selectedSeatInfos: SelectedSeatInfo[];
}

export interface PassengerSelectionItem {
  arrivalSeat?: SelectedSeatInfo;
  departureSeat?: SelectedSeatInfo;
  id: string;
  type: PassengerSelectionType;
}

export interface PassengersSelectionState {
  arrival?: PassengersSelectionDirection;
  departure: PassengersSelectionDirection;
  passengers: PassengerSelectionItem[];
  route?: Route;
}

export interface TicketQuantityOption {
  count: number;
  hint: string;
  title: string;
  type: PassengerTicketType;
}

export type OrderDirectionType = "departure" | "arrival";
