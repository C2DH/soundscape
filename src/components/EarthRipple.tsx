import React, { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';
import { useModalStore } from '../store';

const EarthRipple: React.FC<{ count?: number; baseRadius?: number; duration?: number }> = ({
  count = 6,
  baseRadius = 6,
  duration = 6000,
}) => {
  const isOpen = useModalStore((s) => s.isOpenModal);

  const rings = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      // --- THICKNESS RANDOMIZATION ---
      // We define a substantial thickness (e.g., 0.3 to 0.8 units)
      const thickness = 0.2 + Math.random() * 0.6;

      // The geometry now has a clear, randomized width
      const geometry = new THREE.RingGeometry(baseRadius, baseRadius + thickness, 64);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDelay: { value: Math.random() * 5 },
          uDuration: { value: (duration / 1000) * (0.8 + Math.random() * 0.5) },
          uBaseScale: { value: 0.7 },
          uMaxScale: { value: 1.2 + Math.random() * 0.8 },
          uBaseOpacity: { value: 0.05 + Math.random() * 0.15 }, // Kept low for additive blending
        },
        vertexShader: `
          uniform float uTime;
          uniform float uDelay;
          uniform float uDuration;
          uniform float uBaseScale;
          uniform float uMaxScale;
          varying float vOpacity;
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            float localTime = mod(uTime + uDelay, uDuration);
            float progress = localTime / uDuration;
            
            // Non-linear scale for a more "explosive" start
            float easedProgress = pow(progress, 0.7);
            float scale = mix(uBaseScale, uMaxScale, easedProgress);
            
            vec3 pos = position * scale;
            
            // Pulse fade: fades in quickly, lingers, then fades out
            vOpacity = sin(progress * 3.14159); 
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uBaseOpacity;
          varying float vOpacity;
          varying vec2 vUv;
          
          void main() {
            // This creates a soft edge on the inner and outer part of the "thick" line
            // vUv.y in a RingGeometry goes from 0 (inner) to 1 (outer)
            float edgeSoftness = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            
            vec3 color = vec3(0.8, 0.92, 1.0);
            gl_FragColor = vec4(color, vOpacity * uBaseOpacity * edgeSoftness);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
      });

      return { material, geometry };
    });
  }, [count, duration, baseRadius]);

  useFrame((state) => {
    if (isOpen) return;
    const time = state.clock.elapsedTime;
    rings.forEach(({ material }) => {
      material.uniforms.uTime.value = time;
    });
  });

  useEffect(() => {
    return () => {
      rings.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      });
    };
  }, [rings]);

  return (
    <Billboard follow={true} renderOrder={-1}>
      {rings.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} />
      ))}
    </Billboard>
  );
};

export default EarthRipple;
