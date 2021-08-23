import { useState, useEffect } from 'react'
import { Grid, CssBaseline } from '@material-ui/core'

import { getWeatherData, getPlacesData } from './api'
import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'

function App() {
  const [type, setType] = useState('restaurants')
  const [rating, setRating] = useState('')

  const [places, setPlaces] = useState([])
  const [weatherData, setWeatherData] = useState([])
  const [filteredPlaces, setfilteredPlaces] = useState([])

  const [autocomplete, setAutocomplete] = useState(null)
  const [childClicked, setChildClicked] = useState(null)
  const [coordinates, setCoordinates] = useState({})
  const [bounds, setBounds] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude })
    })
  }, [])

  useEffect(() => {
    const filtered = places.filter((place) => place.rating > rating)

    setfilteredPlaces(filtered)
  }, [rating]) // eslint-disable-line

  useEffect(() => {
    if (bounds.ne && bounds.sw) {
      setIsLoading(true)

      getWeatherData(coordinates.lat, coordinates.lng).then((data) => setWeatherData(data))

      getPlacesData(type, bounds?.ne, bounds?.sw).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
        setfilteredPlaces([])
        setIsLoading(false)
      })
    }
  }, [bounds, type]) // eslint-disable-line

  const onLoad = (autoC) => setAutocomplete(autoC)

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat()
    const lng = autocomplete.getPlace().geometry.location.lng()
    setCoordinates({ lat, lng })
  }

  return (
    <>
      <CssBaseline />
      <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            childClicked={childClicked}
            isLoading={isLoading}
            places={filteredPlaces.length ? filteredPlaces : places}
            rating={rating}
            setRating={setRating}
            setType={setType}
            type={type}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setBounds={setBounds}
            setChildClicked={setChildClicked}
            setCoordinates={setCoordinates}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default App
