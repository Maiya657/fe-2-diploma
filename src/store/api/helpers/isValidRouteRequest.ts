import type { RouteRequest } from '../types/routes'

const requiredRouteParams: Array<keyof Pick<RouteRequest, 'from_city_id' | 'to_city_id'>> = [
  'from_city_id',
  'to_city_id',
]

export function isValidRouteRequest(
  routeRequest: Partial<RouteRequest>,
): routeRequest is RouteRequest {
  return requiredRouteParams.every((param) => {
    const value = routeRequest[param]

    return typeof value === 'string' && value.trim() !== ''
  })
}
