import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { formatCityName } from './helpers/formatCityName'
import type { City } from './types/city'
import type { CreateOrderRequest, CreateOrderResponse } from './types/order'
import type {
  LastRoutesResponse,
  RouteRequest,
  RouteResponse,
  RouteSeatsRequest,
  RouteSeatsResponseItem,
} from './types/routes'
import type { SubscribeRequest } from './types/subscribe'

const baseUrl =
  import.meta.env.VITE_API_URL ?? 'https://students.netoservices.ru/fe-diplom/'

export const trainApi = createApi({
  reducerPath: 'trainApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getCities: builder.query<City[], string>({
      query: (name) => ({
        url: '/routes/cities',
        params: { name },
      }),
      transformResponse: (response: City[]) =>
        response.map((city) => ({
          ...city,
          name: formatCityName(city.name),
        })),
    }),
    getRoutes: builder.query<RouteResponse, RouteRequest>({
      query: (request) => ({
        url: '/routes',
        params: request,
      }),
    }),
    getLastRoutes: builder.query<LastRoutesResponse, void>({
      query: () => ({
        url: '/routes/last',
      }),
    }),
    getRouteSeats: builder.query<RouteSeatsResponseItem[], { id: string, params?: RouteSeatsRequest }>({
      query: ({ id, params }) => ({
        url: `/routes/${id}/seats`,
        params,
      }),
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (order) => ({
        url: '/order',
        method: 'POST',
        body: order,
      }),
    }),
    subscribe: builder.mutation<void, SubscribeRequest>({
      query: ({ email }) => ({
        url: '/subscribe',
        method: 'POST',
        params: { email },
      }),
    }),
  }),
})

export const {
  useGetCitiesQuery,
  useGetRoutesQuery,
  useGetLastRoutesQuery,
  useGetRouteSeatsQuery,
  useCreateOrderMutation,
  useSubscribeMutation,
} = trainApi

export type { City } from './types/city'
export type {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderDirection,
  OrderPaymentMethod,
  OrderPersonInfo,
  OrderSeat,
  OrderUser,
} from './types/order'
export type {
  CoachClassType,
  LastRoutesResponse,
  RouteCoach,
  Route,
  RouteCity,
  RouteDirection,
  RoutePriceDetails,
  RoutePriceInfo,
  RouteRequest,
  RouteResponse,
  RouteSeat,
  RouteSeatsRequest,
  RouteSeatsResponseItem,
  RouteSeatsInfo,
  RouteSort,
  RouteStation,
  Train,
} from './types/routes'
export type { SubscribeRequest } from './types/subscribe'
