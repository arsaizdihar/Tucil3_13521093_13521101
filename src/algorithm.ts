import {
  ICompare,
  PriorityQueue
} from '@datastructures-js/priority-queue'
import { Graph } from './models/graph'
import { Node } from './models/node'

class SearchNode {
  visited: Set<Node<any, number>>
  
  constructor(public node: Node<any, number>, public fx: number, beforeVisited: Set<Node<any, number>>, public hx: number = 0) {
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

export function runAlgorithm(graph: Graph<any, number>, start: Node<any, number>, end: Node<any, number>, isAstar = false) {
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
        const hx = isAstar ? getHeuristic(nextNode.id, end.id) : 0
        queue.enqueue(new SearchNode(nextNode, fx, searchNode.visited, hx))
      }
    })
  }
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

export function getHeuristic(from: number, to: number) {
  return 0
}