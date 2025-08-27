// SoundScape.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SoundScape from './SoundScape'
import sampleList from '../assets/sample.json'
import frequenceList from '../assets/frequencies_sweden.json'

const meta: Meta<typeof SoundScape> = {
  title: '3D/SoundScape',
  component: SoundScape,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SoundScape>

const dummyLists = Array.from({ length: 10 }, (_, t) =>
  Array.from({ length: 50 }, (_, i) => Math.sin(i * 0.2 + t * 0.5) * 2)
)

export const Default: Story = {
  args: {
    lists: dummyLists,
    showWireframe: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <SoundScape {...args} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
}

import { amplifyLists } from './SoundScapePlayer'

export const UsingSampleJSON: Story = {
  args: {
    lists: amplifyLists(sampleList, 0.5),
    showWireframe: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <SoundScape {...args} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
}


export const UsingFrequenciesJSON: Story = {
  args: {
    lists: amplifyLists(frequenceList, 0.5),
    showWireframe: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <SoundScape {...args} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
}
