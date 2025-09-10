import React, { useMemo } from 'react';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../store';

type ProgressiveLinesProps = {
  allLines: THREE.Vector3[][]; // 100 arrays, each an array of Vector3
  visibleLines: number; // how many lines to show (1..100)
  color?: string;
  lineWidth?: number;
  scale?: [number, number, number];
  opacity?: number;
  position?: [number, number, number];
};

const ProgressiveLines: React.FC<ProgressiveLinesProps> = ({
  allLines,
  visibleLines,
  color = useThemeStore((s) => s.colors['--accent-3d']),
  lineWidth = 0.1,
  scale = [-0.6, 1, -0.8],
  opacity = 0.5,
  position = [0, 0.1, 0],
}) => {
  const { size } = useThree();
  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

  const lineObjects = useMemo(() => {
    const timeLength = allLines.length; // total number of "z steps" (100)
    const listLength = allLines[0]?.length || 0; // number of x-points per line

    return allLines.slice(0, visibleLines).map((points, index) => {
      // Center coordinates like Soundscape
      const centeredPoints = points.map(
        (p) =>
          new THREE.Vector3(
            p.x - listLength / 2, // center along X
            p.y, // keep Y
            index - timeLength / 2 // center along Z
          )
      );

      // Apply scaling
      const scaledPoints = centeredPoints.flatMap((p) => [
        p.x * scale[0],
        p.y * scale[1],
        p.z * scale[2],
      ]);

      const geometry = new LineGeometry();
      geometry.setPositions(scaledPoints);

      const material = new LineMaterial({
        color,
        linewidth: lineWidth,
        resolution,
        worldUnits: true,
        transparent: true,
        opacity,
      });

      const line = new Line2(geometry, material);
      line.computeLineDistances();

      return <primitive key={index} object={line} />;
    });
  }, [allLines, visibleLines, color, lineWidth, resolution, scale]);

  return <group position={position}>{lineObjects}</group>;
};

export default ProgressiveLines;
