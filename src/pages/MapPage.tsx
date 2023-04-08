import {GoogleMap, MarkerF, PolylineF, useJsApiLoader} from '@react-google-maps/api'
import {useMemo, useState} from 'react'
import PlaceSearch from '../components/PlaceSearch'
import {Libraries} from '@react-google-maps/api/dist/utils/make-load-script-url'
import BackButton from '../components/BackButton'
import {LatLngCoordinate} from '../models/coordinates'
import {closestNode, loadGraphFromMap} from '../solver/map-solver'
import {runAlgorithmRaw} from '../solver/algorithm'
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

  const graph = loadGraphFromMap()

  const handleSearch = () => {
    if (source === null || destination === null) {
      setPaths(null)
      return
    }

    const sourceNode = closestNode(graph, source)
    const destNode = closestNode(graph, destination)

    if (sourceNode === null || destNode === null) {
      setPaths(null)
      return
    }

    const result = runAlgorithmRaw(graph, sourceNode, destNode, algorithm === 'A*')

    if (result === null) {
      setPaths(null)
      return
    }

    const coordinatePaths: LatLngCoordinate[] = []
    for (const path of result.visited.values()) {
      if ('lat' in path.data) {
        coordinatePaths.push(path.data)
      }
    }
    setPaths(coordinatePaths)
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
    <div className="h-screen w-full max-w-screen-2xl mx-auto flex flex-row items-center">
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
              }
              }/>
            <PlaceSearch searchLabel="Apa tempat tujuan anda?" placeholder="Tempat tujuan"
              setResult={x => {
                setDestination(x)
                setPaths(null)
              }}/>

            <button className="btn max-w-xs my-4 btn-accent"
              disabled={source === null || destination === null}
              onClick={e => handleSearch()}>Mulai Pencarian
            </button>

          </div>
        )}
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