import { OrbitControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useThemeStore, useMeshStore, useOrbitStore } from '../store';
import { useEffect, useRef } from 'react';
import { Mesh } from 'three';
import SoundScape from './SoundScape';
import { amplifyLists } from './SoundScapePlayer';
import { isMobile } from 'react-device-detect';

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
  // set orbit once when meshRef changes
  useEffect(() => {
    if (meshRef.current && orbitRef.current) {
      const controls = orbitRef.current;
      setOrbit(
        controls.object.position.toArray() as [number, number, number],
        controls.target.toArray() as [number, number, number]
      );
    }
  }, [meshRef.current]);

  return (
    <Canvas
      shadows
      camera={{ position: cameraPos, fov: 20, far: 1000, near: 0.1 }}
      touch-action="none"
    >
      <OrbitControls
        ref={orbitRef}
        minDistance={40}
        maxDistance={isMobile ? 1200 : 600}
        target={target}
        minPolarAngle={0} // 0 = looking straight down from above
        maxPolarAngle={Math.PI / 2}
      />
      <group>
        <SoundScape {...args} ref={meshRef} />
        <Grid
          args={[164, 164]}
          cellSize={5}
          cellColor={color}
          sectionSize={82}
          sectionColor={color}
          fadeDistance={600}
          fadeStrength={1}
        />
      </group>
    </Canvas>
  );
};

export default Scene;
