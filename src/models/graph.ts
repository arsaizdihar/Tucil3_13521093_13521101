import cytoscape from 'cytoscape'
import { Node } from './node'

export class Graph<TData, TWeight> {
  nodes: Map<number, Node<TData, TWeight>>
  directed: boolean
  count: number
    
  constructor(directed = false) {
    this.nodes = new Map()
    this.directed = directed
    this.count = 0
  }

  addNode(data: TData, name?: string) {
    this.count++
    const newNode = new Node<TData, TWeight>(this.count, data, name)
    this.nodes.set(this.count, newNode)
    return newNode
  }

  addEdge(from: Node<TData, TWeight>, to: Node<TData, TWeight>, weight: TWeight, isSolution = false) {
    from.addEdge(to, weight, isSolution)
    if (!this.directed) {
      to.addEdge(from, weight, isSolution)
    }
  }

  markSolution(from: Node<TData, TWeight>, to: Node<TData, TWeight>) {
    const edge = from.adjacent.get(to.id)
    if (!edge) {
      throw new Error('No edge between nodes')
    }
    edge.isSolution = true

    if (!this.directed) {
      const reverseEdge = to.adjacent.get(from.id)
      if (!reverseEdge) {
        edge.isSolution = false
        throw new Error('No edge between nodes')
      }
      reverseEdge.isSolution = true
    }
  }

  getVisualizeData() {
    const elements: cytoscape.ElementDefinition[] = []

    this.nodes.forEach((node) => {
      elements.push({
        data: {
          id: node.idString,
          label: node.name
        }
      })
    })

    this.nodes.forEach((node) => {
      node.adjacent.forEach((value, key) => {
        elements.push({
          data: {
            source: node.idString,
            target: key.toString(),
            weight: value.weight,
            lineColor: value.isSolution ? 'red' : 'black',
            width: value.isSolution ? 3 : 1,
            id: `${node.idString},${key.toString()}`,
          }
        })
      })
    })

    return elements
  }

  static fromString(str: string) {
    const graph = new Graph<undefined, number>(true)

    const lines = str.split('\n')
    
    if (lines.length < 1) {
      throw new Error('Invalid input')
    }
    let lineIdx = 0

    const nodeCount = parseInt(lines[lineIdx++])
    if (isNaN(nodeCount)) {
      throw new Error('Invalid nodes count')
    }
    if (lines.length < nodeCount * 2 + 1) {
      throw new Error('Invalid input')
    }

    const names = lines.slice(lineIdx, lineIdx + nodeCount)

    const nodes: Node<undefined, number>[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(graph.addNode(undefined, names[i]))
    }

    for (let i = 0; i < nodeCount; i++) {
      const line = lines[i + nodeCount + 1].split(/\s+/)
      for (let j = 0; j < nodeCount; j++) {
        if (line[j] === '-') continue
        const weight = parseInt(line[j])
        console.log(weight)
        if (isNaN(weight) || weight <= 0) {
          throw new Error(`Invalid weight at line ${i} column ${j}`)
        }
        if (weight > 0) {
          graph.addEdge(nodes[i], nodes[j], weight)
        }
      }
    }
    

    return graph
  }
}