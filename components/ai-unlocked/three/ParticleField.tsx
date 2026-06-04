'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 500

export function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
      speeds[i] = 0.002 + Math.random() * 0.005
    }
    return { positions, speeds }
  }, [])

  const positionRef = useRef(positions.slice())

  useFrame((_state, delta) => {
    timeRef.current += delta
    if (!ref.current) return

    const pos = positionRef.current
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += speeds[i] * 60 * delta
      if (pos[i * 3 + 1] > 6) {
        pos[i * 3 + 1] = -6
        pos[i * 3 + 0] = (Math.random() - 0.5) * 12
        pos[i * 3 + 2] = (Math.random() - 0.5) * 12
      }
    }

    const geo = ref.current.geometry
    const attr = geo.attributes.position as THREE.BufferAttribute
    attr.array.set(pos)
    attr.needsUpdate = true
  })

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: 0xa673ff,
        size: 0.03,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  )

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionRef.current, 3]}
        />
      </bufferGeometry>
    </points>
  )
}
