// SoundLines.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SoundLines from './SoundLines';
import { Vector3 } from 'three';

const mockLines = Array.from({ length: 10 }, (_, t) =>
  Array.from({ length: 50 }, (_, i) => new Vector3(i * 0.1, Math.sin(i * 0.1 + t), 0))
);
const meta: Meta<typeof SoundLines> = {
  title: '3D/SoundLines',
  component: SoundLines,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SoundLines>;

export const Default: Story = {
  args: {
    lines: mockLines,
    lineIdx: 5,
  },
  render: (args) => (
    <div style={{ width: '100%', height: 600, background: 'grey' }}>
      <Canvas camera={{ position: [25, 10, 25], fov: 50 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 5]} />
        <SoundLines {...args} />
        <OrbitControls />
      </Canvas>
    </div>
  ),
};
