import { useLocation } from 'react-router';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const AnimatedOrbitControls = () => {
  const controlsRef = useRef<any>(null);
  const location = useLocation();

  const lastPathnameRef = useRef(location.pathname);
  const hasAnimatedRef = useRef(false); // has the page animation completed?

  const defaults: Record<string, { position: THREE.Vector3; target: THREE.Vector3; zoom: number }> =
    {
      '/': {
        position: new THREE.Vector3(5, 5, 5),
        target: new THREE.Vector3(0, 0, 0),
        zoom: 35,
      },
      '/about': {
        position: new THREE.Vector3(8, 5, 5),
        target: new THREE.Vector3(15, 15, -25),
        zoom: 60,
      },
    };

  useFrame(() => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object as THREE.OrthographicCamera;
    const pageKey = location.pathname === '/about' ? '/about' : '/';
    const pageDefaults = defaults[pageKey];

    // Reset animation flag on route change
    if (location.pathname !== lastPathnameRef.current) {
      hasAnimatedRef.current = false;
      lastPathnameRef.current = location.pathname;
    }

    if (location.pathname === '/about') {
      // Always animate to defaults (locked)
      camera.position.lerp(pageDefaults.position, 0.05);
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, pageDefaults.zoom, 0.05);
      camera.updateProjectionMatrix();
      controlsRef.current.target.lerp(pageDefaults.target, 0.05);
      controlsRef.current.update();
    } else if (location.pathname === '/') {
      // Animate once at page enter
      if (!hasAnimatedRef.current) {
        const closeEnough =
          camera.position.distanceTo(pageDefaults.position) < 0.01 &&
          Math.abs(camera.zoom - pageDefaults.zoom) < 0.01 &&
          controlsRef.current.target.distanceTo(pageDefaults.target) < 0.01;

        if (!closeEnough) {
          camera.position.lerp(pageDefaults.position, 0.1); // faster lerp
          camera.zoom = THREE.MathUtils.lerp(camera.zoom, pageDefaults.zoom, 0.1);
          camera.updateProjectionMatrix();
          controlsRef.current.target.lerp(pageDefaults.target, 0.1);
          controlsRef.current.update();
        } else {
          hasAnimatedRef.current = true; // animation finished, user can rotate freely
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableRotate={location.pathname === '/'} // only rotate on index
      enableZoom={location.pathname === '/'} // only zoom on index
      minZoom={35}
      maxZoom={200}
      zoomSpeed={1}
    />
  );
};

export default AnimatedOrbitControls;
