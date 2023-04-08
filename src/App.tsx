import {useState} from 'react'
import MainPage from './pages/MainPage'
import NormalPage from './pages/NormalPage'
import MapPage from './pages/MapPage'

function App() {
  const [page, setPage] = useState('home')

  switch (page) {
  case 'home':
    return <MainPage navigate={setPage}/>
  case 'normal':
    return <NormalPage navigate={setPage}/>
  case 'gmap':
    return <MapPage navigate={setPage}/>
  default:
    return <div>404</div>
  }
}

export default App
