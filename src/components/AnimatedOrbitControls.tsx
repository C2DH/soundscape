import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';
import { isMobile } from 'react-device-detect';

const CameraPositionsByPathnameDesktop: Record<
  string,
  { position: THREE.Vector3; target: THREE.Vector3; zoom: number }
> = {
  '/': {
    position: new THREE.Vector3(5, 5, 5),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 50,
  },
  '/overview': {
    position: new THREE.Vector3(5, 5, 5),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 120,
  },
  '/about': {
    position: new THREE.Vector3(7, 0, 5),
    target: new THREE.Vector3(10, 15, -15),
    zoom: 60,
  },
  '/contact': {
    position: new THREE.Vector3(0, 15, 5),
    target: new THREE.Vector3(0, 0, -25),
    zoom: 100,
  },
};

const CameraPositionsByPathnameMobile: Record<
  string,
  { position: THREE.Vector3; target: THREE.Vector3; zoom: number }
> = {
  '/': {
    position: new THREE.Vector3(0, 5, 5),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 40,
  },
  '/overview': {
    position: new THREE.Vector3(5, 5, 5),
    target: new THREE.Vector3(0, 0, 0),
    zoom: 120,
  },
  '/about': {
    position: new THREE.Vector3(0, 7, 5),
    target: new THREE.Vector3(10, 15, -15),
    zoom: 80,
  },
  '/contact': {
    position: new THREE.Vector3(0, 15, 5),
    target: new THREE.Vector3(0, 0, -25),
    zoom: 120,
  },
};

const CameraPositionsByPathname = isMobile
  ? CameraPositionsByPathnameMobile
  : CameraPositionsByPathnameDesktop;

function AnimatedOrbitControls() {
  const controlsRef = useRef<any>(null);

  // Fetch initial state
  const pathnameRef = useRef(useStore.getState().pathname);
  const shouldAnimateCameraRef = useRef(true);

  useEffect(
    () =>
      useStore.subscribe((state) => {
        if (state.pathname !== pathnameRef.current) {
          shouldAnimateCameraRef.current = true;
        }
        pathnameRef.current = state.pathname;
      }),
    []
  );

  useFrame(() => {
    if (!controlsRef.current) return;

    // Disable user interaction while animating
    controlsRef.current.enabled = !shouldAnimateCameraRef.current;

    if (shouldAnimateCameraRef.current) {
      const pathname = pathnameRef.current;
      const pageDefaults = CameraPositionsByPathname[pathname] || CameraPositionsByPathname['/'];
      const camera = controlsRef.current.object as THREE.OrthographicCamera;

      const closeEnough =
        camera.position.distanceTo(pageDefaults.position) < 0.01 &&
        Math.abs(camera.zoom - pageDefaults.zoom) < 0.01 &&
        controlsRef.current.target.distanceTo(pageDefaults.target) < 0.01;

      if (closeEnough) {
        shouldAnimateCameraRef.current = false;
      }

      camera.position.lerp(pageDefaults.position, 0.1);
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, pageDefaults.zoom, 0.1);
      camera.updateProjectionMatrix();
      controlsRef.current.target.lerp(pageDefaults.target, 0.1);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls ref={controlsRef} enablePan={false} minZoom={35} maxZoom={200} zoomSpeed={1} />
  );
}

export default AnimatedOrbitControls;
