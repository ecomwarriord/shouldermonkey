import * as THREE from 'three'

// No GLSL shaders needed — additive blending creates the natural glow

interface EngineOptions {
  container: HTMLDivElement
  onReady: () => void
  onChapterChange: (chapter: number) => void
  scrollProgress: React.MutableRefObject<number>
  lenis: any | null
}

export class CinematicEngine {
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private nodesMesh!: THREE.InstancedMesh
  private nodeHalos!: THREE.InstancedMesh
  private accentMesh!: THREE.InstancedMesh
  private accentHalo!: THREE.InstancedMesh
  private lines!: THREE.LineSegments
  private particles!: THREE.Points
  private scrollTrigger: any = null
  private rafId = 0
  private startTime = performance.now()
  private destroyed = false
  private readonly NODE_COUNT = 80
  private readonly ACCENT_COUNT = 14
  private readonly PARTICLE_COUNT = 500
  private _resizeCleanup = () => {}
  private _lenisScrollHandler = () => {}

  constructor(private opts: EngineOptions) {
    this.init()
  }

  private async init() {
    const { container } = this.opts
    const W = window.innerWidth
    const H = window.innerHeight
    const isMobile = W < 768

    // Renderer — no postprocessing, additive blending is the glow
    this.renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2))
    this.renderer.setSize(W, H)
    this.renderer.setClearColor(0x000000, 1)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100)
    this.camera.position.set(0, 0, 8)

    this.buildScene()
    this.setupResize()
    this.animate()
    await this.setupGSAP()
    if (!this.destroyed) this.opts.onReady()
  }

  private buildScene() {
    const isMobile = window.innerWidth < 768
    const nodeCount = isMobile ? 45 : this.NODE_COUNT
    const accentCount = isMobile ? 6 : this.ACCENT_COUNT
    const particleCount = isMobile ? 0 : this.PARTICLE_COUNT

    // Materials — additive blending = natural glow where nodes cluster
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

    const sGeo = new THREE.SphereGeometry(1, 16, 12)
    this.nodesMesh = new THREE.InstancedMesh(sGeo, purpleMat, nodeCount)
    this.nodeHalos = new THREE.InstancedMesh(sGeo, purpleHaloMat, nodeCount)
    this.accentMesh = new THREE.InstancedMesh(sGeo, pinkMat, accentCount)
    this.accentHalo = new THREE.InstancedMesh(sGeo, pinkHaloMat, accentCount)
    this.nodesMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.nodeHalos.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.accentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.accentHalo.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.scene.add(this.nodesMesh, this.nodeHalos, this.accentMesh, this.accentHalo)

    // Node positions — same distribution as original NeuralWorldCanvas
    const nPos: THREE.Vector3[] = []
    const nScale: number[] = []
    const nDelay: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      const isOuter = i < nodeCount * 0.35
      const minR = isOuter ? 4.5 : 1.5
      const maxR = isOuter ? 8.0 : 3.5
      const r = minR + Math.random() * (maxR - minR)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      nPos.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) * 0.45,
      ))
      nScale.push(0.05 + Math.random() * 0.09)
      nDelay.push(i / nodeCount * 2.0 + Math.random() * 0.3)
    }

    // Accent node positions
    const aPos: THREE.Vector3[] = []
    const aScale: number[] = []
    for (let i = 0; i < accentCount; i++) {
      const r = 2 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      aPos.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) * 0.45,
      ))
      aScale.push(0.065 + Math.random() * 0.10)
    }

    // Connection lines
    const lineVerts: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nPos[i].distanceTo(nPos[j]) < 2.9) {
          lineVerts.push(nPos[i].x, nPos[i].y, nPos[i].z, nPos[j].x, nPos[j].y, nPos[j].z)
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3))
    this.lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0x7B3FE4, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    this.scene.add(this.lines)

    // Ambient particles
    if (particleCount > 0) {
      const pPos = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3 + 0] = (Math.random() - 0.5) * 18
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 18
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 18
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3))
      this.particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0x6B2FD4, size: 0.02, transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
      }))
      this.scene.add(this.particles)
    }

    // Build-in: animate nodes appearing from nothing
    const dummy = new THREE.Object3D()
    const t = (performance.now() - this.startTime) * 0.001

    const updateMatrices = (elapsed: number) => {
      const buildProgress = Math.min(elapsed / 2.5, 1)
      for (let i = 0; i < nodeCount; i++) {
        const nodeProgress = Math.max(0, Math.min(1, (buildProgress - nDelay[i] / 2.5) * 5))
        const springScale = nodeProgress < 0.5
          ? 2 * nodeProgress * nodeProgress
          : 1 - Math.pow(-2 * nodeProgress + 2, 3) / 2
        const overshoot = nodeProgress > 0.7 ? 1 + Math.sin((nodeProgress - 0.7) * Math.PI * 3) * 0.06 : 1
        const s = nScale[i] * springScale * overshoot
        const pulse = 0.9 + 0.1 * Math.sin(i * 0.41 + elapsed * 0.85)
        dummy.position.copy(nPos[i])
        dummy.scale.setScalar(s * pulse)
        dummy.updateMatrix()
        this.nodesMesh.setMatrixAt(i, dummy.matrix)
        dummy.scale.setScalar(s * pulse * 3.5)
        dummy.updateMatrix()
        this.nodeHalos.setMatrixAt(i, dummy.matrix)
      }
      this.nodesMesh.instanceMatrix.needsUpdate = true
      this.nodeHalos.instanceMatrix.needsUpdate = true

      const accentBoost = 0.85 + 0.15 * Math.sin(elapsed * 1.5)
      for (let i = 0; i < accentCount; i++) {
        const progress = Math.min(elapsed / 2.0, 1)
        const pulse = 0.9 + 0.1 * Math.sin(i * 0.7 + elapsed * 1.2)
        const s = aScale[i] * 0.65 * progress * pulse * accentBoost
        dummy.position.copy(aPos[i])
        dummy.scale.setScalar(s)
        dummy.updateMatrix()
        this.accentMesh.setMatrixAt(i, dummy.matrix)
        dummy.scale.setScalar(s * 2.5)
        dummy.updateMatrix()
        this.accentHalo.setMatrixAt(i, dummy.matrix)
      }
      this.accentMesh.instanceMatrix.needsUpdate = true
      this.accentHalo.instanceMatrix.needsUpdate = true

      // Lines and particles fade in
      ;(this.lines.material as THREE.LineBasicMaterial).opacity = Math.min(buildProgress * 1.5, 1) * 0.22
      if (this.particles) {
        ;(this.particles.material as THREE.PointsMaterial).opacity = Math.min(elapsed / 3, 1) * 0.32
      }
    }

    // Store for use in animate loop
    this._updateMatrices = updateMatrices
    this._nPos = nPos
    this._aPos = aPos
    this._nScale = nScale
    this._aScale = aScale
    this._nDelay = nDelay
    this._nodeCount = nodeCount
    this._accentCount = accentCount
  }

  private _updateMatrices: (elapsed: number) => void = () => {}
  private _nPos: THREE.Vector3[] = []
  private _aPos: THREE.Vector3[] = []
  private _nScale: number[] = []
  private _aScale: number[] = []
  private _nDelay: number[] = []
  private _nodeCount = 80
  private _accentCount = 14

  private async setupGSAP() {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    this.scrollTrigger = ScrollTrigger

    // Wire Lenis proxy (council fix)
    if (this.opts.lenis) {
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop: (value?: number) => {
          if (value !== undefined && this.opts.lenis) {
            this.opts.lenis.scrollTo(value, { immediate: true })
          }
          return this.opts.lenis?.scroll ?? window.scrollY
        },
        getBoundingClientRect: () => ({
          top: 0, left: 0, width: window.innerWidth, height: window.innerHeight,
        }),
      })
      this.opts.lenis.on('scroll', ScrollTrigger.update)
      this._lenisScrollHandler = ScrollTrigger.update
    }

    const storyEl = document.querySelector('[data-cinematic-story]')
    if (!storyEl) return

    ScrollTrigger.create({
      trigger: storyEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        if (this.destroyed) return
        this.opts.scrollProgress.current = self.progress
        const p = self.progress
        const chapter = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.6 ? 2 : p < 0.8 ? 3 : 4
        this.opts.onChapterChange(chapter)
        // Slow drift of the whole network based on scroll
        this.scene.rotation.y = p * 0.3
      },
    })
  }

  private animate = () => {
    if (this.destroyed) return
    this.rafId = requestAnimationFrame(this.animate)
    const elapsed = (performance.now() - this.startTime) * 0.001
    this._updateMatrices(elapsed)
    if (this.particles) {
      this.particles.rotation.y += 0.0002
      this.particles.rotation.x += 0.0001
    }
    this.renderer.render(this.scene, this.camera)
  }

  private setupResize() {
    const onResize = () => {
      if (this.destroyed) return
      const W = window.innerWidth, H = window.innerHeight
      this.camera.aspect = W / H
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(W, H)
      this.scrollTrigger?.refresh()
    }
    window.addEventListener('resize', onResize)
    this._resizeCleanup = () => window.removeEventListener('resize', onResize)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.rafId)
    this._resizeCleanup()
    if (this.opts.lenis && this._lenisScrollHandler) {
      this.opts.lenis.off('scroll', this._lenisScrollHandler)
    }
    this.scrollTrigger?.getAll().forEach((t: any) => t.kill())
    this.renderer.dispose()
    const canvas = this.renderer.domElement
    if (canvas.parentElement) canvas.parentElement.removeChild(canvas)
  }
}
