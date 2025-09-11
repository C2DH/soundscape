import React, { useMemo, useEffect, useState } from 'react';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../store';

type ProgressiveLinesProps = {
  allLines: THREE.Vector3[][];
  visibleLines: number; // target number of lines
  color?: string;
  lineWidth?: number;
  scale?: [number, number, number];
  opacity?: number;
  position?: [number, number, number];
  delay?: number; // delay between lines in ms
};

const ProgressiveLines: React.FC<ProgressiveLinesProps> = ({
  allLines,
  visibleLines,
  color = useThemeStore((s) => s.colors['--accent-3d']),
  lineWidth = 0.1,
  scale = [-0.6, 1.01, -0.8],
  opacity = 0.5,
  position = [0, 0.1, 0],
  delay = 100, // default: 100ms per line
}) => {
  const { size } = useThree();
  const resolution = useMemo(() => new THREE.Vector2(size.width, size.height), [size]);

  // State: how many lines are currently revealed
  const [delayedVisible, setDelayedVisible] = useState(0);

  useEffect(() => {
    if (visibleLines === 0) {
      setDelayedVisible(0);
      return;
    }

    let i = delayedVisible;
    const interval = setInterval(() => {
      i++;
      setDelayedVisible((prev) => Math.min(prev + 1, visibleLines));
      if (i >= visibleLines) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [visibleLines, delay]);

  const lineObjects = useMemo(() => {
    const timeLength = allLines.length;
    const listLength = allLines[0]?.length || 0;

    return allLines.slice(0, delayedVisible).map((points, index) => {
      const centeredPoints = points.map(
        (p) => new THREE.Vector3(p.x - listLength / 2, p.y, index - timeLength / 2)
      );

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
  }, [allLines, delayedVisible, color, lineWidth, resolution, scale]);

  return <group position={position}>{lineObjects}</group>;
};

export default ProgressiveLines;
