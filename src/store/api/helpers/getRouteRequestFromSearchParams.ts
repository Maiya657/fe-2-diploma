import type { RouteRequest } from '../types/routes'

const booleanParams = new Set<string>([
  'have_first_class',
  'have_second_class',
  'have_third_class',
  'have_fourth_class',
  'have_wifi',
  'have_air_conditioning',
  'have_express',
])

const numberParams = new Set<string>([
  'price_from',
  'price_to',
  'start_departure_hour_from',
  'start_departure_hour_to',
  'start_arrival_hour_from',
  'start_arrival_hour_to',
  'end_departure_hour_from',
  'end_departure_hour_to',
  'end_arrival_hour_from',
  'end_arrival_hour_to',
  'limit',
  'offset',
])

export function getRouteRequestFromSearchParams(
  searchParams: URLSearchParams,
): Partial<RouteRequest> {
  const params = Object.fromEntries(searchParams.entries())
  const normalizedParams = Object.entries(params).reduce<Record<string, string | number | boolean>>(
    (acc, [key, value]) => {
      if (value.trim() === '') {
        return acc
      }

      if (booleanParams.has(key)) {
        acc[key] = value === 'true'
        return acc
      }

      if (numberParams.has(key)) {
        const numericValue = Number(value)

        if (Number.isFinite(numericValue)) {
          acc[key] = numericValue
        }

        return acc
      }

      acc[key] = value
      return acc
    },
    {},
  )

  return normalizedParams as Partial<RouteRequest>
}
