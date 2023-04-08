import {Graph} from '../models/graph'
import bandung from '../maps/bandung.json'
import {calculateHaversineDistance, LatLngCoordinate as Coordinate} from '../models/coordinates'
import {Node} from '../models/node'

interface MapFormat {
  nodes: number[][]
  edges: number[][]
}


export const loadGraphFromMap = (): Graph<Coordinate, number> => {
  const graph = new Graph<Coordinate, number>()
  const bandungMap = bandung as MapFormat
  
  bandungMap.nodes.forEach(node => {
    graph.addNodeWithId(node[0], {
      lat: node[1],
      lng: node[2]
    })
  })

  bandungMap.edges.forEach(edge => {
    const from = graph.nodes.get(edge[0])!
    const to = graph.nodes.get(edge[1])!
    graph.addEdge(from, to, edge[2])
  })

  return graph
}

export const closestNode = (graph: Graph<Coordinate, number>, target: Coordinate): Node<Coordinate, number> | null => {
  let closest: Node<Coordinate, number> | null = null
  let closestDistance: number = Number.POSITIVE_INFINITY
  graph.nodes.forEach(node => {
    if (closest === null) {
      closest = node
      closestDistance = calculateHaversineDistance(node.data, target)
    } else {
      const distance = calculateHaversineDistance(node.data, target)
      if (distance < closestDistance) {
        closest = node
        closestDistance = distance
      }
    }
  })

  return closest
}