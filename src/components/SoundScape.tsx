import { useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import SoundLine from './SoundLine';
import { useThemeStore, localSoundScapeStore } from '../store';
import vertexSoundScape from '../shaders/soundscape/vertex.glsl?raw';
import fragmentSoundScape from '../shaders/soundscape/fragment.glsl?raw';
import AudioVisualizer from './AudioVisualizer';

type SoundScapeProps = {
  lists: number[][];
  showWireframe?: boolean;
  position?: [number, number, number];
};

const SoundScapeSoundlineWrapper: React.FC = () => {
  const points = localSoundScapeStore((state) => state.highlightedVectors);
  if (points.length === 0) {
    return null; // No points to render
  }
  return <SoundLine points={points} />;
};

const SoundScape: React.FC<SoundScapeProps> = ({ lists, position }) => {
  const setHighlightedVectors = localSoundScapeStore((state) => state.setHighlightedVectors);
  const setLineTime = localSoundScapeStore((state) => state.setLineTime);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const intersectionRef = useRef<THREE.Vector3 | null>(null);
  const previousIntersectionListIndexRef = useRef<number>(0);
  const markerRef = useRef<THREE.Mesh>(null);
  const [bbox, setBbox] = useState({ min: new THREE.Vector3(), max: new THREE.Vector3() });
  const theme = useThemeStore();

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

    const adjustedZ = point.z + timeLength / 2;
    const listIndex = Math.max(0, Math.floor(adjustedZ));

    if (previousIntersectionListIndexRef.current === listIndex) {
      return; // No change in list index, skip processing
    }

    // Create vectors with centered coordinates
    const centeredVectors = lists[listIndex].map(
      (y, x) => new THREE.Vector3(x - listLength / 2, y, listIndex - timeLength / 2)
    );

    setHighlightedVectors(centeredVectors, listIndex);
    previousIntersectionListIndexRef.current = listIndex;
  };

  useFrame(() => {
    if (!meshRef.current) return;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(meshRef.current, true);
    if (intersects.length > 0) {
      // Clone intersection point
      const point = intersects[0].point.clone();

      // Convert to local space
      const localPoint = meshRef.current.worldToLocal(point.clone());

      // Normalize by scale
      const scale = meshRef.current.scale;
      const normalizedPoint = new THREE.Vector3(
        localPoint.x / scale.x,
        localPoint.y / scale.y,
        localPoint.z / scale.z
      );

      intersectionRef.current = normalizedPoint;
      getClosestVectors(normalizedPoint);

      // Marker stays in world space
      if (markerRef.current) {
        markerRef.current.position.copy(point);
        markerRef.current.visible = true;
      }
    } else {
      if (markerRef.current) markerRef.current.visible = false;
    }
  });

  const handlePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation(); // prevent bubbling
    if (!meshRef.current) return;

    // Convert mouse coords
    mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current, true);

    if (intersects.length === 0) return;

    // Convert to local space
    const localPoint = meshRef.current.worldToLocal(intersects[0].point.clone());
    const scale = meshRef.current.scale;
    const normalizedPoint = new THREE.Vector3(
      localPoint.x / scale.x,
      localPoint.y / scale.y,
      localPoint.z / scale.z
    );

    // Update vectors and lineTime
    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;
    const listIndex = Math.max(0, Math.floor(normalizedPoint.z + timeLength / 2));

    if (previousIntersectionListIndexRef.current !== listIndex) {
      const centeredVectors = lists[listIndex].map(
        (y, x) => new THREE.Vector3(x - listLength / 2, y, listIndex - timeLength / 2)
      );
      setHighlightedVectors(centeredVectors, listIndex);

      const duration = 10; // or from your audio store
      const lineTime = (listIndex / timeLength) * duration;
      setLineTime(lineTime, true); // <-- click update

      previousIntersectionListIndexRef.current = listIndex;
    }
  };

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

    const uvs: number[] = [];

    // Generate UV coordinates
    for (let t = 0; t < timeLength; t++) {
      for (let x = 0; x < listLength; x++) {
        const u = x / (listLength - 1);
        const v = t / (timeLength - 1);
        uvs.push(u, v);
      }
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

    // After creating geometry, compute its bounding box
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      setBbox({
        min: geometry.boundingBox.min.clone(),
        max: geometry.boundingBox.max.clone(),
      });
    }

    setHighlightedVectors(vectors[0], 0); // Set initial highlighted vectors
    return geometry;
  }, [lists]);
  const lines = lists.map((yList, t) => yList.map((y, x) => new THREE.Vector3(x, y, t)));

  return (
    <>
      <group rotation={[0, Math.PI / 1, 0]} scale={[0.6, 1, 0.8]} position={position}>
        <mesh
          geometry={geometry}
          ref={meshRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
        >
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexSoundScape}
            fragmentShader={fragmentSoundScape}
            uniforms={{
              color1: { value: theme.getColorVec3('--dark') ?? new THREE.Vector3(0, 0, 0) },
              color2: { value: theme.getColorVec3('--accent-3d') ?? new THREE.Vector3(0, 0, 0) },
              uBboxMin: { value: bbox.min },
              uBboxMax: { value: bbox.max },
              uRoughness: { value: 0.5 },
              uRoughnessPower: { value: 0.5 },
              uCameraPosition: { value: camera.position },
            }}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Marker for intersection point */}
        {/* <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh> */}
        <AudioVisualizer allLines={lines} />
      </group>
      <SoundScapeSoundlineWrapper />
    </>
  );
};

export default SoundScape;
