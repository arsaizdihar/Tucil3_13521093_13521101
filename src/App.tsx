import cytoscape from 'cytoscape'
import { useRef, useState } from 'react'
import { runAlgorithm } from './algorithm'
import { Graph } from './models/graph'

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [graph, setGraph] = useState<Graph<any, number> | null>()
  const [start, setStart] = useState<number | undefined>(undefined)
  const [end, setEnd] = useState<number | undefined>(undefined)
  const [cy, setCy] = useState<cytoscape.Core | null>(null)

  function visualizeGraph(graph:Graph<any, number>) {
    if (!graph || !containerRef.current) return
    const elements = graph.getVisualizeData()

    const cy = cytoscape({
      container: containerRef.current!,
      elements,
      wheelSensitivity: 0.1,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
          }
        },
        {
          selector: 'edge',
          style: {
            label: 'data(weight)',
            'curve-style': 'bezier',
            width: 1,
            'line-color': 'black',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': 'black',
            'source-text-margin-y': 10,
            'text-valign': 'top',
            'text-margin-y': -10
          }
        },
        {
          selector: '.solution',
          style: {
            'line-color': 'red',
            'target-arrow-color': 'red',
            width: 3,
          }
        }
      ]
    })
    setCy(cy)
  }
  
  function updateSolution(solutionEdges: `${number},${number}`[]) {
    if (!cy) return

    cy.edges().forEach(edge => {
      if (solutionEdges.includes(edge.id() as any)) {
        edge.addClass('solution')
      } else {
        edge.removeClass('solution')
      }
    })
  }


  return (
    <div className='h-screen w-full flex flex-col'>
      <div className="">

        <input ref={inputRef} type="file" accept='.txt, text/plain' onChange={e => {
          const file = e.target.files?.item(0)
          if (file) {
            const reader = new FileReader()
            reader.onload = () => {
              if (!reader.result) return
              let graph: Graph<undefined, number>
              if (typeof reader.result === 'string') {
                graph = Graph.fromString(reader.result)
              } else {
                const arrayBuffer = reader.result as ArrayBuffer
                const uint8Array = new Uint8Array(arrayBuffer)
                const textDecoder = new TextDecoder()
                const text = textDecoder.decode(uint8Array)
                graph = Graph.fromString(text)
              }
              setGraph(graph)
              setStart(1)
              setEnd(graph.nodes.size)
              visualizeGraph(graph)
            }
            reader.readAsText(file)
          }
        }}/>
        <select name="algorithm" >
          <option value="UCS">UCS</option>
          <option value="A*">A*</option>
        </select>
      
        {graph && cy && <>
          <label htmlFor='start' >Start</label>
          <select name="start" value={start} onChange={e => setStart(+e.target.value)}>
            {[...graph.nodes.keys()].map(nodeId => <option value={nodeId} key={nodeId}>{graph.nodes.get(nodeId)?.name}</option>)}
          </select>
          <label htmlFor='end'>End</label>
          <select name="end" value={end} onChange={e => setEnd(+e.target.value)}>
            {[...graph.nodes.keys()].map(nodeId => <option value={nodeId} key={nodeId}>{graph.nodes.get(nodeId)?.name}</option>)}
          </select>
          { start && end &&
          <button onClick={() => {
            const solutionEdges = runAlgorithm(graph, graph.nodes.get(start)!, graph.nodes.get(end)!)
            if (!solutionEdges) {
              return alert('No solution found')
            }
            updateSolution(solutionEdges)
          }} >Run</button>
          }
        </> 
        }
      </div>
      <div className="flex-1" ref={containerRef}></div>

    </div>
  )
}

export default App
