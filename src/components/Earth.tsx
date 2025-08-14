import React, { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import vertexEarth from '../shaders/earth/planet/vertex.glsl?raw'
import fragmentEarth from '../shaders/earth/planet/fragment.glsl?raw'
import Atmosphere from './Atmosphere'
import PlanetLines from './PlanetLines'
import EarthBackground from './EarthBackground'


export type EarthProps = {
  maskUrl?: string // black&white texture: white = continents, black = water (you can flip with `invert`)
  landColor?: string
  waterColor?: string
  invert?: boolean
  radius?: number
   children?: React.ReactNode
}

const Earth: React.FC<EarthProps> = ({
  maskUrl = '/textures/continents_mask.jpg',
  landColor = '#58526A',
  waterColor = '#2A263C',
  invert = true,
  radius = 2,
  children, 
  ...props
}) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const mask = useLoader(THREE.TextureLoader, maskUrl)
  mask.wrapS = mask.wrapT = THREE.RepeatWrapping

  // simple shader that mixes two colors based on mask texture (white = land)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  return (
    <>
          <EarthBackground />
    <group {...props}>
      {/* <Atmosphere radius={2.8} /> */}

      <PlanetLines radius={radius} maskUrl={'/textures/continents_mask.jpg'} />
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
      {children}
    </group>
    </>
  )
}

export default Earth
