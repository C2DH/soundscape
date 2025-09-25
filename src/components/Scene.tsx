import SoundScape from './SoundScape';
import { amplifyLists } from './SoundScapePlayer';
import { OrbitControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useThemeStore, useMeshStore } from '../store';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';

interface SceneProps {
  landscapeData: any;
}

const Scene: React.FC<SceneProps> = ({ landscapeData }) => {
  // ⬇️ This is basically your Storybook args
  const args = {
    lists: amplifyLists(landscapeData, 0.65),
  };
  const color = useThemeStore((s) => s.colors['--light']);

  const { setMesh } = useMeshStore();
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      setMesh(meshRef.current);
    }
  }, [meshRef.current, setMesh]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <>
      <Canvas shadows camera={{ position: [100, 100, 50], fov: 50 }} touch-action="none">
        <OrbitControls />
        <group>
          <SoundScape {...args} ref={meshRef} />
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
    </>
  );
};

export default Scene;
