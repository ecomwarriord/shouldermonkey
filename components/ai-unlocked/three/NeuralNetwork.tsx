'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { nodeVert } from './shaders/node.vert'
import { nodeFrag } from './shaders/node.frag'

const NODE_COUNT = 60
const SPREAD = 5

function randomInSphere(r: number) {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const rr = r * Math.cbrt(Math.random())
  return new THREE.Vector3(
    rr * Math.sin(phi) * Math.cos(theta),
    rr * Math.sin(phi) * Math.sin(theta),
    rr * Math.cos(phi)
  )
}

export function NeuralNetwork({ buildProgress = 1 }: { buildProgress?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const time = useRef(0)

  const { positions, linePositions, nodeDelays } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const nodeDelays: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      positions.push(randomInSphere(SPREAD))
      nodeDelays.push(Math.random())
    }

    const linePositions: number[] = []
    const MAX_DIST = 2.8
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < MAX_DIST) {
          linePositions.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          )
        }
      }
    }
    return { positions, linePositions, nodeDelays }
  }, [])

  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: nodeVert,
      fragmentShader: nodeFrag,
      uniforms: { uTime: { value: 0 }, uBuild: { value: 0 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    materialRef.current = mat
    return mat
  }, [])

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(1, 20, 20), [])

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    return g
  }, [linePositions])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: 0x7B3FE4,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  }), [])

  // Set instance matrices
  useEffect(() => {
    if (!meshRef.current) return
    const m = new THREE.Matrix4()
    positions.forEach((pos, i) => {
      const s = 0.055 + Math.random() * 0.07
      m.makeScale(s, s, s)
      m.setPosition(pos)
      meshRef.current!.setMatrixAt(i, m)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions])

  useFrame((_s, delta) => {
    time.current += delta
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time.current
      materialRef.current.uniforms.uBuild.value = buildProgress
    }
    // Line opacity follows build progress
    if (linesRef.current) {
      ;(linesRef.current.material as THREE.LineBasicMaterial).opacity = buildProgress * 0.25
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
      groupRef.current.rotation.x = Math.sin(time.current * 0.12) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[sphereGeo, shaderMaterial, NODE_COUNT]} />
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} />
    </group>
  )
}
