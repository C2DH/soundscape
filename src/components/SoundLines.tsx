import { useMemo } from 'react';
import * as THREE from 'three';
import { useMeshStore } from '../store';

type SoundLinesProps = {
  lines: THREE.Vector3[][];
  lineIdx?: number;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
};

const SoundLines: React.FC<SoundLinesProps> = ({
  lines = [],
  lineIdx = -1,
  color = 'white',
  opacity = 1,
  position = [0, 0, 0],
}) => {
  const setSoundLines = useMeshStore((s) => s.setSoundLines);
  //   console.log('lines', lines, lineIdx);
  const lineObjects = useMemo(() => {
    if (lines.length === 0 || lineIdx < 0 || lineIdx >= lines.length) {
      return null;
    }

    return lines.slice(0, lineIdx).map((points, index) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
      });

      const line = new THREE.Line(geometry, material);

      return <primitive key={index} object={line} />;
    });
  }, [lines, lineIdx, color, opacity]);

  return (
    <group
      ref={(g) => {
        if (g) setSoundLines(g);
      }}
      position={position}
    >
      {lineObjects}
    </group>
  );
};

export default SoundLines;
