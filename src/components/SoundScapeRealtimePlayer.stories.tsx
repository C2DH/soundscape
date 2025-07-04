import type { Meta, StoryObj } from '@storybook/react'
import SoundScapeRealtimePlayer, {
  type Props,
} from './SoundScapeRealtimePlayer'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const meta: Meta<typeof SoundScapeRealtimePlayer> = {
  title: 'SoundScapeRealtimePlayer',
  component: SoundScapeRealtimePlayer,
}

export default meta

type Story = StoryObj<typeof SoundScapeRealtimePlayer>

export const Default: Story = {
  render: (args: Props) => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />

        <SoundScapeRealtimePlayer {...args} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
  args: {
    url: '/audio/Italy.mp3',
  },
}
