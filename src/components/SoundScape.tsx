import { useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SoundLine from './SoundLine';
import { create } from 'zustand';
import { useThemeStore } from '../store';

type SoundScapeProps = {
  lists: number[][];
  showWireframe?: boolean;
};

const localSoundScapeStore = create<{
  t: number;
  highlightedVectors: THREE.Vector3[];
  setT: (t: number) => void;
  setHighlightedVectors: (highlightedVectors: THREE.Vector3[]) => void;
}>((set) => ({
  t: 0,
  highlightedVectors: [],
  setT: (t: number) => set(() => ({ t })),
  setHighlightedVectors: (highlightedVectors: THREE.Vector3[]) =>
    set(() => ({ highlightedVectors })),
}));

const SoundScapeSoundlineWrapper: React.FC = () => {
  const points = localSoundScapeStore((state) => state.highlightedVectors);
  if (points.length === 0) {
    return null; // No points to render
  }
  return <SoundLine points={points} />;
};

const SoundScape: React.FC<SoundScapeProps> = ({ lists }) => {
  const setHighlightedVectors = localSoundScapeStore((state) => state.setHighlightedVectors);
  const meshRef = useRef<THREE.Mesh>(null);
  const intersectionRef = useRef<THREE.Vector3 | null>(null);
  const previousIntersectionListIndexRef = useRef<number>(0);
  const markerRef = useRef<THREE.Mesh>(null);
  const color = useThemeStore((s) => s.colors['--dark']);

  const raycaster = useRef(new THREE.Raycaster()).current;
  const mouse = useRef(new THREE.Vector2()).current;

  const { camera, gl } = useThree();

  const handlePointerMove = (event: React.PointerEvent) => {
    mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
  };

  const getClosestVectors = (point: THREE.Vector3) => {
    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;

    // Adjust for centered coordinates
    const adjustedZ = -point.z + timeLength / 2;
    const listIndex = Math.max(0, Math.floor(adjustedZ));

    if (previousIntersectionListIndexRef.current === listIndex) {
      return; // No change in list index, skip processing
    }

    // Create vectors with centered coordinates
    const centeredVectors = lists[listIndex].map(
      (y, x) => new THREE.Vector3(x - listLength / 2, y, listIndex - timeLength / 2)
    );

    setHighlightedVectors(centeredVectors);
    previousIntersectionListIndexRef.current = listIndex;
  };

  useFrame(() => {
    if (!meshRef.current) return;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(meshRef.current, true);
    if (intersects.length > 0) {
      const point = intersects[0].point;
      intersectionRef.current = point;
      getClosestVectors(point);
      if (markerRef.current) {
        markerRef.current.position.copy(point);
        markerRef.current.visible = true;
      }
    } else {
      if (markerRef.current) {
        markerRef.current.visible = false;
      }
    }
  });

  const geometry = useMemo(() => {
    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;

    const vertices: number[] = [];
    const indices: number[] = [];
    const vectors = [] as THREE.Vector3[][];

    // Calculate center offsets
    const xCenter = listLength / 2;
    const zCenter = timeLength / 2;

    // Generate vertex positions (centered around origin)
    for (let t = 0; t < timeLength; t++) {
      const yList = lists[t];
      if (!vectors[t]) vectors[t] = [];
      for (let x = 0; x < listLength; x++) {
        const y = yList[x];
        // Center the coordinates around the origin
        vertices.push(x - xCenter, y, t - zCenter);

        vectors[t].push(new THREE.Vector3(x - xCenter, y, t - zCenter));
      }
    }

    // Generate indices to form triangles
    for (let t = 0; t < timeLength - 1; t++) {
      for (let x = 0; x < listLength - 1; x++) {
        const a = t * listLength + x;
        const b = a + 1;
        const c = a + listLength;
        const d = c + 1;
        indices.push(a, b, c); // triangle 1
        indices.push(b, d, c); // triangle 2
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    setHighlightedVectors(vectors[0]); // Set initial highlighted vectors
    return geometry;
  }, [lists]);

  return (
    <group rotation={[0, Math.PI / 1, 0]} scale={[0.6, 1, 1]}>
      <mesh geometry={geometry} ref={meshRef} onPointerMove={handlePointerMove}>
        <meshStandardMaterial
          color={color ? new THREE.Color(color) : new THREE.Color('purple')}
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      {/* Marker for intersection point */}
      <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <SoundScapeSoundlineWrapper />
    </group>
  );
};

export default SoundScape;
