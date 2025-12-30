import React from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

type GeometryExporterProps = {
  target: THREE.Object3D | null;
  name: string;
  exportScale?: [number, number, number]; // optional scale for export
};

const GeometryExporter: React.FC<GeometryExporterProps> = ({ target, name, exportScale }) => {
  const handleExport = () => {
    if (!target) {
      console.warn('No object to export');
      return;
    }

    const clone = target.clone(true);

    // Apply export scale only if provided (used for sound lines)
    if (exportScale) {
      clone.scale.set(exportScale[0], exportScale[1], exportScale[2]);
    }

    // Bake world transform into geometry so GLTF reflects scale/position correctly
    clone.updateMatrixWorld(true);
    clone.traverse((obj: any) => {
      if (obj.isMesh || obj.isLine) {
        if (obj.geometry) {
          obj.geometry = obj.geometry.clone();
          obj.geometry.applyMatrix4(obj.matrixWorld);
          obj.matrix.identity();
          obj.position.set(0, 0, 0);
          obj.rotation.set(0, 0, 0);
          obj.scale.set(1, 1, 1);
        }
      }
    });

    const exporter = new GLTFExporter();
    exporter.parse(
      clone,
      (gltf: any) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.gltf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      { binary: false }
    );
  };

  return <button onClick={handleExport}>Export {name}</button>;
};

export default GeometryExporter;
