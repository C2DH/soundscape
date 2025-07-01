import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useStore } from '../store'

function RotatingCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    const currentItemId = useStore.getState().currentParamItemId

    // Target rotation based on itemId
    let targetX = 0
    if (currentItemId === '/item/djeurj') {
      targetX = Math.PI
    } else if (currentItemId === '/item/bliblib') {
      targetX = Math.PI * 2
    } // extend this as needed

    // Smoothly rotate towards targetX
    if (meshRef.current) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetX,
        0.05 // smoothing factor
      )
    }
  })

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color='skyblue' />
    </mesh>
  )
}

export default RotatingCube
