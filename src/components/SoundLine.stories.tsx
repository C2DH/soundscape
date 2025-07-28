import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'
import SoundLine from '../components/SoundLine' // Adjust the import path to your project

import { OrbitControls } from '@react-three/drei'

const meta: Meta<typeof SoundLine> = {
  title: 'Components/SoundLine',
  component: SoundLine,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SoundLine>

const generateRandomPoints = (count = 100): THREE.Vector3[] => {
  return Array.from({ length: count }, (_, i) => {
    const x = i * 0.05
    const y = Math.sin(i * 0.1 + Math.random()) * 0.5
    const z = 0
    return new THREE.Vector3(x, y, z)
  })
}

const LiveWaveformStory = () => {
  const [points, setPoints] = useState<THREE.Vector3[]>(() =>
    generateRandomPoints()
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(generateRandomPoints())
    }, 1000) // ~10 FPS

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />

        <SoundLine points={points} color='cyan' lineWidth={0.02} />

        <OrbitControls />
      </Canvas>
    </div>
  )
}

export const Default: Story = {
  render: () => <LiveWaveformStory />,
  name: 'Live Updating Line',
}
