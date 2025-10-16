import { useFrame, useThree } from '@react-three/fiber';
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as THREE from 'three';
import SoundLine from './SoundLine';
import { useThemeStore, localSoundScapeStore, useSceneStore, useAudioStore } from '../store';
import vertexSoundScape from '../shaders/soundscape/vertex.glsl?raw';
import fragmentSoundScape from '../shaders/soundscape/fragment.glsl?raw';
import AudioVisualizer from './AudioVisualizer';
import { Html } from '@react-three/drei';
import ReverseSign from './svg/ReverseSign';
import { isMobile } from 'react-device-detect';

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

const SoundScape = forwardRef<THREE.Mesh, SoundScapeProps>(({ lists, position }, ref) => {
  const setHighlightedVectors = localSoundScapeStore((state) => state.setHighlightedVectors);
  const reversed = useSceneStore((s) => s.reversed);
  const setReversed = useSceneStore((s) => s.setReversed);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const previousIntersectionListIndexRef = useRef<number>(0);

  const setSeekTime = useAudioStore((s) => s.setSeekTime);
  const duration = useAudioStore((s) => s.duration);

  const [bbox, setBbox] = useState({
    min: new THREE.Vector3(),
    max: new THREE.Vector3(),
  });
  const getColorVec3 = useThemeStore((state) => state.getColorVec3);

  const raycaster = useRef(new THREE.Raycaster()).current;
  const mouse = useRef(new THREE.Vector2()).current;

  const { camera, gl } = useThree();

  useEffect(() => {
    if (lists.length === 0) return;

    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;

    const centeredVectors = lists[0].map(
      (y, x) => new THREE.Vector3(x - listLength / 2, y, 0 - timeLength / 2)
    );

    setHighlightedVectors(centeredVectors, 0);
    previousIntersectionListIndexRef.current = 0;
  }, [lists]);

  const handlePointerMove = (event: React.PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    mouse.x = x * 2 - 1;
    mouse.y = -(y * 2 - 1);
  };

  /**
   * Updates the highlighted vectors based on the provided 3D point.
   *
   * Calculates the corresponding list index from the z-coordinate of the point,
   * then generates a new set of centered vectors for that list. If the list index
   * has not changed since the last update, the function returns early to avoid
   * unnecessary updates.
   *
   * @param point - The THREE.Vector3 point used to determine which list of vectors to highlight.
   *
   * @remarks
   * - Assumes `lists` is a 2D array where each sub-array contains y-values.
   * - Uses `previousIntersectionListIndexRef` to track the last highlighted list index.
   * - Calls `setHighlightedVectors` with the new vectors and the current list index.
   *
   * @returns The current list index that was highlighted.
   */
  const updateHighlightedVectors = (point: THREE.Vector3): number => {
    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;

    const adjustedZ = point.z + timeLength / 2;
    const listIndex = Math.max(0, Math.floor(adjustedZ));
    if (previousIntersectionListIndexRef.current === listIndex) {
      return listIndex;
    }

    const centeredVectors = lists[listIndex].map(
      (y, x) => new THREE.Vector3(x - listLength / 2, y, listIndex - timeLength / 2)
    );

    setHighlightedVectors(centeredVectors, listIndex);
    previousIntersectionListIndexRef.current = listIndex;
    return listIndex;
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    handlePointerMove(event);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current!, true);
    if (intersects.length === 0) return;
    const point = intersects[0].point.clone();
    const normalizedPoint = getNormalizedPointFromIntersection(point);
    if (!normalizedPoint) return;

    const highlightedIndex = updateHighlightedVectors(normalizedPoint);
    const currentTime = (highlightedIndex / lists.length) * duration;
    console.info('[SoundScape] set currentTime:', currentTime);
    setSeekTime(currentTime);
  };

  /**
   * Converts a world-space intersection point to a normalized local-space point relative to the mesh.
   *
   * The function first transforms the given `THREE.Vector3` point from world coordinates to the mesh's local coordinates,
   * then normalizes it by dividing each component by the mesh's scale. This is useful for mapping intersection points
   * to a normalized space within the mesh, for example when working with scaled meshes in 3D scenes.
   *
   * @param point - The intersection point in world coordinates.
   * @returns A normalized local-space `THREE.Vector3` if the mesh reference exists; otherwise, returns `undefined`.
   */
  const getNormalizedPointFromIntersection = (point: THREE.Vector3) => {
    if (!meshRef.current) return;
    const localPoint = meshRef.current.worldToLocal(point.clone());
    const scale = meshRef.current.scale;
    return new THREE.Vector3(
      localPoint.x / scale.x,
      localPoint.y / scale.y,
      localPoint.z / scale.z
    );
  };

  useFrame(() => {
    if (!meshRef.current) return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current, true);
    if (intersects.length === 0) {
      return;
    }

    const normalizedPoint = getNormalizedPointFromIntersection(intersects[0].point.clone());
    if (!normalizedPoint) return;

    updateHighlightedVectors(normalizedPoint);
  });

  const geometry = useMemo(() => {
    const timeLength = lists.length;
    const listLength = lists[0]?.length ?? 0;

    const vertices: number[] = [];
    const indices: number[] = [];
    const vectors = [] as THREE.Vector3[][];

    const xCenter = listLength / 2;
    const zCenter = timeLength / 2;

    for (let t = 0; t < timeLength; t++) {
      const yList = lists[t];
      if (!vectors[t]) vectors[t] = [];
      for (let x = 0; x < listLength; x++) {
        const y = yList[x];
        vertices.push(x - xCenter, y, t - zCenter);
        vectors[t].push(new THREE.Vector3(x - xCenter, y, t - zCenter));
      }
    }

    for (let t = 0; t < timeLength - 1; t++) {
      for (let x = 0; x < listLength - 1; x++) {
        const a = t * listLength + x;
        const b = a + 1;
        const c = a + listLength;
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const uvs: number[] = [];
    for (let t = 0; t < timeLength; t++) {
      for (let x = 0; x < listLength; x++) {
        const u = x / (listLength - 1);
        const v = t / (timeLength - 1);
        uvs.push(u, v);
      }
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeBoundingBox();

    if (geometry.boundingBox) {
      setBbox({
        min: geometry.boundingBox.min.clone(),
        max: geometry.boundingBox.max.clone(),
      });
    }

    return geometry;
  }, [lists]);

  /**
   * Transforms a 2D array of y-coordinates into 3D vector positions for sound visualization.
   *
   * @remarks
   * This creates a grid of THREE.Vector3 points where:
   * - The outer array (`lists`) represents different time slices (z-axis/depth)
   * - Each inner array (`yList`) contains y-coordinates for points along a line
   * - X-coordinates are centered around 0 by subtracting half the list length
   * - Z-coordinates (time) are centered around 0 by subtracting half the total number of lists
   *
   * @example
   * For a 3x3 grid:
   * - x ranges from -1.5 to 1.5 (centered)
   * - y values come from the input lists
   * - z ranges from -1 to 1 (centered)
   *
   * @type {THREE.Vector3[][]}
   */
  const soundLinesVectors: THREE.Vector3[][] = lists.map((yList, t) =>
    yList.map(
      (y, x) => new THREE.Vector3(x - yList.length / 2, y, t - Math.floor(lists.length / 2))
    )
  );

  // expose the meshRef to parent
  useImperativeHandle(ref, () => meshRef.current as THREE.Mesh);

  return (
    <>
      <group rotation={[0, 0, 0]} scale={[0.6, 1, -0.8]} position={position}>
        <mesh
          geometry={geometry}
          ref={meshRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          rotateZ={-Math.PI}
        >
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexSoundScape}
            fragmentShader={fragmentSoundScape}
            uniforms={{
              color1: { value: getColorVec3('--dark') },
              color2: { value: getColorVec3('--accent-3d') },
              uBboxMin: { value: bbox.min },
              uBboxMax: { value: bbox.max },
              uRoughness: { value: 0.5 },
              uRoughnessPower: { value: 0.5 },
              uCameraPosition: { value: camera.position },
            }}
            side={THREE.DoubleSide}
          />
        </mesh>
        <AudioVisualizer soundLinesVectors={soundLinesVectors} />
      </group>
      {!isMobile && <SoundScapeSoundlineWrapper />}
      <Html
        occlude
        transform
        scale={7}
        rotation={[Math.PI / -2, 0, Math.PI / 2]}
        position={[34, 0, 78]}
        className="opacity-60"
      >
        TIME &gt;
      </Html>
      <Html
        occlude
        transform
        scale={7}
        rotation={[Math.PI / -2, 0, Math.PI]}
        position={[0, 0, 84]}
        className="opacity-60"
      >
        {reversed ? 'LOW' : 'HI'}&ensp; &lt; FREQUENCY &gt; &ensp;{reversed ? 'HI' : 'LOW'}
      </Html>
      <Html
        occlude
        transform
        scale={5}
        rotation={[Math.PI / -2, 0, Math.PI]}
        position={[26.5, 0, 84]}
      >
        <ReverseSign onClick={() => setReversed(!reversed)} />
      </Html>
      <Html
        occlude
        transform
        scale={7}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        position={[-29, 8, 82]}
        className="opacity-60"
      >
        AMPLITUDE &gt;
      </Html>
    </>
  );
});

export default SoundScape;
