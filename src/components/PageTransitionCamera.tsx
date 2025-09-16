import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router';
import * as THREE from 'three';

const defaultPosition = new THREE.Vector3(5, 5, 5); // match your main camera default
const defaultQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

const getRouteTarget = (pathname: string) => {
  switch (pathname) {
    case '/about':
      return {
        pos: new THREE.Vector3(-8, 8, 8),
        quat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(45), 0)
        ),
      };
    // add other routes if needed
    default:
      return { pos: defaultPosition.clone(), quat: defaultQuaternion.clone() };
  }
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const PageTransitionCamera: React.FC = () => {
  const location = useLocation();
  const { camera: mainCamera } = useThree();

  // animated camera (not used as default camera directly)
  const animCamRef = useRef(new THREE.PerspectiveCamera(50, 1, 0.1, 1000));
  const phaseRef = useRef(0); // 0 idle, 1 start->default, 2 default->end
  const tRef = useRef(0);
  const startPos = useRef(new THREE.Vector3());
  const startQuat = useRef(new THREE.Quaternion());
  const midPos = useRef(defaultPosition.clone());
  const midQuat = useRef(defaultQuaternion.clone());
  const endPos = useRef(defaultPosition.clone());
  const endQuat = useRef(defaultQuaternion.clone());

  // initialize anim camera to mainCamera transform
  useEffect(() => {
    const ac = animCamRef.current;
    ac.position.copy(mainCamera.position);
    ac.quaternion.copy(mainCamera.quaternion);
  }, [mainCamera.position, mainCamera.quaternion]);

  // On route change, set up chained animation via default
  useEffect(() => {
    const routeTarget = getRouteTarget(location.pathname);
    endPos.current.copy(routeTarget.pos);
    endQuat.current.copy(routeTarget.quat);

    // capture current (what main camera currently shows)
    startPos.current.copy(mainCamera.position);
    startQuat.current.copy(mainCamera.quaternion);

    const startIsDefault =
      startPos.current.equals(midPos.current) && startQuat.current.equals(midQuat.current);
    const endIsDefault =
      endPos.current.equals(midPos.current) && endQuat.current.equals(midQuat.current);

    if (startIsDefault) {
      if (endIsDefault) {
        phaseRef.current = 0;
        // ensure main camera is exactly default
        mainCamera.position.copy(midPos.current);
        mainCamera.quaternion.copy(midQuat.current);
      } else {
        // only default -> end
        phaseRef.current = 2;
        tRef.current = 0;
        animCamRef.current.position.copy(midPos.current);
        animCamRef.current.quaternion.copy(midQuat.current);
      }
    } else {
      // do both phases: 1 then 2
      phaseRef.current = 1;
      tRef.current = 0;
      animCamRef.current.position.copy(startPos.current);
      animCamRef.current.quaternion.copy(startQuat.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useFrame((_, delta) => {
    const animCam = animCamRef.current;
    if (!animCam) return;

    if (phaseRef.current === 1) {
      const duration = 0.8;
      tRef.current = Math.min(1, tRef.current + delta / duration);
      const eased = easeInOut(tRef.current);
      // interpolate pos & quat
      animCam.position.copy(startPos.current.clone().lerp(midPos.current, eased));
      animCam.quaternion.slerpQuaternions(startQuat.current, midQuat.current, eased);
      // copy to main camera for rendering
      mainCamera.position.copy(animCam.position);
      mainCamera.quaternion.copy(animCam.quaternion);
      mainCamera.updateProjectionMatrix();

      if (tRef.current >= 1) {
        // advance to phase 2 or finish
        tRef.current = 0;
        if (endPos.current.equals(midPos.current) && endQuat.current.equals(midQuat.current)) {
          phaseRef.current = 0;
        } else {
          phaseRef.current = 2;
        }
      }
    } else if (phaseRef.current === 2) {
      const duration = 1.0;
      tRef.current = Math.min(1, tRef.current + delta / duration);
      const eased = easeInOut(tRef.current);
      animCam.position.copy(midPos.current.clone().lerp(endPos.current, eased));
      animCam.quaternion.slerpQuaternions(midQuat.current, endQuat.current, eased);
      mainCamera.position.copy(animCam.position);
      mainCamera.quaternion.copy(animCam.quaternion);
      mainCamera.updateProjectionMatrix();

      if (tRef.current >= 1) {
        phaseRef.current = 0;
        tRef.current = 0;
        // finalize on end
        mainCamera.position.copy(endPos.current);
        mainCamera.quaternion.copy(endQuat.current);
        mainCamera.updateProjectionMatrix();
      }
    }
  });

  return null; // no visual output; camera exists only for animation and copying
};

export default PageTransitionCamera;
