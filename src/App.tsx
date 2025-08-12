import { Link, Route, Routes } from 'react-router'
import './App.css'
import LocationManager from './hooks/LocationManager'
import World from './components/World'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function App() {
  const geoPoints = [
    { lat: 48.8566, lon: 2.3522, color: 'red', id: 'paris' }, // Paris
    { lat: 40.7128, lon: -74.006, color: 'blue', id: 'new-york' }, // New York
    { lat: -33.8688, lon: 151.2093, color: 'green', id: 'sydney' }, // Sydney
    { lat: 51.5074, lon: -0.1278, color: 'purple', id: 'london' }, // London
    { lat: 35.6895, lon: 139.6917, color: 'orange', id: 'tokyo' }, // Tokyo
    { lat: 55.7558, lon: 37.6173, color: 'pink', id: 'moscow' }, // Moscow
    { lat: 34.0522, lon: -118.2437, color: 'yellow', id: 'los-angeles' }, // Los Angeles
    { lat: 39.9042, lon: 116.4074, color: 'cyan', id: 'beijing' }, // Beijing
    { lat: -23.5505, lon: -46.6333, color: 'brown', id: 'sao-paulo' }, // Sao Paulo
    { lat: 1.3521, lon: 103.8198, color: 'grey', id: 'singapore' }, // Singapore
    { lat: 37.7749, lon: -122.4194, color: 'teal', id: 'san-francisco' }, // San Francisco
    { lat: 55.6761, lon: 12.5683, color: 'lime', id: 'copenhagen' }, // Copenhagen
    { lat: 52.52, lon: 13.405, color: 'maroon', id: 'berlin' }, // Berlin
    { lat: 41.9028, lon: 12.4964, color: 'navy', id: 'rome' }, // Rome
    { lat: 37.9838, lon: 23.7275, color: 'olive', id: 'athens' }, // Athens
    { lat: 19.4326, lon: -99.1332, color: 'coral', id: 'mexico-city' }, // Mexico City
    { lat: 59.3293, lon: 18.0686, color: 'gold', id: 'stockholm' }, // Stockholm
  ]
  return (
    <>
      <div className='fixed top-0 left-0 right-0 bg-white p-4 shadow-md z-10'>
        <h1 className='text-3xl font-bold underline'> Hello world! </h1>
        <LocationManager />
        <Link to='/item/djeurj'>Djskdjsk</Link>
        <Link to='/item/bliblib'>sdkskjdksjd</Link>
        <Routes>
          <Route index element={null} />
          <Route path='/item/:itemId' element={null} />
        </Routes>
      </div>
      <div className='h-full w-full bg-gray-200'>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.1, 0]}
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
          <World geoPoints={geoPoints} radius={5} />

          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}

export default App
