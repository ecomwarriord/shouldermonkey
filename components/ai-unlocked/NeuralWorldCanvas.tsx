'use client'

/**
 * Full-screen Three.js neural network — the entire visual experience.
 * Pure vanilla Three.js (no R3F) for maximum reliability.
 *
 * Features:
 * - Nodes build from centre with particle burst on appearance (FlutterFX celebrate port)
 * - Additive blending = natural glow without postprocessing
 * - Hot-pink accent nodes for "locked" knowledge (unlocked by scroll)
 * - Camera drifts through the network as user scrolls (5 chapters)
 * - Deep particle field for atmosphere
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Props {
  scrollRef: React.MutableRefObject<number>
  onReady: () => void
}

// ── Shared geometry ───────────────────────────────────────────────────────────
function createSphereGeo() { return new THREE.SphereGeometry(1, 16, 12) }

// ── Generate sphere-distributed positions ────────────────────────────────────
function sphereRandom(minR: number, maxR: number, zSquash = 0.65) {
  const r = minR + Math.random() * (maxR - minR)
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi) * zSquash
  )
}

export function NeuralWorldCanvas({ scrollRef, onReady }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = window.innerWidth, H = window.innerHeight
    const isMobile = W < 768

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 1)
    el.appendChild(renderer.domElement)

    // ── Scene + Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(65, W / H, 0.1, 120)
    cam.position.set(0, 0, 12)

    const NODE_COUNT = isMobile ? 45 : 80
    const ACCENT_COUNT = isMobile ? 6 : 14
    const PARTICLE_COUNT = isMobile ? 600 : 1400

    // ── Materials (additive blending = free glow) ─────────────────────────────
    const purpleMat = new THREE.MeshBasicMaterial({
      color: 0x7B3FE4, transparent: true, opacity: 0.92,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const purpleHaloMat = new THREE.MeshBasicMaterial({
      color: 0x7B3FE4, transparent: true, opacity: 0.1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const pinkMat = new THREE.MeshBasicMaterial({
      color: 0xFF3366, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const pinkHaloMat = new THREE.MeshBasicMaterial({
      color: 0xFF3366, transparent: true, opacity: 0.14,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x7B3FE4, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particleMat = new THREE.PointsMaterial({
      color: 0x6B2FD4, size: isMobile ? 0.016 : 0.02,
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const sGeo = createSphereGeo()
    const nodesMesh  = new THREE.InstancedMesh(sGeo, purpleMat, NODE_COUNT)
    const nodeHalos  = new THREE.InstancedMesh(sGeo, purpleHaloMat, NODE_COUNT)
    const accentMesh = new THREE.InstancedMesh(sGeo, pinkMat, ACCENT_COUNT)
    const accentHalo = new THREE.InstancedMesh(sGeo, pinkHaloMat, ACCENT_COUNT)
    nodesMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    nodeHalos.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    accentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    accentHalo.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(nodesMesh, nodeHalos, accentMesh, accentHalo)

    // ── Node positions + metadata ─────────────────────────────────────────────
    const nPos: THREE.Vector3[] = []
    const nScale: number[] = []
    const nDelay: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      // Mix: inner cluster (behind text) + outer ring (fills viewport edges)
      const minR = i < NODE_COUNT * 0.35 ? 1.5 : 4.5
      const maxR = i < NODE_COUNT * 0.35 ? 3.5 : 8.0
      nPos.push(sphereRandom(minR, maxR, 0.45)) // flat z = spreads wide across viewport
      nScale.push(0.04 + Math.random() * 0.09)
      nDelay.push(i / NODE_COUNT * 2.0 + Math.random() * 0.3)
    }
    const aPos: THREE.Vector3[] = []
    const aScale: number[] = []
    for (let i = 0; i < ACCENT_COUNT; i++) {
      aPos.push(sphereRandom(2, 5))
      aScale.push(0.075 + Math.random() * 0.11)
    }

    // ── Connection lines ──────────────────────────────────────────────────────
    const lineVerts: number[] = []
    for (let i = 0; i < NODE_COUNT; i++)
      for (let j = i + 1; j < NODE_COUNT; j++)
        if (nPos[i].distanceTo(nPos[j]) < 2.9)
          lineVerts.push(nPos[i].x,nPos[i].y,nPos[i].z, nPos[j].x,nPos[j].y,nPos[j].z)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3))
    scene.add(new THREE.LineSegments(lineGeo, lineMat))

    // ── Burst particles (FlutterFX celebrate burst port) ──────────────────────
    // Each node has a small set of particles that burst outward on appearance
    const BURST_PER_NODE = 8
    const BURST_TOTAL = NODE_COUNT * BURST_PER_NODE
    const burstPositions = new Float32Array(BURST_TOTAL * 3)
    const burstVelocities: THREE.Vector3[] = []
    const burstBirthTimes: number[] = []
    const burstNodeIdx: number[] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let b = 0; b < BURST_PER_NODE; b++) {
        const idx = i * BURST_PER_NODE + b
        burstPositions[idx * 3 + 0] = nPos[i].x
        burstPositions[idx * 3 + 1] = nPos[i].y
        burstPositions[idx * 3 + 2] = nPos[i].z
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        ).normalize().multiplyScalar(0.3 + Math.random() * 0.5)
        burstVelocities.push(vel)
        burstBirthTimes.push(-999) // not yet born
        burstNodeIdx.push(i)
      }
    }

    const burstGeo = new THREE.BufferGeometry()
    burstGeo.setAttribute('position', new THREE.Float32BufferAttribute(burstPositions, 3))
    const burstMat = new THREE.PointsMaterial({
      color: 0xFF3366, size: 0.04, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    })
    const burstPoints = new THREE.Points(burstGeo, burstMat)
    scene.add(burstPoints)

    // ── Ambient particle field ────────────────────────────────────────────────
    const pPositions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = sphereRandom(0, 10, 1)
      pPositions[i*3+0] = p.x; pPositions[i*3+1] = p.y; pPositions[i*3+2] = p.z
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3))
    const pMesh = new THREE.Points(pGeo, particleMat)
    scene.add(pMesh)

    // ── Animation state ───────────────────────────────────────────────────────
    const dummy = new THREE.Object3D()
    const camTarget = cam.position.clone()
    let rafId = 0
    let readyDone = false
    const startMs = performance.now()
    const nodeAlive = new Array(NODE_COUNT).fill(false) // tracks which nodes have been born

    function animate() {
      rafId = requestAnimationFrame(animate)
      const t = (performance.now() - startMs) * 0.001 // seconds
      const sp = Math.max(0, Math.min(1, scrollRef.current))

      // ── Build-in: nodes spring into existence over first 2.5s ──────────────
      for (let i = 0; i < NODE_COUNT; i++) {
        const born = t > nDelay[i]
        const progress = born ? Math.min((t - nDelay[i]) * 4, 1) : 0
        // Spring overshoot: use a custom ease that bounces slightly
        const spring = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        const overshoot = progress > 0.7 ? 1 + Math.sin((progress - 0.7) * Math.PI * 3) * 0.08 : 1
        const s = nScale[i] * spring * overshoot
        const pulse = 0.9 + 0.1 * Math.sin(i * 0.41 + t * 0.85)

        dummy.position.copy(nPos[i])
        dummy.scale.setScalar(s * pulse)
        dummy.updateMatrix()
        nodesMesh.setMatrixAt(i, dummy.matrix)

        dummy.scale.setScalar(s * pulse * 3.8)
        dummy.updateMatrix()
        nodeHalos.setMatrixAt(i, dummy.matrix)

        // Fire burst particles when node first appears
        if (born && !nodeAlive[i]) {
          nodeAlive[i] = true
          const bStart = i * BURST_PER_NODE
          for (let b = 0; b < BURST_PER_NODE; b++) {
            burstBirthTimes[bStart + b] = t
          }
        }
      }
      nodesMesh.instanceMatrix.needsUpdate = true
      nodeHalos.instanceMatrix.needsUpdate = true

      // Accent nodes pulse with urgency, scroll-reactive intensity
      const accentBoost = 0.85 + 0.15 * Math.sin(t * 1.5)
      for (let i = 0; i < ACCENT_COUNT; i++) {
        const born = t > 0.5
        const progress = born ? Math.min((t - 0.5) * 3, 1) : 0
        const pulse = 0.9 + 0.1 * Math.sin(i * 0.7 + t * 1.2)
        const s = aScale[i] * 0.6 * progress * pulse * accentBoost // 0.6 reduces base size

        dummy.position.copy(aPos[i])
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        accentMesh.setMatrixAt(i, dummy.matrix)

        dummy.scale.setScalar(s * 2.5) // 2.5x halo instead of 4.5x — controlled glow
        dummy.updateMatrix()
        accentHalo.setMatrixAt(i, dummy.matrix)
      }
      accentMesh.instanceMatrix.needsUpdate = true
      accentHalo.instanceMatrix.needsUpdate = true

      // ── Burst particle physics ──────────────────────────────────────────────
      const burstPosAttr = burstGeo.attributes.position as THREE.BufferAttribute
      const burstArr = burstPosAttr.array as Float32Array
      let anyBurstActive = false
      for (let i = 0; i < BURST_TOTAL; i++) {
        const birth = burstBirthTimes[i]
        if (birth < 0) continue
        const age = t - birth
        const BURST_LIFE = 0.6
        if (age > BURST_LIFE) continue
        anyBurstActive = true
        const frac = age / BURST_LIFE
        const decay = 1 - frac * frac
        const nodeIdx = burstNodeIdx[i]
        const vel = burstVelocities[i]
        burstArr[i*3+0] = nPos[nodeIdx].x + vel.x * age * 3
        burstArr[i*3+1] = nPos[nodeIdx].y + vel.y * age * 3
        burstArr[i*3+2] = nPos[nodeIdx].z + vel.z * age * 3
        // We can't per-particle set opacity, use mat opacity driven by first burst age
        burstMat.opacity = 0.9 * decay
      }
      if (anyBurstActive) burstPosAttr.needsUpdate = true

      // ── Line and particle opacity ───────────────────────────────────────────
      const buildComplete = Math.min(t / 2.5, 1)
      lineMat.opacity = buildComplete * 0.22
      particleMat.opacity = Math.min(t / 3, 1) * 0.32

      // ── Camera: 5 chapters tied to scroll progress ─────────────────────────
      // Ease function for smooth chapter transitions
      const ease = (x: number) => x < 0.5 ? 2*x*x : 1-Math.pow(-2*x+2,2)/2

      let tx = 0, ty = 0, tz = 12

      if (sp < 0.2) {
        const e = ease(sp / 0.2)
        tz = 12 - e * 2.5;  ty = e * 0.4
      } else if (sp < 0.4) {
        const e = ease((sp - 0.2) / 0.2)
        tz = 9.5 - e * 4;  tx = -e * 2;  ty = 0.4 + e * 0.8
      } else if (sp < 0.6) {
        const e = ease((sp - 0.4) / 0.2)
        tz = 5.5 - e * 1.5;  tx = -2 + e * 4;  ty = 1.2 - e * 1.4
      } else if (sp < 0.8) {
        const e = ease((sp - 0.6) / 0.2)
        tz = 4 + e * 5;  tx = 2 - e * 2;  ty = -0.2 + e * 0.7
      } else {
        const e = ease((sp - 0.8) / 0.2)
        tz = 9 + e * 2.5;  tx = 0;  ty = 0.5 - e * 0.5
      }

      // Add gentle drift while idle
      const drift = 0.06
      tx += Math.sin(t * 0.18) * drift
      ty += Math.cos(t * 0.14) * drift

      camTarget.set(tx, ty, tz)
      cam.position.lerp(camTarget, 0.028)
      cam.lookAt(0, 0, 0)

      // Slowly rotate ambient particles
      pMesh.rotation.y += 0.00018
      pMesh.rotation.x += 0.00009

      if (!readyDone && t > 0.3) { readyDone = true; onReady() }

      renderer.render(scene, cam)
    }

    animate()

    // ── Resize ────────────────────────────────────────────────────────────────
    function onResize() {
      const w = window.innerWidth, h = window.innerHeight
      cam.aspect = w / h
      cam.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      sGeo.dispose(); lineGeo.dispose(); pGeo.dispose(); burstGeo.dispose()
      ;[purpleMat,purpleHaloMat,pinkMat,pinkHaloMat,lineMat,particleMat,burstMat].forEach(m=>m.dispose())
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [onReady, scrollRef])

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000' }}
      aria-hidden="true"
    />
  )
}
