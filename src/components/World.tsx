import * as THREE from 'three'
import Earth from './Earth'
import type { GeoPoint } from '../types'
import { useEffect, useRef, useState } from 'react'
import { useWorldStore } from '../store'
import { latLonToVector3 } from '../geo'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
export interface WorldProps {
  geoPoints?: GeoPoint[]
  radius?: number
  controls: React.RefObject<OrbitControlsImpl>
  // onPointClick?: (point: GeoPoint) => void;
}

const World: React.FC<WorldProps> = ({
  geoPoints = [],
  radius = 5,
  // onPointClick = (point: GeoPoint) => {}
}) => {
  const { camera } = useThree() // get active camera
  const worldRef = useRef<THREE.Mesh>(null)
  const pointsGroupRef = useRef<THREE.Group>(null)
  const previousHighlightedPoint = useRef<GeoPoint | undefined>(undefined)
  const [pointDirection] = useState(new THREE.Vector3(0, 1, 0)) // Up vector of the Earth

  useFrame(() => {
    if (!worldRef.current) return
    // World direction from sphere center to camera
    const toCamera = new THREE.Vector3()
      .subVectors(camera.position, worldRef.current.position)
      .normalize()

    // Create a quaternion that rotates pointDirection → toCamera
    const quaternion = new THREE.Quaternion()
    quaternion.setFromUnitVectors(pointDirection, toCamera)

    // Apply rotation with easing
    worldRef.current.quaternion.slerp(quaternion, 0.05) // Smoothly rotate towards camera
    // worldRef.current.quaternion.setFromUnitVectors(pointDirection, toCamera) // Directly set the quaternion
    // worldRef.current.quaternion.copy(quaternion)
  })

  // Subscribe to highlightedPoint without triggering React re-renders
  useEffect(() => {
    const unsub = useWorldStore.subscribe((state) => {
      state.highlightedPoint
      if (
        state.highlightedPoint &&
        previousHighlightedPoint.current?.id !== state.highlightedPoint.id
      ) {
        previousHighlightedPoint.current = state.highlightedPoint
        // Example: Log or mutate something without re-render
        console.log('Highlighted point changed:', state.highlightedPoint)

        const targetPos = latLonToVector3(
          state.highlightedPoint.lat,
          state.highlightedPoint.lon,
          radius + 0.5
        )

        console.log(
          'Rotating earth towards:',
          state.highlightedPoint,
          targetPos
        )

        // Rotate the world towards the target position
        if (worldRef.current) {
          pointDirection.copy(targetPos).normalize()
        }
      }
    })
    return () => unsub()
  }, [])

  return (
    <group ref={worldRef}>
      <Earth radius={radius} />
      <group ref={pointsGroupRef}>
        {geoPoints.map((point, i) => {
          const position = latLonToVector3(point.lat, point.lon, radius + 0.02)
          return (
            <mesh key={i} position={position}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color={point.color || 'yellow'} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
export default World
