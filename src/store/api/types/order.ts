export type OrderPaymentMethod = 'cash' | 'online'

export interface OrderUser {
  first_name: string
  last_name: string
  patronymic: string
  phone: string
  email: string
  payment_method: OrderPaymentMethod
}

export interface OrderPersonInfo {
  is_adult: boolean
  first_name: string
  last_name: string
  patronymic: string
  gender: boolean
  birthday: string
  document_type: string
  document_data: string
}

export interface OrderSeat {
  coach_id: string
  person_info: OrderPersonInfo
  seat_number: number
  is_child: boolean
  include_children_seat: boolean
}

export interface OrderDirection {
  route_direction_id: string
  seats: OrderSeat[]
}

export interface CreateOrderRequest {
  user: OrderUser
  departure: OrderDirection
  arrival?: OrderDirection
}

export type CreateOrderResponse = unknown
