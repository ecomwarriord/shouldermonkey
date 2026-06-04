'use client'

import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { LenisContext } from '@/contexts/LenisContext'

export function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const instance = new Lenis({ lerp: 0.08, smoothWheel: true })
    setLenis(instance)

    function raf(time: number) {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafRef.current)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
