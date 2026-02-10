import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import vertexEarth from '../shaders/earth/planet/vertex.glsl?raw';
import fragmentEarth from '../shaders/earth/planet/fragment.glsl?raw';
import Atmosphere from './Atmosphere';
import PlanetLines from './PlanetLines';
import './Earth.css';
import EarthRipple from './EarthRipple';
import { useLocation } from 'react-router';
import { EarthMaskUrl } from '../constants';

export type EarthProps = {
  maskUrl?: string; // black&white texture: white = continents, black = water (you can flip with `invert`)
  landColor?: string;
  waterColor?: string;
  invert?: boolean;
  radius?: number;
  children?: React.ReactNode;
};

const Earth: React.FC<EarthProps> = ({
  maskUrl = EarthMaskUrl,
  landColor = '#58526A',
  waterColor = '#2A263C',
  invert = true,
  radius = 2,
  children,
  ...props
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const mask = useLoader(THREE.TextureLoader, maskUrl);
  const location = useLocation(); // to trigger re-render on location change
  const pathname = location.pathname;
  mask.wrapS = mask.wrapT = THREE.RepeatWrapping;

  // simple shader that mixes two colors based on mask texture (white = land)
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  return (
    <>
      <group {...props} position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]}>
        <PlanetLines radius={radius} maskUrl={maskUrl} />
        <Atmosphere radius={radius} />
        <mesh ref={mesh} rotation={[0, 0, 0]}>
          <sphereGeometry args={[radius, 64, 64]} />
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexEarth}
            fragmentShader={fragmentEarth}
            uniforms={{
              maskTex: { value: mask },
              landColor: { value: new THREE.Color(landColor) },
              waterColor: { value: new THREE.Color(waterColor) },
              invertMask: { value: invert },
              shininess: { value: 3.0 }, // smaller = bigger light spot
            }}
          />
        </mesh>
        <EarthRipple baseRadius={radius * 1.13} />
        {pathname == '/overview' && children}
      </group>
    </>
  );
};

export default Earth;
