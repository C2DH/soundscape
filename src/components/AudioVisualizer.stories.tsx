import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import AudioVisualizer, { type AudioVisualizerProps } from '../components/AudioVisualizer';
import { OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import { useAudioStore } from '../store';

const meta: Meta<typeof AudioVisualizer> = {
  title: 'Components/AudioVisualizer',
  component: AudioVisualizer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: 600, background: 'grey' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight />
          <directionalLight position={[10, 10, 5]} />
          <Story />
          <OrbitControls />
        </Canvas>
      </div>
    ),
  ],
} satisfies Meta<typeof AudioVisualizer>;

export default meta;
type Story = StoryObj<typeof AudioVisualizer>;

const generateRandomLines = (lineCount = 10, pointsPerLine = 100): THREE.Vector3[][] => {
  return Array.from({ length: lineCount }, (_, i) =>
    Array.from({ length: pointsPerLine }, (_, j) => {
      const x = j;
      const y = Math.sin(j * 0.1 + i * 0.5) * 2;
      const z = i;
      return new THREE.Vector3(x, y, z);
    })
  );
};

const AudioStoreWrapper = ({ soundLinesVectors }: AudioVisualizerProps) => {
  const { setDuration, setCurrentTime } = useAudioStore();
  useEffect(() => {
    setDuration(100); // Set a fixed duration for testing
    setCurrentTime(0);
  }, [setDuration, setCurrentTime]);

  useEffect(() => {
    // Simulate audio store updates
    let currentTime = 0;
    const duration = 100; // seconds
    const interval = setInterval(() => {
      setCurrentTime(currentTime);
      currentTime += 0.5;
      if (currentTime > duration) currentTime = 0;
      // Update your audio store here
      // e.g., audioStore.setCurrentTime(currentTime);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  return <AudioVisualizer soundLinesVectors={soundLinesVectors} />;
};

export const Default: Story = {
  args: {
    soundLinesVectors: generateRandomLines(20, 100),
  },
  name: 'Live Updating Line',
};

export const WithAudioStore: Story = {
  args: {
    soundLinesVectors: generateRandomLines(50, 200),
  },
  render: (args) => <AudioStoreWrapper soundLinesVectors={args.soundLinesVectors} />,

  name: 'With Audio Store',
};
