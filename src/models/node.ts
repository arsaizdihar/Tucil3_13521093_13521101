export type BasicNodeData = {
  minEdge: number
}

export type BasicNode = Node<BasicNodeData, number>

export class Node<T, U> {
  id: number
  data: T
  name: string
  adjacent: Map<number, {
    weight: U
  }>

  constructor(id: number, data: T, name?: string) {
    this.id = id
    this.data = data
    this.adjacent = new Map()
    if (name) {
      this.name = name
    } else {
      this.name = id.toString()
    }
  }

  get idString() {
    return this.id.toString()
  }

  addEdge(node: Node<T, U>, weight: U) {
    this.adjacent.set(node.id, {
      weight,
    })
  }

  removeEdge(node: Node<T, U>) {
    this.adjacent.delete(node.id)
  }
}