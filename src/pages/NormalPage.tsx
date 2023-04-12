import cytoscape from 'cytoscape'
import { useRef, useState } from 'react'
import BackButton from '../components/BackButton'
import { BasicGraph, Graph } from '../models/graph'
import { SearchNode, runAlgorithm } from '../solver/algorithm'

function NormalPage({ navigate }: { navigate: (path: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [graph, setGraph] = useState<BasicGraph | null>()
  const [start, setStart] = useState<number | undefined>(undefined)
  const [end, setEnd] = useState<number | undefined>(undefined)
  const [cy, setCy] = useState<cytoscape.Core | null>(null)
  const [isAStar, setIsAStar] = useState(false)
  const [distance, setDistance] = useState<number | null>(null)
  const [timeExec, setTimeExec] = useState<number | null>(null)

  function visualizeGraph(graph: BasicGraph) {
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
            backgroundColor: '#d1d5db',
            color: '#d1d5db',
          },
        },
        {
          selector: 'edge',
          style: {
            label: 'data(weight)',
            color: 'white',
            'curve-style': 'data(curve)' as any,
            width: 1,
            'line-color': 'white',
            'target-arrow-shape': 'data(arrow)' as any,
            'target-arrow-color': 'white',
            'source-text-margin-y': 10,
            'text-valign': 'top',
            'text-margin-y': -10,
          },
        },
        {
          selector: '.solution',
          style: {
            'line-color': 'red',
            'target-arrow-color': 'red',
            width: 3,
          },
        },
      ],
    })
    setCy(cy)
  }

  function updateSolution(solution: SearchNode | null, solutionEdges: `${number},${number}`[], timeExecution: number) {
    if (!cy) return

    cy.edges().forEach((edge) => {
      
      if (solutionEdges.includes(edge.id() as any) || (edge.data('arrow') === 'none' && solutionEdges.includes(edge.id().split(',').reverse().join(',') as any))) {
        edge.addClass('solution')
      } else {
        edge.removeClass('solution')
      }
    })


    if (solution) {
      setDistance(solution.fx)
    } else {
      setDistance(0)
    }
    setTimeExec(timeExecution)
  }

  return (
    <div className="h-screen w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center px-4 lg:space-x-4">
      <div className="flex flex-col w-full max-w-md">
        <div className="my-4">
          <BackButton onClick={() => navigate('home')}/>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".txt, text/plain"
          className="file-input file-input-accent"
          onChange={(e) => {
            const file = e.target.files?.item(0)
            if (file) {
              const reader = new FileReader()
              reader.onload = () => {
                if (!reader.result) return
                let graph: BasicGraph
                try {

                  if (typeof reader.result === 'string') {
                    graph = Graph.fromString(reader.result)
                  } else {
                    const arrayBuffer = reader.result as ArrayBuffer
                    const uint8Array = new Uint8Array(arrayBuffer)
                    const textDecoder = new TextDecoder()
                    const text = textDecoder.decode(uint8Array)
                    graph = Graph.fromString(text)
                  }
                } catch (e: any) {
                  alert(e.message)
                  return
                }
                setDistance(null)
                setTimeExec(null)
                setGraph(graph)
                setStart(1)
                setEnd(graph.nodes.size)
                visualizeGraph(graph)
              }
              reader.readAsText(file)
            }
          }}
        />
        <div className="form-control">
          <label htmlFor="algorithm" className="label">
            Algorithm
          </label>
          <select name="algorithm" className="select select-accent select-sm" onChange={e => setIsAStar(e.target.value === 'A*')}>
            <option value="UCS">UCS</option>
            <option value="A*">A*</option>
          </select>
        </div>

        {graph && cy && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="form-control">
                <label htmlFor="start" className="label">
                  Start
                </label>
                <select
                  name="start"
                  value={start}
                  onChange={(e) => {
                    setStart(+e.target.value)
                    setDistance(null)
                    setTimeExec(null)
                  }}
                  className="select select-accent select-sm"
                >
                  {[...graph.nodes.keys()].map((nodeId) => (
                    <option value={nodeId} key={nodeId}>
                      {graph.nodes.get(nodeId)?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label htmlFor="end" className="label">
                  End
                </label>
                <select
                  name="end"
                  value={end}
                  onChange={(e) => {
                    setEnd(+e.target.value)
                    setDistance(null)
                    setTimeExec(null)
                  }}
                  className="select select-accent select-sm"
                >
                  {[...graph.nodes.keys()].map((nodeId) => (
                    <option value={nodeId} key={nodeId}>
                      {graph.nodes.get(nodeId)?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {start && end && (
              <button
                className="btn btn-accent btn-sm mt-4"
                onClick={() => {
                  const solution = runAlgorithm(
                    graph,
                    graph.nodes.get(start)!,
                    graph.nodes.get(end)!,
                    isAStar
                  )
                  if (!solution) {
                    return alert('No solution found')
                  }
                  updateSolution(solution.solution, solution.edges, solution.time)
                }}
              >
                Run
              </button>
            )}
          </>
        )}

        {distance !== null && timeExec !== null ?  <div className="card w-full bg-base-100 shadow-l">
          <div className="card-body">
            <h3 className="card-title">Waktu Eksekusi</h3>
            <p>{timeExec.toFixed(4)} ms</p>
            <h3 className="card-title">Jarak</h3>
            <p>{distance} satuan jarak</p>
          </div>
        </div> : <></>}
      </div>
      <div
        className="w-full aspect-video border border-gray-200 rounded mt-4 mb-5 bg-gray-800"
        ref={containerRef}
      ></div>
    </div>
  )
}

export default NormalPage
