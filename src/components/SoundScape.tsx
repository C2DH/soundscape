import React, { useMemo } from 'react'
import * as THREE from 'three'

type SoundScapeProps = {
  lists: number[][]
  showWireframe?: boolean
}

const SoundScape: React.FC<SoundScapeProps> = ({ lists, showWireframe }) => {
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
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color='red'
        side={THREE.DoubleSide}
        wireframe={showWireframe}
      />
    </mesh>
  )
}

export default SoundScape
