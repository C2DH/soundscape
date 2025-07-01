import { Link, Route, Routes } from 'react-router'
import './App.css'
import LocationManager from './hooks/LocationManager'

function App() {
  return (
    <>
      <h1 className='text-3xl font-bold underline'> Hello world! </h1>
      <LocationManager />
      <Link to='/item/djeurj'>Djskdjsk</Link>
      <Link to='/item/bliblib'>sdkskjdksjd</Link>
      <Routes>
        <Route index element={null} />
        <Route path='/item/:itemId' element={null} />
      </Routes>
    </>
  )
}

export default App
