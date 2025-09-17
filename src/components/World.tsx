import * as THREE from 'three';
import Earth from './Earth';
import type { GeoPoint } from '../types';
import { useEffect, useRef, useState } from 'react';
import { useWorldStore } from '../store';
import { latLonToVector3 } from '../geo';
import { useFrame, useThree } from '@react-three/fiber';
import { easeInOutQuad } from '../easing';
import { useNavigate } from 'react-router';
import Pin from './Pin';
export interface WorldProps {
  geoPoints?: GeoPoint[];
  radius?: number;
  position?: [number, number, number];
  scale?: [number, number, number];
}

interface AnimationState {
  isAnimating: boolean;
  startTime: number;
  duration: number;
}

const World: React.FC<WorldProps> = ({
  geoPoints = [],
  radius = 5,
  position = [0, 0, 0],
  scale = [1, 1, 1],
  // onPointClick = (point: GeoPoint) => {}
}) => {
  const { camera } = useThree(); // get active camera
  const navigate = useNavigate();
  const worldRef = useRef<THREE.Mesh>(null);
  const pointsGroupRef = useRef<THREE.Group>(null);
  const previousHighlightedPoint = useRef<GeoPoint | undefined>(undefined);
  const [pointDirection] = useState(new THREE.Vector3(0, 1, 0)); // Up vector of the Earth
  const setHighlightedPoint = useWorldStore((state) => state.setHighlightedPoint);

  // Animation state for custom easing
  const animationState = useRef<AnimationState>({
    isAnimating: false,
    startTime: 0,
    duration: 1500, // 1.5 seconds
  });

  useFrame(() => {
    if (!worldRef.current) return;

    const animation = animationState.current;
    if (animation.isAnimating) {
      const elapsed = Date.now() - animation.startTime;
      const t = Math.min(elapsed / animation.duration, 1); // Clamp t to [0, 1]
      const progress = easeInOutQuad(t); // Apply easing function
      // End animation when complete
      if (progress >= 1) {
        animation.isAnimating = false;
      }

      // World direction from sphere center to camera
      const toCamera = new THREE.Vector3()
        .subVectors(camera.position, worldRef.current.position)
        .normalize();
      // change the toCamera vector, fake a vertical movement
      toCamera.add(new THREE.Vector3(0, 0.5, 0)).normalize();
      // Create a quaternion that rotates pointDirection → toCamera
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(pointDirection, toCamera);
      // apply an agle to the quaternon only on one axis, e.g. 15 degrees if the pointDirection is towards north
      // or 30 degrees if the pointDirection is towards south

      // Apply rotation with easing
      worldRef.current.quaternion.slerp(quaternion, progress); // Smoothly rotate towards camera
      // worldRef.current.quaternion.setFromUnitVectors(pointDirection, toCamera) // Directly set the quaternion
      // worldRef.current.quaternion.copy(quaternion)
    }
  });

  // Subscribe to highlightedPoint without triggering React re-renders
  useEffect(() => {
    const unsub = useWorldStore.subscribe((state) => {
      state.highlightedPoint;
      if (
        state.highlightedPoint &&
        previousHighlightedPoint.current?.id !== state.highlightedPoint.id
      ) {
        previousHighlightedPoint.current = state.highlightedPoint;
        // Example: Log or mutate something without re-render
        console.log('Highlighted point changed:', state.highlightedPoint);

        const targetPos = latLonToVector3(
          state.highlightedPoint.lat,
          state.highlightedPoint.lon,
          radius + 0.5
        );

        console.log('Rotating earth towards:', state.highlightedPoint, targetPos);

        // Rotate the world towards the target position
        if (worldRef.current) {
          pointDirection.copy(targetPos).normalize();
          animationState.current.startTime = Date.now();
          animationState.current.isAnimating = true;
        }
      }
    });
    return () => unsub();
  }, []);

  const handleClickPoint = (point: GeoPoint) => {
    // Set the highlighted point in the store
    setHighlightedPoint(point);

    // Navigate to the point's URL if it exists
    if (point.url) {
      navigate(point.url);
    }
  };

  return (
    <group ref={worldRef} rotation={[-0.1, -1.0, -0.4]} position={position} scale={scale}>
      <Earth radius={radius}>
        <group ref={pointsGroupRef}>
          {geoPoints.map((point, i) => {
            const position = latLonToVector3(point.lat, point.lon, radius + 0.03);
            return (
              <Pin
                key={point.id || i}
                position={position}
                point={point}
                onClick={handleClickPoint}
              />
            );
          })}
        </group>
      </Earth>
    </group>
  );
};
export default World;
