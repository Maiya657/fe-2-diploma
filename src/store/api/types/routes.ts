export type RouteSort = 'date' | 'min_price' | 'duration'
export type CoachClassType = 'first' | 'second' | 'third' | 'fourth'

export interface RoutePriceDetails {
  price?: number
  top_price?: number
  bottom_price?: number
  side_price?: number
  linens_price?: number
  wifi_price?: number
}

export interface RouteRequest {
  from_city_id: string
  to_city_id: string
  date_start?: string
  date_end?: string
  date_start_arrival?: string
  date_end_arrival?: string
  have_first_class?: boolean
  have_second_class?: boolean
  have_third_class?: boolean
  have_fourth_class?: boolean
  have_wifi?: boolean
  have_air_conditioning?: boolean
  have_express?: boolean
  price_from?: number
  price_to?: number
  start_departure_hour_from?: number
  start_departure_hour_to?: number
  start_arrival_hour_from?: number
  start_arrival_hour_to?: number
  end_departure_hour_from?: number
  end_departure_hour_to?: number
  end_arrival_hour_from?: number
  end_arrival_hour_to?: number
  limit?: number
  offset?: number
  sort?: RouteSort
}

export interface RouteCity {
  _id: string
  name: string
}

export interface RouteStation {
  datetime: number
  railway_station_name: string
  city: RouteCity
}

export interface Train {
  _id: string
  name: string
}

export interface RouteSeatsInfo {
  first?: number
  second?: number
  third?: number
  fourth?: number
}

export interface RouteSeat {
  index: number
  available: boolean
}

export interface RouteCoach {
  _id: string
  name: string
  class_type: CoachClassType
  have_wifi: boolean
  have_air_conditioning: boolean
  price?: number
  top_price?: number
  bottom_price?: number
  side_price?: number
  linens_price?: number
  wifi_price?: number
  is_linens_included: boolean
  available_seats: number
  train: string
}

export interface RouteSeatsRequest {
  have_first_class?: boolean
  have_second_class?: boolean
  have_third_class?: boolean
  have_fourth_class?: boolean
  have_wifi?: boolean
  have_air_conditioning?: boolean
}

export interface RouteSeatsResponseItem {
  coach: RouteCoach
  seats: RouteSeat[]
}

export interface RoutePriceInfo {
  first?: RoutePriceDetails
  second?: RoutePriceDetails
  third?: RoutePriceDetails
  fourth?: RoutePriceDetails
}

export interface RouteDirection {
  _id?: string
  have_first_class: boolean
  have_second_class: boolean
  have_third_class: boolean
  have_fourth_class: boolean
  have_wifi: boolean
  have_air_conditioning: boolean
  is_express: boolean
  min_price: number
  train: Train
  from: RouteStation
  to: RouteStation
  duration: number
  price_info: RoutePriceInfo
  available_seats_info: RouteSeatsInfo
}

export interface Route {
  have_first_class: boolean
  have_second_class: boolean
  have_third_class: boolean
  have_fourth_class: boolean
  have_wifi: boolean
  have_air_conditioning: boolean
  is_express: boolean
  min_price: number
  available_seats?: number
  available_seats_info?: RouteSeatsInfo
  arrival: RouteDirection | null
  departure: RouteDirection | null
  total_avaliable_seats: number
}

export interface RouteResponse {
  total_count: number
  items: Route[]
}

export type LastRoutesResponse = Route[]
