import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import { easeOutQuint } from '../easing'

export type SoundLineProps = {
  points: THREE.Vector3[]
  color?: string
  lineWidth?: number
  tweenDuration?: number // in milliseconds
  easing?: (t: number) => number // easing function for tweening
}

// Linear interpolation between two Vector3 points
const lerpVector3 = (
  start: THREE.Vector3,
  end: THREE.Vector3,
  t: number
): THREE.Vector3 => {
  return new THREE.Vector3(
    start.x + (end.x - start.x) * t,
    start.y + (end.y - start.y) * t,
    start.z + (end.z - start.z) * t
  )
}

const SoundLine: React.FC<SoundLineProps> = ({
  points,
  color = 'cyan',
  lineWidth = 0.5,
  tweenDuration = 500,
  easing = easeOutQuint,
}) => {
  const lineRef = useRef<Line2 | null>(null)
  const { size } = useThree()

  // animation state
  const isAnimatingRef = useRef<boolean>(false)
  const startPointsRef = useRef<THREE.Vector3[]>([])
  const targetPointsRef = useRef<THREE.Vector3[]>([])
  const currentPointsRef = useRef<THREE.Vector3[]>(points)
  const animationStartTimeRef = useRef<number>(0)
  const positionsBufferRef = useRef<Float32Array>(
    new Float32Array(points.length * 3)
  )

  const resolution = useMemo(
    () => new THREE.Vector2(size.width, size.height),
    [size]
  )

  // Initialize positions buffer
  const updatePositionsBuffer = (points: THREE.Vector3[]) => {
    points.forEach((p, i) => {
      positionsBufferRef.current[i * 3] = p.x
      positionsBufferRef.current[i * 3 + 1] = p.y
      positionsBufferRef.current[i * 3 + 2] = p.z
    })
  }

  // Start tween animation when points change
  useEffect(() => {
    if (startPointsRef.current.length === 0) {
      // First render - no animation needed
      startPointsRef.current = [...points]
      currentPointsRef.current = [...points]
      updatePositionsBuffer(points)
      return
    }

    if (points.length !== startPointsRef.current.length) {
      console.warn(
        'SoundLine: Points array length changed, no tweening applied'
      )
      startPointsRef.current = [...points]
      currentPointsRef.current = [...points]
      updatePositionsBuffer(points)
      return
    }

    // Check if points actually changed
    const hasChanged = points.some((point, index) => {
      const current = startPointsRef.current[index]
      return !point.equals(current)
    })

    if (!hasChanged) return

    // Start animation
    startPointsRef.current = [...currentPointsRef.current] // Current becomes start
    targetPointsRef.current = [...points] // New points become target
    isAnimatingRef.current = true
    animationStartTimeRef.current = performance.now()
  }, [points])

  // Animation frame loop
  useFrame(() => {
    if (!isAnimatingRef.current || !lineRef.current) return

    const now = performance.now()
    const elapsed = now - animationStartTimeRef.current
    const progress = Math.min(elapsed / tweenDuration, 1)
    const easedProgress = easing(progress)

    // Interpolate between start and target points directly into current points
    for (let i = 0; i < startPointsRef.current.length; i++) {
      const startPoint = startPointsRef.current[i]
      const targetPoint = targetPointsRef.current[i]

      currentPointsRef.current[i] = lerpVector3(
        startPoint,
        targetPoint,
        easedProgress
      )
    }

    // Update positions buffer
    updatePositionsBuffer(currentPointsRef.current)

    // Update geometry directly
    const geometry = lineRef.current.geometry as LineGeometry
    geometry.setPositions(positionsBufferRef.current)
    lineRef.current.computeLineDistances()

    if (progress >= 1) {
      // Animation complete
      isAnimatingRef.current = false
    }
  })

  const line = useMemo(() => {
    // Initialize with current points
    updatePositionsBuffer(currentPointsRef.current)

    const geometry = new LineGeometry()
    geometry.setPositions(positionsBufferRef.current)
    const material = new LineMaterial({
      color,
      linewidth: lineWidth,
      resolution,
      worldUnits: true,
      depthTest: true,
      transparent: true,
    })
    const line = new Line2(geometry, material)
    line.computeLineDistances()
    return line
  }, [color, lineWidth, resolution]) // Removed positions dependency

  return <primitive object={line} ref={lineRef} />
}

export default SoundLine
