import {ICompare, PriorityQueue} from '@datastructures-js/priority-queue'
import {Graph} from '../models/graph'
import {Node} from '../models/node'
import {
  calculateEuclideanDIstance,
  calculateHaversineDistance,
  CartesianCoordinate,
  LatLngCoordinate
} from '../models/coordinates'

type NodeC = Node<LatLngCoordinate | CartesianCoordinate, number>
type GraphC = Graph<LatLngCoordinate | CartesianCoordinate, number>

function getHeuristic(from: NodeC, to: NodeC): number {
  if ('lat' in from.data && 'lat' in to.data) {
    return calculateHaversineDistance(from.data, to.data)
  } else if ('x' in from.data && 'x' in to.data) {
    return calculateEuclideanDIstance(from.data, to.data)
  }

  return 0
}

class SearchNode {
  visited: Set<NodeC>

  constructor(public node: NodeC, public fx: number, beforeVisited: Set<NodeC>, public hx: number = 0) {
    this.visited = new Set(beforeVisited)
    this.visited.add(node)
  }

  get value() {
    return this.fx + this.hx
  }
}


const compareNodes: ICompare<SearchNode> = (a, b) => {
  return a.value - b.value
}

export function runAlgorithmRaw(graph: GraphC, start: NodeC, end: NodeC, isAstar = false) {
  const queue = new PriorityQueue(compareNodes)

  queue.enqueue(new SearchNode(start, 0, new Set()))

  let bestSolution: SearchNode | null = null

  let i = 0

  while (!queue.isEmpty()) {
    i++
    const searchNode = queue.dequeue()
    if (bestSolution && searchNode.value > bestSolution.value) {
      // No need to continue, we already have a better solution
      break
    }

    const node = searchNode.node

    if (node.id === end.id) {
      if (!bestSolution || searchNode.value < bestSolution.value) {
        bestSolution = searchNode
      }
      continue
    }

    node.adjacent.forEach((value, key) => {
      const nextNode = graph.nodes.get(key)
      if (nextNode && !searchNode.visited.has(nextNode)) {
        const fx = searchNode.fx + value.weight
        const hx = isAstar ? getHeuristic(nextNode, end) : 0
        queue.enqueue(new SearchNode(nextNode, fx, searchNode.visited, hx))
      }
    })
  }
  
  return bestSolution
}

export function runAlgorithm(graph: GraphC, start: NodeC, end: NodeC, isAstar = false) {
  const bestSolution = runAlgorithmRaw(graph, start, end, isAstar)

  if (!bestSolution) {
    return null
  }
  return getEdgesFromResult(bestSolution)
}

function getEdgesFromResult(searchNode: SearchNode) {
  const visited = searchNode.visited

  const edges: `${number},${number}`[] = []
  let prev: Node<any, number> | null = null

  visited.forEach((node) => {
    if (prev) {
      edges.push(`${prev.id},${node.id}`)
    }
    prev = node
  })

  return edges
}