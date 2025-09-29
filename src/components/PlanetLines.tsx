import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

import vertexPlanetLines from '../shaders/earth/planetLines/vertex.glsl?raw';
import fragmentPlanetLines from '../shaders/earth/planetLines/fragment.glsl?raw';

interface PlanetLinesProps {
  maskUrl?: string; // black&white texture: white = continents, black = water (you can flip with `invert`)
  radius?: number;
}

const PlanetLines: React.FC<PlanetLinesProps> = ({
  radius = 2,
  maskUrl = '/textures/continents_mask.png',
}) => {
  const mask = useLoader(THREE.TextureLoader, maskUrl);

  return (
    <mesh rotation={[0, 0, 0]}>
      <sphereGeometry args={[radius + 0.02, 64, 64]} />
      <shaderMaterial
        uniforms={{
          mask: { value: mask },
          lineColor: { value: new THREE.Color('#B399FF') },
          lineOpacity: { value: 0.3 },
        }}
        vertexShader={vertexPlanetLines}
        fragmentShader={fragmentPlanetLines}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export default PlanetLines;
