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
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas >
        {/* <color attach="background" args={['#000']} /> */}
        {/* <ambientLight/>
        <directionalLight position={[15, 10, 5]} /> */}

        <Earth maskUrl={"/textures/continents_mask.jpg"} />

        <OrbitControls />
      </Canvas>
      <div className="absolute top-0 left-0 z-[-1] w-screen h-screen bg-[radial-gradient(circle_at_center,_#302A38,_#261D29,_#020103)]"></div>
    </div>
  ),
  name: 'Free floating Earth',
}
