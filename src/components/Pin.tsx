import type { Vector3 } from 'three'
import type { GeoPoint } from '../types'

export interface PinProps {
  point: GeoPoint // The geographical point data
  position: Vector3 // [x, y, z] coordinates in 3D space
  color?: string // Optional color for the pin
  onClick: (point: GeoPoint) => void // Callback when the pin is clicked
}

const Pin: React.FC<PinProps> = ({ point, position, color, onClick }) => {
  return (
    <mesh
      position={position}
      onClick={() => onClick(point)}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={point.color || color || 'yellow'} />
    </mesh>
  )
}

export default Pin
