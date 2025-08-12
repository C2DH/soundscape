import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import vertexEarth from "../shaders/earth/planet/vertex.glsl?raw";
import fragmentEarth from "../shaders/earth/planet/fragment.glsl?raw";
import vertexAtmosphere from "../shaders/earth/atmosphere/vertex.glsl?raw";
import fragmentAtmosphere from "../shaders/earth/atmosphere/fragment.glsl?raw";

type EarthProps = {
  maskUrl: string; // black&white texture: white = continents, black = water (you can flip with `invert`)
  landColor?: string;
  waterColor?: string;
  invert?: boolean;
  radius?: number;
};


type AtmosphereProps = {
    radius: number;
    color?: string;
};

const Atmosphere: React.FC<AtmosphereProps> = ({ radius, color = '#E0D6FF' }) => {
    return (
        <mesh scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexAtmosphere}
                fragmentShader={fragmentAtmosphere}
                uniforms={{
                    atmosphereColor: { value: new THREE.Color(color) },
                }}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide} // atmosphere is rendered inside-out
                transparent
            />
        </mesh>
    );
};


const Earth: React.FC<EarthProps> = ({ maskUrl, landColor = "#58526A", waterColor = "#2A263C", invert = true, radius = 2 }) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const mask = useLoader(THREE.TextureLoader, maskUrl);
  mask.wrapS = mask.wrapT = THREE.RepeatWrapping;

  // simple shader that mixes two colors based on mask texture (white = land)
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  return (
    <group>
        <Atmosphere radius={2.8} />
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
            shininess: { value: 3.0 } // smaller = bigger light spot
            }}
        />
        </mesh>
    </group>
  );
}

export default Earth;