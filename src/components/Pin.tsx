import { Vector3 } from 'three'
import * as THREE from 'three'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { GeoPoint } from '../types'
import { Html } from '@react-three/drei'

export interface PinProps {
  point: GeoPoint
  position: Vector3 // already computed local position
  color?: string
  onClick: (point: GeoPoint) => void
  children?: React.ReactNode
}

const Pin: React.FC<PinProps> = ({ point, position, color, onClick, children }) => {
  const ref = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Object3D<THREE.Object3DEventMap>>(null)
  const [isInRange, setInRange] = useState(false)
  const [isOccluded, setOccluded] = useState(false)
  const [isVisible, setVisible] = useState(true) // controlled by distance + occlusion

  const vec = new THREE.Vector3()

  useFrame((state) => {
    if (ref.current) {
      const distance = state.camera.position.distanceTo(ref.current.getWorldPosition(vec))

      const inRange = distance <= 100 // your existing range limit
      if (inRange !== isInRange) setInRange(inRange)

      // Hide Html if occluded or too far
      setVisible(inRange && !isOccluded && distance <= 4)
    }
  })

  return (
    <group
      position={[position.x, position.y, position.z + 0.01]} // small forward offset to reduce false occlusion
      ref={ref}
    >
      <Html
        distanceFactor={5} // scale factor relative to scene
        onOcclude={setOccluded}
        style={{
          transition: 'all 0.2s',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0.5}) translateY(calc(-100% + 10px )) translateX(-100%)`,
          transformOrigin: 'bottom center',
        }}
      >
        <div className='flex ' style={{ alignItems: 'center', transform: 'rotateZ(90deg)', textWrap: 'nowrap', textAlign: 'right',   transformOrigin: 'right',}}
        onClick={() => onClick(point)}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}>
          <h3 className="text-sm font-bold text-white">{point.id || 'Unnamed'}</h3>
          <span className='bg-white ml-1.5' style={{ display: 'inline-block', width: '20px', height: '2px', }}></span>
          <div className='cursor-pointer pointer-events-none w-[10px] h-[10px] rounded-full bg-white '></div>

          {/* <p className="text-xs text-gray-600">
            {point.description || 'No description available.'}
          </p> */}
        </div>
        {children}
      </Html>

      <mesh
        ref={meshRef}
        onClick={() => onClick(point)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[0.05, 2, 2]} />
        <meshStandardMaterial transparent opacity={0} color={point.color || color || 'yellow'} />
      </mesh>
    </group>
  )
}

export default Pin
