import { Vector3 } from 'three';
import * as THREE from 'three';
import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { GeoPoint } from '../types';
import { Html } from '@react-three/drei';
import './Pin.css';
import { useModalStore } from '../store';
import { useCameraStore } from '../store';

export interface PinProps {
  point: GeoPoint;
  position: Vector3; // already computed local position
  toBottom?: boolean;
  color?: string;
  onClick: (point: GeoPoint) => void;
  children?: React.ReactNode;
}

const Pin: React.FC<PinProps> = ({
  point,
  toBottom = false,
  position,
  color,
  onClick,
  children,
}) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Object3D<THREE.Object3DEventMap>>(null);
  const isInRangeRef = useRef(false);
  const isOccludedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const [isVisible, setVisible] = useState(true); // controlled by distance + occlusion
  const openModal = useModalStore((s) => s.openModal);
  const zoom = useCameraStore((state) => state.zoom);

  const vec = new THREE.Vector3();

  const onOcclude = (occluded: boolean) => {
    isOccludedRef.current = occluded;
  };

  useFrame((state) => {
    if (ref.current) {
      const distance = state.camera.position.distanceTo(ref.current.getWorldPosition(vec));

      const inRange = distance <= 100; // your existing range limit
      if (isInRangeRef.current !== inRange) {
        isInRangeRef.current = inRange;
      }
      if (isOccludedRef.current) {
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = inRange && distance <= 10;
      }
      if (isVisibleRef.current !== isVisible) {
        setVisible(isVisibleRef.current);
      }
    }
  });

  return (
    <group
      position={[position.x, position.y, position.z + 0.01]} // small forward offset to reduce false occlusion
      ref={ref}
    >
      <Html
        distanceFactor={0.01} // scale factor relative to scene
        onOcclude={onOcclude}
        zIndexRange={[0, 20]} // 👈 limit z-index
        style={{
          transition: 'all 0.2s',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.5}) translateY(calc(-100% + 10px )) translateX(-100%)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div
          className={`Pin ${zoom > 60 ? 'Pin-visible' : ''}`}
          onClick={() => {
            onClick(point);
            openModal();
          }}
          onPointerOver={() => (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = 'default')}
        >
          <span className={`Pin-line ${toBottom ? 'Pin-line-bottom' : ''}`}></span>
          <p className={`Pin-label ${toBottom ? 'Pin-label-bottom' : ''}`}>
            {point.name || 'Unnamed'}
          </p>

          <div className="Pin-dot"></div>
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
