import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import AudioVisualizer, { type AudioVisualizerProps } from '../components/AudioVisualizer'; // Adjust the import path to your project

import { OrbitControls } from '@react-three/drei';

const meta: Meta<typeof AudioVisualizer> = {
  title: 'Components/AudioVisualizer',
  component: AudioVisualizer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AudioVisualizer>;

export default meta;

type Story = StoryObj<typeof AudioVisualizer>;

const generateRandomPoints = (count = 100): THREE.Vector3[] => {
  return Array.from({ length: count }, (_, i) => {
    const x = i;
    const y = Math.sin(i * 0.1 + Math.random()) * 0.5;
    const z = 0;
    return new THREE.Vector3(x, y, z);
  });
};

const generateRandomLines = (lineCount = 10, pointsPerLine = 100): THREE.Vector3[][] => {
  return Array.from({ length: lineCount }, () => generateRandomPoints(pointsPerLine));
};

export const Default: Story = {
  args: {
    soundLinesVectors: generateRandomLines(20, 100),
  },
  render: (args: AudioVisualizerProps) => {
    return (
      <div style={{ width: '100%', height: 600, background: 'grey' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight />
          <directionalLight position={[10, 10, 5]} />

          <AudioVisualizer soundLinesVectors={args.soundLinesVectors} />

          <OrbitControls />
        </Canvas>
      </div>
    );
  },
  name: 'Live Updating Line',
};
