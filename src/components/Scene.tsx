import SoundScape from './SoundScape';
import { amplifyLists } from './SoundScapePlayer';
import { OrbitControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useThemeStore } from '../store';

interface SceneProps {
  landscapeData: any;
}

const Scene: React.FC<SceneProps> = ({ landscapeData }) => {
  // ⬇️ This is basically your Storybook args
  const args = {
    lists: amplifyLists(landscapeData, 0.6),
  };

  const color = useThemeStore((s) => s.colors['--light']);

  return (
    <Canvas shadows camera={{ position: [100, 100, 50], fov: 50 }} touch-action="none">
      <OrbitControls />
      <group>
        <SoundScape {...args} />
        <Grid
          args={[160, 160]}
          cellSize={5}
          cellColor={color}
          sectionSize={80}
          sectionColor={color}
          fadeDistance={200}
          fadeStrength={2}
        />
      </group>
    </Canvas>
  );
};

export default Scene;
