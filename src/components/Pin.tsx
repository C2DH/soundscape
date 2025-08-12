import type { Vector3 } from 'three'
import type { GeoPoint } from '../types'
import { Html } from '@react-three/drei'

export interface PinProps {
  point: GeoPoint // The geographical point data
  position: Vector3 // [x, y, z] coordinates in 3D space
  color?: string // Optional color for the pin
  onClick: (point: GeoPoint) => void // Callback when the pin is clicked
}

const Pin: React.FC<PinProps> = ({ point, position, color, onClick }) => {
  return (
    <group position={position}>
      <Html>
        <div className='bg-white p-2 rounded shadow'>
          <h3 className='text-sm font-bold'>{point.id || 'Unnamed'}</h3>
          <p className='text-xs text-gray-600'>
            {point.description || 'No description available.'}
          </p>
        </div>
      </Html>
      <mesh
        onClick={() => onClick(point)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={point.color || color || 'yellow'} />
      </mesh>
    </group>
  )
}

export default Pin
