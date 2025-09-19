import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { easeOutQuint } from '../easing';
import { useThemeStore, useAudioStore, localSoundScapeStore } from '../store';
import { Html } from '@react-three/drei';
import { formatTime } from '../audio';

type SoundLineProps = {
  points: THREE.Vector3[];
  color?: string;
  lineWidth?: number;
  tweenDuration?: number;
  easing?: (t: number) => number;
  scale?: [number, number, number];
  position?: [number, number, number];
  currentTimeIndex?: boolean;
};

const lerpVector3 = (start: THREE.Vector3, end: THREE.Vector3, t: number): THREE.Vector3 => {
  return new THREE.Vector3(
    start.x + (end.x - start.x) * t,
    start.y + (end.y - start.y) * t,
    start.z + (end.z - start.z) * t
  );
};

const SoundLine: React.FC<SoundLineProps> = ({
  points,
  color = useThemeStore((s) => s.colors['--accent']),
  lineWidth = 0.2,
  tweenDuration = 200,
  easing = easeOutQuint,
  scale = [-0.6, 1.05, -0.8],
  position = [0, 1, 0],
  currentTimeIndex = false,
}) => {
  const lineRef = useRef<Line2 | null>(null);
  const { size } = useThree();
  const highlightedLineIndex = localSoundScapeStore((s) => s.highlightedLineIndex);
  const totalLines = 200; // or your global total lines count
  const { currentTime, duration } = useAudioStore();

  const lineTime = (highlightedLineIndex / totalLines) * duration;
  const [lineTimeState] = useState(lineTime);

  // Animation state
  const isAnimatingRef = useRef(false);
  const startPointsRef = useRef<THREE.Vector3[]>([]);
  const targetPointsRef = useRef<THREE.Vector3[]>([]);
  const currentPointsRef = useRef<THREE.Vector3[]>(points);
  const animationStartTimeRef = useRef<number>(0);
  const positionsBufferRef = useRef<Float32Array>(new Float32Array(points.length * 3));

  // HTML Z animation
  const htmlZStartRef = useRef(0);
  const htmlZTargetRef = useRef(0);
  const htmlZCurrentRef = useRef(0);
  const htmlRef = useRef<any>(null);
  const htmlGroupRef = useRef<THREE.Group>(null);

  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

  const setLineTime = localSoundScapeStore((s) => s.setLineTime);

  useEffect(() => {
    const lineTime = (highlightedLineIndex / totalLines) * duration;

    setLineTime(lineTime); // update global store
  }, [highlightedLineIndex, duration, totalLines, setLineTime, currentTime]);
  // Initialize buffer
  const updatePositionsBuffer = (pts: THREE.Vector3[]) => {
    pts.forEach((p, i) => {
      positionsBufferRef.current[i * 3] = p.x * scale[0];
      positionsBufferRef.current[i * 3 + 1] = p.y * scale[1];
      positionsBufferRef.current[i * 3 + 2] = p.z * scale[2];
    });
  };

  // Tween animation
  useEffect(() => {
    if (!points.length) return;

    if (!startPointsRef.current.length) {
      startPointsRef.current = [...points];
      currentPointsRef.current = [...points];
      updatePositionsBuffer(points);
      return;
    }

    startPointsRef.current = [...currentPointsRef.current];
    targetPointsRef.current = [...points];

    const middleIdx = Math.floor(points.length / 2);
    htmlZStartRef.current = htmlZCurrentRef.current || points[middleIdx].z * scale[2];
    htmlZTargetRef.current = points[middleIdx].z * scale[2];

    isAnimatingRef.current = true;
    animationStartTimeRef.current = performance.now();
  }, [points, scale]);

  useFrame(() => {
    if (!lineRef.current || !htmlGroupRef.current) return;

    if (isAnimatingRef.current) {
      const now = performance.now();
      const elapsed = now - animationStartTimeRef.current;
      const progress = Math.min(elapsed / tweenDuration, 1);
      const easedProgress = easing(progress);

      // Update line points
      for (let i = 0; i < startPointsRef.current.length; i++) {
        currentPointsRef.current[i] = lerpVector3(
          startPointsRef.current[i],
          targetPointsRef.current[i],
          easedProgress
        );
      }
      updatePositionsBuffer(currentPointsRef.current);

      const geometry = lineRef.current.geometry as LineGeometry;
      geometry.setPositions(positionsBufferRef.current);
      lineRef.current.computeLineDistances();

      // pick the middle point as anchor
      const mid = Math.floor(currentPointsRef.current.length / 2);
      const anchor = currentPointsRef.current[mid];

      htmlGroupRef.current.position.set(
        currentPointsRef.current[1].x * scale[0] + 3,
        0,
        anchor.z * scale[2] - 0.4 // use same scaling as line
      );

      // Update text
      if (htmlRef.current) {
        const lineTime = (highlightedLineIndex / totalLines) * duration;
        htmlRef.current.textContent = formatTime(lineTime);
      }
      if (progress >= 1) isAnimatingRef.current = false;
    }
  });

  const line = useMemo(() => {
    updatePositionsBuffer(currentPointsRef.current);
    const geometry = new LineGeometry();
    geometry.setPositions(positionsBufferRef.current);
    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      resolution,
      worldUnits: true,
      transparent: true,
    });
    const line = new Line2(geometry, material);
    line.computeLineDistances();
    return line;
  }, [color, lineWidth, resolution]);

  return (
    <>
      <primitive object={line} ref={lineRef} position={position} />
      {points.length > 0 && (
        <group ref={htmlGroupRef}>
          <Html
            transform
            scale={4}
            rotation={[Math.PI / -2, 0, Math.PI / (currentTimeIndex ? -2 : 2)]}
            position={[currentTimeIndex ? -5.5 : 0, 0, 0]}
          >
            <div
              ref={currentTimeIndex ? null : htmlRef} // <- now ref points to the DOM element, not Object3D
              style={{ color: 'white', fontSize: '16px' }}
            >
              {currentTimeIndex ? formatTime(currentTime) : formatTime(lineTimeState)}
            </div>
          </Html>
        </group>
      )}
    </>
  );
};

export default SoundLine;
export type { SoundLineProps };
