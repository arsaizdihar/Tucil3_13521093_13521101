import cytoscape from 'cytoscape'
import { BasicNode, BasicNodeData, Node } from './node'

export type BasicGraph = Graph<BasicNodeData, number>

export class Graph<TData, TWeight> {
  nodes: Map<number, Node<TData, TWeight>>
  directed: boolean
  count: number

  constructor(directed = false) {
    this.nodes = new Map()
    this.directed = directed
    this.count = 0
  }

  static fromString(str: string) {
    const graph = new Graph<BasicNodeData, number>(true)

    const lines = str.split(/\r?\n/)

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

    const nodes: BasicNode[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(graph.addNode({
        minEdge: Infinity,
      }, names[i]))
    }

    for (let i = 0; i < nodeCount; i++) {
      const line = lines[i + nodeCount + 1].split(/\s+/)
      for (let j = 0; j < nodeCount; j++) {
        const weight = parseInt(line[j])
        if (isNaN(weight) || weight < 0) {
          throw new Error(`Invalid weight at line ${i} column ${j}`)
        }
        if (weight > 0) {
          graph.addEdge(nodes[i], nodes[j], weight)
        }
      }
    }
    // calculate minimum edge weight of each node as node data for heuristik purpose
    nodes.forEach((node) => {
      let min = Infinity
      node.adjacent.forEach((value) => {
        if (value.weight < min) {
          min = value.weight
        }
      })
      node.data.minEdge = min
    })
    return graph
  }

  addNodeWithId(id: number, data: TData, name?: string) {
    this.count++
    const newNode = new Node<TData, TWeight>(id, data, name)
    this.nodes.set(id, newNode)
    return newNode
  }

  addNode(data: TData, name?: string) {
    return this.addNodeWithId(this.count+1, data, name)
  }

  addEdge(from: Node<TData, TWeight>, to: Node<TData, TWeight>, weight: TWeight, ) {
    from.addEdge(to, weight)
    if (!this.directed) {
      to.addEdge(from, weight)
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
        const neighbor = this.nodes.get(key)!
        const undirected = neighbor.adjacent.get(node.id)?.weight === value.weight
        elements.push({
          data: {
            source: node.idString,
            target: key.toString(),
            weight: value.weight,
            id: `${node.idString},${key.toString()}`,
            curve: undirected ? 'straight' : 'bezier',
            arrow: undirected ? 'none' : 'triangle',
          }
        })
      })
    })

    return elements
  }
}