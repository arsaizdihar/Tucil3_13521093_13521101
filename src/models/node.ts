export class Node<T, U> {
  id: number
  data : T
  adjacent: Map<number, {
    weight: U
    isSolution: boolean
  }>
  constructor(id: number, data: T) {
    this.id = id
    this.data = data
    this.adjacent = new Map()
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