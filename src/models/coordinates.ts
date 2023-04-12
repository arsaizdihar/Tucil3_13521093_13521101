import haversineDistance from 'haversine-distance'

export interface LatLngCoordinate {
  lat: number
  lng: number
}


export const calculateHaversineDistance = (a: LatLngCoordinate, b: LatLngCoordinate): number => {
  return haversineDistance(a, b)
}
