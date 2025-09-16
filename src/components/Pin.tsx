import { Vector3 } from 'three';
import * as THREE from 'three';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { GeoPoint } from '../types';
import { Html } from '@react-three/drei';
import './Pin.css';
import { useModalStore } from '../store';

export interface PinProps {
  point: GeoPoint;
  position: Vector3; // already computed local position
  color?: string;
  onClick: (point: GeoPoint) => void;
  children?: React.ReactNode;
}

const Pin: React.FC<PinProps> = ({ point, position, color, onClick, children }) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Object3D<THREE.Object3DEventMap>>(null);
  const [isInRange, setInRange] = useState(false);
  const [isOccluded, setOccluded] = useState(false);
  const [isVisible, setVisible] = useState(true); // controlled by distance + occlusion
  const { openModal } = useModalStore();

  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (ref.current) {
      const distance = state.camera.position.distanceTo(ref.current.getWorldPosition(vec));

      const inRange = distance <= 100; // your existing range limit
      if (inRange !== isInRange) setInRange(inRange);

      // Hide Html if occluded or too far
      setVisible(inRange && !isOccluded && distance <= 4);
    }
  });

  return (
    <group
      position={[position.x, position.y, position.z + 0.01]} // small forward offset to reduce false occlusion
      ref={ref}
    >
      <Html
        distanceFactor={0.01} // scale factor relative to scene
        onOcclude={setOccluded}
        zIndexRange={[0, 20]} // 👈 limit z-index
        style={{
          transition: 'all 0.2s',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.5}) translateY(calc(-100% + 10px )) translateX(-100%)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className="Pin"
          onClick={() => {
            onClick(point);
            openModal();
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          <p>{point.name || 'Unnamed'}</p>
          <span className="Pin-line"></span>
          <div className="Pin-dot"></div>

          {/* <p className="text-xs text-gray-600">
            {point.description || 'No description available.'}
          </p> */}
        </div>
        {children}
      </Html>

      <mesh
        ref={meshRef}
        onClick={() => onClick(point)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[0.05, 2, 2]} />
        <meshStandardMaterial transparent opacity={0} color={point.color || color || 'yellow'} />
      </mesh>
    </group>
  );
};

export default Pin;
