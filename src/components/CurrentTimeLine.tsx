import React, { useMemo, useRef, useEffect } from 'react';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../store';

// Utility: linear interpolation for vectors
function lerpVector3(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  return new THREE.Vector3(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
}

type CurrentTimeLineProps = {
  allLines: THREE.Vector3[][];
  visibleLines: number; // active index (1..100)
  color?: string;
  lineWidth?: number;
  scale?: [number, number, number];
  opacity?: number;
  position?: [number, number, number];
  tweenDuration?: number; // ms
};

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({
  allLines,
  visibleLines,
  color = useThemeStore((s) => s.colors['--accent-3d']),
  lineWidth = 0.2,
  scale = [-0.6, 1.1, -0.8],
  opacity = 0.9,
  position = [0, 0.1, 0],
  tweenDuration = 200, // ms
}) => {
  const { size } = useThree();
  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

  // refs for animation
  const lineRef = useRef<Line2>(null);
  const startPointsRef = useRef<THREE.Vector3[]>([]);
  const targetPointsRef = useRef<THREE.Vector3[]>([]);
  const currentPointsRef = useRef<THREE.Vector3[]>([]);
  const positionsBufferRef = useRef<Float32Array>(new Float32Array());
  const animationStartTimeRef = useRef(0);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!allLines.length || visibleLines <= 0) return;

    const targetIdx = Math.min(visibleLines, allLines.length) - 1;
    const points = allLines[targetIdx] || [];
    const listLength = points.length;

    const timeLength = allLines.length;
    const centeredPoints = points.map(
      (p) => new THREE.Vector3(p.x - listLength / 2, p.y, targetIdx - timeLength / 2)
    );
    const scaledPoints = centeredPoints.map(
      (p) => new THREE.Vector3(p.x * scale[0], p.y * scale[1], p.z * scale[2])
    );

    startPointsRef.current = currentPointsRef.current.length
      ? [...currentPointsRef.current]
      : [...scaledPoints];
    targetPointsRef.current = [...scaledPoints];
    currentPointsRef.current = [...startPointsRef.current];

    animationStartTimeRef.current = performance.now();
    isAnimatingRef.current = true;
  }, [visibleLines, allLines, scale]);

  // setup geometry + material once
  const { geometry, material } = useMemo(() => {
    const geometry = new LineGeometry();
    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      resolution,
      worldUnits: true,
      transparent: true,
      opacity,
    });
    return { geometry, material };
  }, [color, lineWidth, resolution, opacity]);

  // animation loop
  useFrame(() => {
    if (!isAnimatingRef.current || !lineRef.current) return;

    const now = performance.now();
    const elapsed = now - animationStartTimeRef.current;
    const progress = Math.min(elapsed / tweenDuration, 1);
    const eased = progress; // linear easing

    // update line points
    for (let i = 0; i < startPointsRef.current.length; i++) {
      currentPointsRef.current[i] = lerpVector3(
        startPointsRef.current[i],
        targetPointsRef.current[i],
        eased
      );
    }

    // update geometry buffer
    positionsBufferRef.current = new Float32Array(
      currentPointsRef.current.flatMap((p) => [p.x, p.y, p.z])
    );
    geometry.setPositions(positionsBufferRef.current);
    lineRef.current.computeLineDistances();

    if (progress >= 1) {
      isAnimatingRef.current = false;
    }
  });
  return (
    <group position={position}>
      <primitive ref={lineRef} object={new Line2(geometry, material)} />
    </group>
  );
};

export default CurrentTimeLine;
