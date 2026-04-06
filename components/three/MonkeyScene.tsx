'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float, Environment, Torus } from '@react-three/drei'
import * as THREE from 'three'

/* ── Particle field ── */
function Particles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const sphere = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4.5 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * 0.04
    ref.current.rotation.y = state.clock.elapsedTime * 0.07
  })

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled>
      <PointMaterial
        transparent color="#844bfe" size={0.012}
        sizeAttenuation depthWrite={false} opacity={0.7}
      />
    </Points>
  )
}

/* ── Outer ring particles ── */
function RingParticles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)
  const ring = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = 3.5 + (Math.random() - 0.5) * 1.2
      positions[i * 3]     = Math.cos(angle) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4
      positions[i * 3 + 2] = Math.sin(angle) * r
    }
    return positions
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.15
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
  })

  return (
    <Points ref={ref} positions={ring} stride={3} frustumCulled>
      <PointMaterial
        transparent color="#00ebc1" size={0.018}
        sizeAttenuation depthWrite={false} opacity={0.6}
      />
    </Points>
  )
}

/* ── Central orb ── */
function CoreOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    // Mouse parallax
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.x * 0.4, 0.05)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, mouse.y * 0.3, 0.05)
  })

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.4, 128, 128]} />
        <MeshDistortMaterial
          color="#4623d3"
          emissive="#844bfe"
          emissiveIntensity={0.4}
          distort={0.35}
          speed={2.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

/* ── Orbiting torus rings ── */
function OrbitRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 200]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </mesh>
  )
}

/* ── Floating data nodes ── */
function DataNode({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15
    ref.current.rotation.x += 0.01
    ref.current.rotation.y += 0.015
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={color} emissive={color}
        emissiveIntensity={1.5} metalness={0.9} roughness={0.1}
      />
    </mesh>
  )
}

/* ── Scene camera mouse response ── */
function CameraRig() {
  const { camera, mouse } = useThree()

  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.03)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.3 + 0.2, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ── Full exported scene ── */
export default function MonkeyScene() {
  const nodes: { position: [number, number, number]; color: string }[] = [
    { position: [2.5, 1.2, 0.5],   color: '#00ebc1' },
    { position: [-2.8, 0.8, -0.3], color: '#ff0199' },
    { position: [1.8, -1.5, 0.8],  color: '#fec871' },
    { position: [-2.2, -1.2, 0.6], color: '#844bfe' },
    { position: [0.5, 2.2, -0.5],  color: '#00ebc1' },
    { position: [-0.8, -2.4, 0.3], color: '#ff0199' },
    { position: [3.0, -0.4, -0.7], color: '#a673ff' },
    { position: [-3.2, 0.2, 0.4],  color: '#fec871' },
  ]

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 55 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 6]} intensity={1.2} color="#844bfe" />
      <pointLight position={[4, 2, 0]} intensity={0.6} color="#00ebc1" />
      <pointLight position={[-4, -2, 0]} intensity={0.4} color="#ff0199" />
      <pointLight position={[0, -3, 3]} intensity={0.3} color="#fec871" />

      {/* Core */}
      <CoreOrb />

      {/* Rings */}
      <OrbitRing radius={2.2} speed={0.25}  color="#844bfe" tilt={0} />
      <OrbitRing radius={2.8} speed={-0.18} color="#00ebc1" tilt={Math.PI / 4} />
      <OrbitRing radius={3.4} speed={0.12}  color="#ff0199" tilt={Math.PI / 6} />

      {/* Particles */}
      <Particles count={2500} />
      <RingParticles count={600} />

      {/* Data nodes */}
      {nodes.map((n, i) => (
        <DataNode key={i} position={n.position} color={n.color} />
      ))}
    </Canvas>
  )
}
