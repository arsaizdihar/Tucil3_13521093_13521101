import haversineDistance from 'haversine-distance'

export interface LatLngCoordinate {
  lat: number
  lng: number
}

export interface CartesianCoordinate {
  x: number
  y: number
}

export const calculateHaversineDistance = (a: LatLngCoordinate, b: LatLngCoordinate): number => {
  return haversineDistance(a, b)
}

export const calculateEuclideanDIstance = (a: CartesianCoordinate, b: CartesianCoordinate): number => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}