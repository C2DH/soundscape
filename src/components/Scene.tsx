import { OrbitControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useThemeStore, useMeshStore, useOrbitStore } from '../store';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';
import SoundScape from './SoundScape';
import { amplifyLists } from './SoundScapePlayer';

interface SceneProps {
  landscapeData: any;
}

const Scene: React.FC<SceneProps> = ({ landscapeData }) => {
  const args = { lists: amplifyLists(landscapeData, 0.65) };
  const color = useThemeStore((s) => s.colors['--light']);

  const setMesh = useMeshStore((s) => s.setMesh);
  const meshRef = useRef<Mesh>(null);
  const setOrbit = useOrbitStore((s) => s.setOrbit);
  const cameraPos = useOrbitStore((s) => s.cameraPos);
  const target = useOrbitStore((s) => s.target);

  const orbitRef = useRef<any>(null);

  useEffect(() => {
    if (meshRef.current) {
      setMesh(meshRef.current);
    }
  }, [meshRef.current]);

  return (
    <Canvas shadows camera={{ position: cameraPos, fov: 50 }} touch-action="none">
      <OrbitControls
        ref={orbitRef}
        minDistance={40}
        maxDistance={400}
        target={target}
        onChange={(e) => {
          if (!e || !e.target) return;
          const controls = e.target;
          setOrbit(
            controls.object.position.toArray() as [number, number, number],
            controls.target.toArray() as [number, number, number]
          );
        }}
      />
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
  );
};

export default Scene;
