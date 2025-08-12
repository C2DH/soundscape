import { Link, Route, Routes } from 'react-router'
import './App.css'
import LocationManager from './hooks/LocationManager'
import World from './components/World'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

function App() {
  const geoPoints = [
    { lat: 48.8566, lon: 2.3522, color: 'red' }, // Paris
    { lat: 40.7128, lon: -74.006, color: 'blue' }, // New York
    { lat: -33.8688, lon: 151.2093, color: 'green' }, // Sydney
  ]
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
