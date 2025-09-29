import React from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
// @ts-ignore
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

type GeometryExporterProps = {
  ref: RefObject<THREE.Mesh>;
};

const GeometryExporter: React.FC<GeometryExporterProps> = ({ ref }) => {
  const handleExport = () => {
    if (!ref || !ref.current) {
      console.warn('No mesh to export');
      return;
    }

    // Clone the mesh so we don’t modify the live one
    const mesh = ref.current.clone(true);

    if (mesh.geometry) {
      // Flip normals by mirroring geometry
      mesh.geometry = mesh.geometry.clone(); // make sure we don't share buffers
      mesh.geometry.scale(0.6, 1, -0.8); // flip across X axis
      //   mesh.geometry.rotateX(Math.PI); // rotate 180 degrees around Z axis
      //   mesh.geometry.scale(1, -1, 1); // flip across X axis
      mesh.geometry.computeVertexNormals();
    }

    const exporter = new GLTFExporter();
    exporter.parse(
      mesh,
      (gltf: any) => {
        const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'soundscape_model.gltf';
        a.click();
        URL.revokeObjectURL(url);
      },
      { binary: false }
    );
  };

  return <button onClick={handleExport}>Export GLTF</button>;
};

export default GeometryExporter;
