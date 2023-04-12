import { ICompare, PriorityQueue } from '@datastructures-js/priority-queue'
import {
  LatLngCoordinate,
  calculateHaversineDistance
} from '../models/coordinates'
import { BasicGraph, Graph } from '../models/graph'
import { BasicNode, Node } from '../models/node'

type NodeC = Node<LatLngCoordinate, number> | BasicNode
type GraphC = Graph<LatLngCoordinate, number> | BasicGraph

function getHeuristic<T extends NodeC | BasicNode>(from: T, to: T): number {
  if ('minEdge' in from.data && 'minEdge' in to.data) {
    // if the nodes are the same, heuristic value is 0
    if (from.id == to.id) return 0

    // else, heuristic value is the minimum edge weight of the node
    return from.data.minEdge
  }
  else if ('lat' in from.data && 'lat' in to.data) {
    return calculateHaversineDistance(from.data, to.data)
  }

  return 0
}

export class SearchNode {
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
  const startTime = performance.now()
  const queue = new PriorityQueue(compareNodes)

  queue.enqueue(new SearchNode(start, 0, new Set()))

  let bestSolution: SearchNode | null = null

  while (!queue.isEmpty()) {
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
  
  return {solution: bestSolution, time: performance.now() - startTime}
}

export function runAlgorithm(graph: GraphC, start: NodeC, end: NodeC, isAstar = false) {
  const bestSolution = runAlgorithmRaw(graph, start, end, isAstar)

  if (!bestSolution.solution) {
    return null
  }
  return {...bestSolution, edges: getEdgesFromResult(bestSolution.solution)}
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