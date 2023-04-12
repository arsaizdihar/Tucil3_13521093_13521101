import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api'
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url'
import { useMemo, useState } from 'react'
import BackButton from '../components/BackButton'
import PlaceSearch from '../components/PlaceSearch'
import { LatLngCoordinate } from '../models/coordinates'
import { runAlgorithmRaw } from '../solver/algorithm'
import { closestNode, loadGraphFromMap } from '../solver/map-solver'
import MarkerOptions = google.maps.MarkerOptions

function MapPage({navigate}: { navigate: (path: string) => void }) {
  const GMAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY
  const libraries: Libraries = ['places']

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: GMAPS_API_KEY,
    libraries,
    region: 'ID'
  })

  const center = useMemo(() => ({lat: -6.89148, lng: 107.6084704}), [])

  const [source, setSource] = useState<LatLngCoordinate | null>(null)
  const [destination, setDestination] = useState<LatLngCoordinate | null>(null)
  const [algorithm, setAlgorithm] = useState<'UCS' | 'A*'>('UCS')
  const [paths, setPaths] = useState<LatLngCoordinate[] | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [timeExec, setTimeExec] = useState<number | null>(null)

  const graph = loadGraphFromMap()
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (source === null || destination === null) {
      setPaths(null)
      setDistance(null)
      setTimeExec(null)
      return
    }

    const sourceNode = closestNode(graph, source)
    const destNode = closestNode(graph, destination)

    if (sourceNode === null || destNode === null) {
      setDistance(null)
      setTimeExec(null)
      setPaths(null)
      return
    }
    setIsLoading(true)
    const result = runAlgorithmRaw(graph, sourceNode, destNode, algorithm === 'A*')
    setIsLoading(false)
    if (result.solution === null) {
      setDistance(null)
      setTimeExec(null)
      setPaths(null)
      return
    }

    const coordinatePaths: LatLngCoordinate[] = []
    for (const path of result.solution.visited.values()) {
      if ('lat' in path.data) {
        coordinatePaths.push(path.data)
      }
    }
    setPaths(coordinatePaths)
    setDistance(result.solution.fx)
    setTimeExec(result.time)
  }

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
  }

  const sourceOptions: MarkerOptions = {
    title: 'Tempat awal'
  }

  const destOptions: MarkerOptions = {
    title: 'Tempat tujuan'
  }

  return (
    <div className="h-screen w-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-center px-4 lg:space-x-4">
      <div className="flex flex-col w-full max-w-md p-8">
        <div className="my-4">
          <BackButton onClick={() => navigate('home')}/>
        </div>
        {!isLoaded ? <></> : (
          <div className={'mx-auto w-full'}>
            <div className="form-control">
              <label htmlFor="algorithm" className="label">Algoritma</label>
              <select name="algorithm" className="select select-accent" value={algorithm}
                onChange={e => setAlgorithm(e.target.value === 'UCS' ? 'UCS' : 'A*')}>
                <option value="UCS">UCS</option>
                <option value="A*">A*</option>
              </select>
            </div>
            <PlaceSearch searchLabel="Apa tempat asal anda?" placeholder="Tempat asal"
              setResult={x => {
                setSource(x)
                setPaths(null)
                setDistance(null)
                setTimeExec(null)
              }
              }/>
            <PlaceSearch searchLabel="Apa tempat tujuan anda?" placeholder="Tempat tujuan"
              setResult={x => {
                setDestination(x)
                setPaths(null)
                setDistance(null)
                setTimeExec(null)
              }}/>

            <button className={'btn max-w-xs my-4 btn-accent' + (isLoading ? ' loading' : '')}
              disabled={source === null || destination === null || isLoading}
              onClick={e => handleSearch()}>Mulai Pencarian
            </button>

          </div>
        )}

        
        {distance !== null && timeExec !== null ?  <div className="card w-full bg-base-100 shadow-l">
          <div className="card-body">
            <h3 className="card-title">Waktu Eksekusi</h3>
            <p>{timeExec.toFixed(4)} ms</p>
            <h3 className="card-title">Jarak</h3>
            <p>{distance} meter</p>
          </div>
        </div> : <></>}
      </div>
      {!isLoaded ? <div className="w-full"></div> : (
        <GoogleMap mapContainerClassName="w-full h-full" center={center} zoom={14}>
          {source === null ? <></> : (
            <MarkerF position={source} options={sourceOptions}/>
          )}
          {destination === null ? <></> : (
            <MarkerF position={destination} options={destOptions}/>
          )}
          {
            paths === null ? <></> : (
              <PolylineF path={paths} options={options}/>
            )
          }
        </GoogleMap>
      )}
    </div>
  )
}


export default MapPage