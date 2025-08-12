import type { Meta, StoryObj } from '@storybook/react'
import { Canvas } from '@react-three/fiber'
import Earth from '../components/Earth' // Adjust the import path to your project

import { OrbitControls } from '@react-three/drei'

const meta: Meta<typeof Earth> = {
  title: 'Components/Earth',
  component: Earth,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Earth>


export const Default: Story = {
  render: () => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={['#000']} />
        {/* <ambientLight/>
        <directionalLight position={[15, 10, 5]} /> */}

        <Earth maskUrl={"/textures/continents_mask.jpg"} />

        <OrbitControls />
      </Canvas>
    </div>
  ),
  name: 'Free floating Earth',
}
