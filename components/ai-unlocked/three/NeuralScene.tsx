'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { NeuralNetwork } from './NeuralNetwork'
import { ParticleField } from './ParticleField'

export function NeuralScene({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetCamRef = useRef({ x: 0, y: 0, z: 8 })

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((_state, delta) => {
    // Camera z: zoom in as user scrolls (8 → 3)
    const targetZ = 8 - scrollProgress * 5
    targetCamRef.current.z += (targetZ - targetCamRef.current.z) * 0.05

    // Mouse parallax on camera x/y
    targetCamRef.current.x += (mouseRef.current.x * 0.3 - targetCamRef.current.x) * delta * 2
    targetCamRef.current.y += (mouseRef.current.y * 0.3 - targetCamRef.current.y) * delta * 2

    camera.position.x = targetCamRef.current.x
    camera.position.y = targetCamRef.current.y
    camera.position.z = targetCamRef.current.z
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#844bfe" />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#00ebc1" />
      <fog attach="fog" args={['#030108', 6, 18]} />
      <NeuralNetwork />
      <ParticleField />
    </>
  )
}
