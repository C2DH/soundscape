import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export type Props = {
  url: string
  segments?: number // number of segments per second, default 50
  durationSeconds?: number // duration to visualize (in seconds), default 10
}

const SoundScapeRealtime: React.FC<Props> = ({
  url,
  segments = 50,
  durationSeconds = 10,
}: Props) => {
  const { camera } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const listener = useRef<THREE.AudioListener>(null)
  const analyser = useRef<THREE.AudioAnalyser>(null)
  const audio = useRef<THREE.Audio>(null)

  // We'll build a grid of points:
  // x axis = time (seconds * segments)
  // z axis = segment index per second
  // y axis = amplitude from analyser waveform

  // Preallocate buffer attribute for positions (x, y, z) per vertex
  const totalPoints = durationSeconds * segments
  // We'll create a simple grid: width = durationSeconds, depth = segments
  // So vertices = totalPoints

  useEffect(() => {
    listener.current = new THREE.AudioListener()
    camera.add(listener.current)

    audio.current = new THREE.Audio(listener.current)
    const loader = new THREE.AudioLoader()
    loader.load(url, (buffer) => {
      if (!audio.current) return
      audio.current.setBuffer(buffer)
      audio.current.setLoop(true)
      audio.current.setVolume(0.5)
      audio.current.play()

      analyser.current = new THREE.AudioAnalyser(audio.current, 256)
    })

    return () => {
      if (listener.current) camera.remove(listener.current)
      audio.current?.stop()
      audio.current?.disconnect()
      analyser.current = undefined
    }
  }, [camera, url])

  // Initialize BufferGeometry with flat grid of points (x,z) with y=0
  useEffect(() => {
    if (!meshRef.current) return

    const positions = new Float32Array(totalPoints * 3)

    for (let i = 0; i < totalPoints; i++) {
      // x: time segment (seconds * segments)
      positions[i * 3 + 0] = i / segments // x in seconds (e.g., 0 to durationSeconds)
      positions[i * 3 + 1] = 0 // y = amplitude placeholder
      positions[i * 3 + 2] = i % segments // z = segment index (depth)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometryRef.current = geometry

    meshRef.current.geometry = geometry
  }, [segments, totalPoints])

  // Update the y (amplitude) values each frame from the analyser waveform
  useFrame(() => {
    if (!analyser.current || !geometryRef.current) return

    const analyserNode = analyser.current.analyser
    const waveform = new Uint8Array(analyserNode.fftSize)
    analyserNode.getByteTimeDomainData(waveform)

    const positions = geometryRef.current.attributes.position
      .array as Float32Array

    for (let i = 0; i < totalPoints; i++) {
      const waveIndex = Math.floor((i / totalPoints) * waveform.length)
      // Normalize from 0-255 to roughly -1 to +1 (centered at 128)
      const normalized = (waveform[waveIndex] - 128) / 128
      positions[i * 3 + 1] = normalized * 5 // amplify Y position
    }

    geometryRef.current.attributes.position.needsUpdate = true
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[durationSeconds, segments, totalPoints - 1, segments - 1]}
      />
      <meshStandardMaterial
        color='hotpink'
        wireframe
        side={THREE.DoubleSide}
        transparent
        opacity={0.75}
      />
    </mesh>
  )
}

export default SoundScapeRealtime
