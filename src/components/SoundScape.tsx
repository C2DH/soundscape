import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

type SoundScapeProps = {
  lists: number[][]
  showWireframe?: boolean
}

const SoundScape: React.FC<SoundScapeProps> = ({ lists, showWireframe }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const intersectionRef = useRef<THREE.Vector3 | null>(null)
  const markerRef = useRef<THREE.Mesh>(null)

  const raycaster = useRef(new THREE.Raycaster()).current
  const mouse = useRef(new THREE.Vector2()).current
  const { camera, gl } = useThree()

  const handlePointerMove = (event: React.PointerEvent) => {
    mouse.x = (event.clientX / gl.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / gl.domElement.clientHeight) * 2 + 1
  }
  useFrame(() => {
    if (!meshRef.current) return

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(meshRef.current, true)
    if (intersects.length > 0) {
      const point = intersects[0].point
      intersectionRef.current = point

      if (markerRef.current) {
        markerRef.current.position.copy(point)
        markerRef.current.visible = true
      }
    } else {
      if (markerRef.current) {
        markerRef.current.visible = false
      }
    }
  })
  const geometry = useMemo(() => {
    const timeLength = lists.length
    const listLength = lists[0]?.length ?? 0

    const vertices: number[] = []
    const indices: number[] = []

    // Generate vertex positions
    for (let t = 0; t < timeLength; t++) {
      const yList = lists[t]
      for (let x = 0; x < listLength; x++) {
        const y = yList[x]
        vertices.push(x, y, t) // x = index, y = value, z = time
      }
    }

    // Generate indices to form triangles
    for (let t = 0; t < timeLength - 1; t++) {
      for (let x = 0; x < listLength - 1; x++) {
        const a = t * listLength + x
        const b = a + 1
        const c = a + listLength
        const d = c + 1

        indices.push(a, b, c) // triangle 1
        indices.push(b, d, c) // triangle 2
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    return geometry
  }, [lists])

  return (
    <>
      <mesh geometry={geometry} ref={meshRef} onPointerMove={handlePointerMove}>
        <meshStandardMaterial
          color='red'
          side={THREE.DoubleSide}
          wireframe={showWireframe}
        />
      </mesh>
      {/* Marker for intersection point */}
      <mesh ref={markerRef} visible={false}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color='yellow' />
      </mesh>
    </>
  )
}

export default SoundScape
