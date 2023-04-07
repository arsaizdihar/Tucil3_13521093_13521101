export class Node<T, U> {
  id: number
  data : T
  name: string
  adjacent: Map<number, {
    weight: U
    isSolution: boolean
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

  addEdge(node: Node<T, U>, weight: U, isSolution = false) {
    this.adjacent.set(node.id, {
      weight,
      isSolution
    })
  }

  removeEdge(node: Node<T, U>) {
    this.adjacent.delete(node.id)
  }

  get idString() {
    return this.id.toString()
  }
}