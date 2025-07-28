// SoundScape.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import SoundScape from './SoundScape'

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
  render: () => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <SoundScape lists={dummyLists} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
}
