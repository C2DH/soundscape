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
  { lat: 48.8566, lon: 2.3522, color: 'red', id: 'Paris' }, // Paris
  { lat: 40.7128, lon: -74.006, color: 'blue', id: 'New York' }, // New York
  { lat: -33.8688, lon: 151.2093, color: 'green', id: 'Sydney' }, // Sydney
] as GeoPoint[]

export const Default: Story = {
  args: {
    geoPoints,
    radius: 5,
  },
  render: (args: WorldProps) => {
    return (
      <div style={{ width: 800, height: 800, background: 'grey' }}>
        <Canvas shadows camera={{ position: [5, 5, 5], fov: 100 }}>
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
            fov: 50, // Reduced from 100 to 50 for more natural perspective
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
