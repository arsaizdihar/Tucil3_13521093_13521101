import usePlacesAutocomplete, {getGeocode, getLatLng, Suggestion} from 'use-places-autocomplete'
import {LatLngCoordinate} from '../models/coordinates'

interface SearchProps {
  searchLabel: string
  placeholder: string
  setResult: (result: LatLngCoordinate) => void
}

const PlaceSearch = (props: SearchProps) => {
  const {
    ready,
    value,
    suggestions: {status, data},
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  })

  const handleSelect =
    ({description}: Suggestion) =>
      () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(description, false)
        clearSuggestions()

        // Get latitude and longitude via utility functions
        getGeocode({address: description}).then((results) => {
          const {lat, lng} = getLatLng(results[0])
          props.setResult({lat, lng})
          console.log({lat, lng})
        })
      }

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: {main_text, secondary_text},
      } = suggestion

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      )
    })

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{props.searchLabel}</span>
      </label>
      <input
        placeholder={props.placeholder}
        className="input input-bordered w-full max-w-xs"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!ready}
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  )
}

export default PlaceSearch