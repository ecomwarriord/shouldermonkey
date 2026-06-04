'use client'

import { Suspense, Component, type ReactNode, type ErrorInfo } from 'react'
import { Canvas } from '@react-three/fiber'
import { NeuralScene } from './NeuralScene'

interface Props { scrollProgress: number }

class R3FErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  componentDidCatch(e: Error, info: ErrorInfo) { console.error('[NeuralCanvas]', e, info) }
  render() {
    if (this.state.error) {
      console.error('[NeuralCanvas] R3F failed:', this.state.error)
      return this.props.fallback
    }
    return this.props.children
  }
}

function GradientFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(132,75,254,0.5) 0%, rgba(70,35,211,0.2) 50%, transparent 80%), ' +
          'radial-gradient(ellipse 40% 40% at 70% 60%, rgba(0,235,193,0.15) 0%, transparent 60%), ' +
          '#030108',
      }}
    />
  )
}

export function NeuralCanvas({ scrollProgress }: Props) {
  return (
    <div className="absolute inset-0" aria-hidden="true" role="presentation">
      <R3FErrorBoundary fallback={<GradientFallback />}>
        <Suspense fallback={<GradientFallback />}>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
            onCreated={({ gl }) => {
              console.log('[NeuralCanvas] WebGL context created. WebGL2:', gl.capabilities.isWebGL2)
            }}
          >
            <NeuralScene scrollProgress={scrollProgress} />
          </Canvas>
        </Suspense>
      </R3FErrorBoundary>
    </div>
  )
}
