import type { Meta, StoryObj } from '@storybook/react'
import World from '../components/World' // Adjust the import path to your project
import type { WorldProps } from '../components/World'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useWorldStore } from '../store'
import { useEffect, useRef } from 'react'
import type { GeoPoint } from '../types'

const meta: Meta<typeof World> = {
  title: 'Components/World',
  component: World,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof World>

const geoPoints = [
{ id: 'Sweden', lat: 60.128161, lon: 18.643501 },
{ id: 'Norway', lat: 60.472024, lon: 8.468946 },
{ id: 'Finland', lat: 61.92411, lon: 25.748151 },
{ id: 'Denmark', lat: 56.26392, lon: 9.501785 },
{ id: 'Iceland', lat: 64.963051, lon: -19.020835 },
{ id: 'Greenland', lat: 71.706936, lon: -42.604303 },
{ id: 'Faroe Islands', lat: 61.892635, lon: -6.911806 },
{ id: 'Estonia', lat: 58.595272, lon: 25.013607 },
{ id: 'Latvia', lat: 56.879635, lon: 24.603189 },
{ id: 'Lithuania', lat: 55.169438, lon: 23.881275 },
{ id: 'Russia', lat: 61.52401, lon: 105.318756 },
{ id: 'Belarus', lat: 53.709807, lon: 27.953389 },
{ id: 'Poland', lat: 51.919438, lon: 19.145136 },

  
] as GeoPoint[]

export const Default: Story = {
  args: {
    geoPoints,
    radius: 5,
  },
  render: (args: WorldProps) => {
    return (
      <div style={{ width: '100vw', height: '100vh', background: 'grey' }}>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 100 }}>
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[5, 10, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.1, 0]}
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.3} />
          </mesh> */}
          <World geoPoints={args.geoPoints} radius={args.radius} />

          <OrbitControls enableZoom enablePan />
        </Canvas>
      </div>
    )
  },
  name: 'Stable',
}

export const WithInterval: Story = {
  args: {
    geoPoints,
    radius: 5,
  },
  render: (args: WorldProps) => {
    const setGeoPoints = useWorldStore((state) => state.setGeoPoints)
    const setHighlightedPoint = useWorldStore(
      (state) => state.setHighlightedPoint
    )
    const idxRef = useRef(0)
    useEffect(() => {
      setGeoPoints(args.geoPoints || [])
      const interval = setInterval(() => {
        if (Array.isArray(args.geoPoints) && args.geoPoints.length > 0) {
          idxRef.current = (idxRef.current + 1) % args.geoPoints.length
          setHighlightedPoint(args.geoPoints[idxRef.current])
        }
      }, 2500) // ~10 FPS

      return () => clearInterval(interval)
    }, [args.geoPoints])
    return (
      <div style={{ width: 800, height: 800, background: 'grey' }}>
        <Canvas
          shadows
          camera={{
            position: [5, 5, 5],
            fov: 150, // Reduced from 100 to 50 for more natural perspective
            near: 0.1, // Added near plane
            far: 1000, // Added far plane
          }}
        >
          <color attach='background' args={['purple']} />
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
          <World geoPoints={args.geoPoints} radius={args.radius} />

          <OrbitControls enableZoom enablePan />
        </Canvas>
      </div>
    )
  },
  name: 'With demo rotation',
}
