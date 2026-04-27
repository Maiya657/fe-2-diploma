import { formatCityName } from "../../../../../store/api/helpers/formatCityName";
import type {
  Route,
  RouteDirection,
  RouteSeatsInfo,
} from "../../../../../store/api/trainApi";

export const seatClassOrder: Array<keyof RouteSeatsInfo> = ["fourth", "third", "second", "first"];

export const getMinSeats = (
  departure: RouteDirection | null,
  arrival: RouteDirection | null,
  seatClass: keyof RouteSeatsInfo,
): number => {
  if (departure?.available_seats_info[seatClass] && arrival?.available_seats_info[seatClass]) {
    return Math.min(departure.available_seats_info[seatClass], arrival.available_seats_info[seatClass]);
  }

  if (departure?.available_seats_info[seatClass]) {
    return departure.available_seats_info[seatClass];
  }

  return arrival?.available_seats_info[seatClass] || 0;
}

export const getMinSeatPrice = (
  departure: RouteDirection | null,
  arrival: RouteDirection | null,
  seatClass: keyof RouteSeatsInfo,
): string => {
  let minPrice = 0;

  if (departure?.price_info[seatClass]?.bottom_price && arrival?.price_info[seatClass]?.bottom_price) {
    minPrice = Math.min(departure.price_info[seatClass].bottom_price, arrival.price_info[seatClass].bottom_price);
  } else if (departure?.price_info[seatClass]?.bottom_price) {
    minPrice = departure.price_info[seatClass].bottom_price;
  } else {
    minPrice = arrival?.price_info[seatClass]?.bottom_price || 0;
  }

  return `${new Intl.NumberFormat("ru-RU").format(minPrice).replace(/\u00A0|\u202F/g, " ")}`;
}

export const getSeatName = (seatClass: keyof RouteSeatsInfo): string => {
  switch (seatClass) {
    case "first":
      return "Люкс";
    case "second":
      return "Купе";
    case "third":
      return "Плацкарт";
    case "fourth":
      return "Сидячий";
  }
}

export const getRoutePoints = (route: Route): string[] => {
  const rawRoutePoints = [
    route.departure?.from.city.name || "",
    route.arrival?.from.city.name || route.departure?.to.city.name || "",
    route.arrival?.to.city.name || route.departure?.to.city.name || "",
  ];

  return rawRoutePoints.reduce<string[]>((points, point) => {
    if (!point) {
      return points;
    }

    const formattedPoint = formatCityName(point);

    if (points[points.length - 1] === formattedPoint) {
      return points;
    }

    points.push(formattedPoint);

    return points;
  }, [])
}

export const hasSeatClass = (
  departure: RouteDirection | null,
  arrival: RouteDirection | null,
  seatClass: keyof RouteSeatsInfo,
): boolean => {
  const map = {
    first: "have_first_class",
    second: "have_second_class",
    third: "have_third_class",
    fourth: "have_fourth_class",
  } as const;

  return Boolean(departure?.[map[seatClass]] || arrival?.[map[seatClass]])
}

export const getSeatSelectionSearch = (currentSearch: string, arrivalId?: string): string => {
  const searchParams = new URLSearchParams(currentSearch);

  if (arrivalId) {
    searchParams.set("arrivalId", arrivalId);
  } else {
    searchParams.delete("arrivalId");
  }

  const nextSearch = searchParams.toString();

  return nextSearch ? `?${nextSearch}` : "";
}
