import * as THREE from 'three'
import { cinematicVert } from './three/shaders/cinematic.vert'
import { cinematicFrag } from './three/shaders/cinematic.frag'

// three/addons path for three@0.183+
// Using dynamic import to avoid SSR issues with these ESM modules
type EffectComposerType = any
type UnrealBloomPassType = any

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
  private composer!: EffectComposerType
  private network!: THREE.InstancedMesh
  private lines!: THREE.LineSegments
  private pointLight!: THREE.PointLight
  private material!: THREE.ShaderMaterial
  private timeline: any = null
  private scrollTrigger: any = null
  private rafId = 0
  private startTime = performance.now()
  private destroyed = false
  private readonly NODE_COUNT = 80
  private _resizeCleanup = () => {}
  private _lenisScrollHandler = () => {}

  constructor(private opts: EngineOptions) {
    this.init()
  }

  private async init() {
    const { container } = this.opts
    const W = window.innerWidth
    const H = window.innerHeight

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(W, H)
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.0
    container.appendChild(this.renderer.domElement)

    // Scene + Camera
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 100)
    this.camera.position.set(0, 0, 8)

    // Build neural network geometry
    this.buildNetwork()

    // Postprocessing via 'postprocessing' package (v6, already in node_modules)
    try {
      const { EffectComposer, RenderPass, BloomEffect, EffectPass } = await import('postprocessing' as any)
      this.composer = new EffectComposer(this.renderer)
      this.composer.addPass(new RenderPass(this.scene, this.camera))
      const bloom = new BloomEffect({
        intensity: 0.8,
        luminanceThreshold: 0.4, // council fix: raised from 0.15 to prevent text area washout
        luminanceSmoothing: 0.9,
        mipmapBlur: true,
      })
      this.composer.addPass(new EffectPass(this.camera, bloom))
    } catch {
      // Graceful degradation — render without bloom
      this.composer = {
        render: () => this.renderer.render(this.scene, this.camera),
        setSize: (_w: number, _h: number) => {},
      }
    }

    this.setupResize()
    this.animate()
    await this.setupGSAP()
    if (!this.destroyed) this.opts.onReady()
  }

  private buildNetwork() {
    // Generate positions — wide spread, sense of vastness and possibility
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < this.NODE_COUNT; i++) {
      const isOuter = i > this.NODE_COUNT * 0.4
      const minR = isOuter ? 5 : 1.5
      const maxR = isOuter ? 9 : 4
      const r = minR + Math.random() * (maxR - minR)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) * 0.4,
      ))
    }

    // GLSL ShaderMaterial
    this.material = new THREE.ShaderMaterial({
      vertexShader: cinematicVert,
      fragmentShader: cinematicFrag,
      uniforms: {
        uTime: { value: 0 },
        uPointLightPos: { value: new THREE.Vector3(0, 0, 12) },
        uPointLightIntensity: { value: 0.5 },
        uBaseColor: { value: new THREE.Color(0x7B3FE4) },
        uAccentColor: { value: new THREE.Color(0xFF3366) },
      },
      transparent: true,
      depthWrite: false,
    })

    // InstancedMesh — 1 draw call for all nodes
    const geo = new THREE.SphereGeometry(1, 18, 12)
    this.network = new THREE.InstancedMesh(geo, this.material, this.NODE_COUNT)
    this.network.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.scene.add(this.network)

    // Set all instance matrices (required before first render)
    const dummy = new THREE.Object3D()
    positions.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.045 + Math.random() * 0.08)
      dummy.updateMatrix()
      this.network.setMatrixAt(i, dummy.matrix)
    })
    this.network.instanceMatrix.needsUpdate = true // REQUIRED — council finding

    // Connection lines — 1 draw call
    const lineVerts: number[] = []
    for (let i = 0; i < this.NODE_COUNT; i++) {
      for (let j = i + 1; j < this.NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < 3.2) {
          lineVerts.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z,
          )
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3))
    this.lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0x7B3FE4,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
    this.scene.add(this.lines)

    // PointLight — descends through network on scroll
    this.pointLight = new THREE.PointLight(0x7B3FE4, 0.5, 25, 2)
    this.pointLight.position.set(0, 0, 12)
    this.scene.add(this.pointLight)
  }

  private async setupGSAP() {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    this.scrollTrigger = ScrollTrigger

    // CRITICAL: wire ScrollTrigger to Lenis scroll position (council finding #1)
    if (this.opts.lenis) {
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop: (value?: number) => {
          if (value !== undefined && this.opts.lenis) {
            this.opts.lenis.scrollTo(value, { immediate: true })
          }
          return this.opts.lenis?.scroll ?? window.scrollY
        },
        getBoundingClientRect: () => ({
          top: 0, left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      })
      this.opts.lenis.on('scroll', ScrollTrigger.update)
      this._lenisScrollHandler = ScrollTrigger.update
    }

    // Master timeline — progress() is driven by scroll scrub
    const tl = gsap.timeline({ paused: true })
    this.timeline = tl

    // PointLight descends: z=12 → z=-8, intensity 0.5 → 4
    const lightTarget = { z: 12, intensity: 0.5 }
    tl.to(lightTarget, {
      z: -8,
      intensity: 4,
      duration: 1,
      ease: 'none',
      onUpdate: () => {
        this.pointLight.position.z = lightTarget.z
        this.pointLight.intensity = lightTarget.intensity
        // Manual uniform sync — required for custom ShaderMaterial (council finding #3)
        this.material.uniforms.uPointLightPos.value.copy(this.pointLight.position)
        this.material.uniforms.uPointLightIntensity.value = lightTarget.intensity
      },
    }, 0)

    // Colour shift: purple → pink as light descends deeper
    tl.to({}, {
      duration: 0.4,
      ease: 'none',
      onUpdate: function() {
        // tl is captured in closure
      },
    }, 0.6)

    // Find story container
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
        tl.progress(self.progress)

        // Colour shift: purple at 0, pink at 0.8+
        const pinkAmount = Math.max(0, (self.progress - 0.5) * 2)
        this.material.uniforms.uBaseColor.value.setRGB(
          0.482 + (1.0 - 0.482) * pinkAmount,
          0.247 + (0.2 - 0.247) * pinkAmount,
          0.894 + (0.4 - 0.894) * pinkAmount,
        )

        // Chapter detection
        const p = self.progress
        const chapter = p < 0.2 ? 0 : p < 0.4 ? 1 : p < 0.6 ? 2 : p < 0.8 ? 3 : 4
        this.opts.onChapterChange(chapter)
      },
    })
  }

  private animate = () => {
    if (this.destroyed) return
    this.rafId = requestAnimationFrame(this.animate)
    const time = (performance.now() - this.startTime) * 0.001

    this.material.uniforms.uTime.value = time
    this.network.rotation.y += 0.00015
    this.lines.rotation.y += 0.00015

    this.composer.render()
  }

  private setupResize() {
    const onResize = () => {
      if (this.destroyed) return
      const W = window.innerWidth, H = window.innerHeight
      this.camera.aspect = W / H
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(W, H)
      this.composer.setSize?.(W, H)
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
