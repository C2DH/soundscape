import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RotatingCube from './components/RotatingCube'
export default function World() {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.1, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      <RotatingCube />
      <OrbitControls />
    </Canvas>
  )
}
