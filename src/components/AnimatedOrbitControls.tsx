import { useLocation } from 'react-router';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { isMobile } from 'react-device-detect';

function AnimatedOrbitControls() {
  const controlsRef = useRef<any>(null);
  const location = useLocation();

  const lastPathnameRef = useRef(location.pathname);
  const hasAnimatedRef = useRef(false);

  const defaults: Record<string, { position: THREE.Vector3; target: THREE.Vector3; zoom: number }> =
    {
      '/': {
        position: new THREE.Vector3(5, 5, 5),
        target: new THREE.Vector3(0, 0, 0),
        zoom: isMobile ? 40 : 50,
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

  useFrame(() => {
    if (!controlsRef.current) return;

    const camera = controlsRef.current.object as THREE.OrthographicCamera;
    const pageDefaults = defaults[location.pathname] || defaults['/'];

    // Reset animation when the route changes
    if (location.pathname !== lastPathnameRef.current) {
      hasAnimatedRef.current = false;
      lastPathnameRef.current = location.pathname;
    }

    if (location.pathname === '/overview') {
      // ✅ Animate once when entering overview, then free user control
      if (!hasAnimatedRef.current) {
        const closeEnough =
          camera.position.distanceTo(pageDefaults.position) < 0.01 &&
          Math.abs(camera.zoom - pageDefaults.zoom) < 0.01 &&
          controlsRef.current.target.distanceTo(pageDefaults.target) < 0.01;

        if (!closeEnough) {
          camera.position.lerp(pageDefaults.position, 0.1);
          camera.zoom = THREE.MathUtils.lerp(camera.zoom, pageDefaults.zoom, 0.1);
          camera.updateProjectionMatrix();
          controlsRef.current.target.lerp(pageDefaults.target, 0.1);
          controlsRef.current.update();
        } else {
          hasAnimatedRef.current = true;
        }
      }
    } else {
      // 🔒 For all other pages: keep camera locked at defaults
      camera.position.lerp(pageDefaults.position, 0.05);
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, pageDefaults.zoom, 0.05);
      camera.updateProjectionMatrix();
      controlsRef.current.target.lerp(pageDefaults.target, 0.05);
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    if (!controlsRef.current) return;

    if (location.pathname === '/overview') {
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
    } else {
      controlsRef.current.enableRotate = false;
      controlsRef.current.enableZoom = false;
    }
  }, [location.pathname]);

  return (
    <OrbitControls ref={controlsRef} enablePan={false} minZoom={35} maxZoom={200} zoomSpeed={1} />
  );
}
export default AnimatedOrbitControls;
