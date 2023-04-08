import {GoogleMap, useJsApiLoader} from '@react-google-maps/api'
import {useMemo, useState} from 'react'
import PlaceSearch from '../components/PlaceSearch'
import {Libraries} from '@react-google-maps/api/dist/utils/make-load-script-url'
import BackButton from '../components/BackButton'
import {LatLngCoordinate} from '../models/coordinates'
import {closestNode, loadGraphFromMap} from '../solver/map-solver'
import {runAlgorithm} from '../solver/algorithm'

function MapPage({navigate}: { navigate: (path: string) => void }) {
  const GMAPS_API_KEY = 'AIzaSyBn8--ToWoS1keR1EsJdii5nZX2ZQGPfs4'
  const libraries: Libraries = ['places']

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: GMAPS_API_KEY,
    libraries
  })

  const center = useMemo(() => ({lat: -6.89148, lng: 107.6084704}), [])

  const [source, setSource] = useState<LatLngCoordinate | null>(null)
  const [destination, setDestination] = useState<LatLngCoordinate | null>(null)

  const graph = loadGraphFromMap()

  const handleSearch = () => {
    if (source === null || destination === null) {
      return
    }

    const sourceNode = closestNode(graph, source)
    const destNode = closestNode(graph, destination)

    if (sourceNode === null || destNode === null) {
      return
    }

    const result = runAlgorithm(graph, sourceNode, destNode, true)

    console.log(result)
  }

  return (
    <div className="h-screen w-full max-w-screen-lg mx-auto flex flex-col items-center">
      <div className="my-4">
        <BackButton onClick={() => navigate('home')}/>
      </div>
      <div className="flex flex-col w-full max-w-md">
        {!isLoaded ? <></> : (
          <>
            <PlaceSearch searchLabel="Apa tempat asal anda?" placeholder="Tempat asal" setResult={x => setSource(x)}/>
            <PlaceSearch searchLabel="Apa tempat tujuan anda?" placeholder="Tempat tujuan"
              setResult={x => setDestination(x)}/>
          </>
        )}
        <button className="btn btn-primary" disabled={source === null || destination === null}
          onClick={e => handleSearch()}>Mulai Pencarian
        </button>
      </div>
      {!isLoaded ? <></> : (
        <GoogleMap mapContainerClassName="w-full h-full" center={center} zoom={14}/>
      )}
    </div>
  )
}


export default MapPage