'use client'

import { useEffect } from 'react'
import { useLenis } from '@/contexts/LenisContext'

/**
 * Wires the global Lenis instance to GSAP ScrollTrigger.
 * Must be mounted inside SmoothScroll (the Lenis context provider).
 * Never creates a second Lenis instance.
 */
export function LenisGSAP() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    let gsap: typeof import('gsap').gsap
    let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger

    async function setup() {
      const gsapModule = await import('gsap')
      const stModule = await import('gsap/ScrollTrigger')
      gsap = gsapModule.gsap
      ScrollTrigger = stModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      // Wire Lenis scroll events to ScrollTrigger
      lenis!.on('scroll', ScrollTrigger.update)

      // Drive Lenis RAF via GSAP ticker (prevents double RAF loops)
      const tickerFn = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tickerFn)
        lenis!.off('scroll', ScrollTrigger.update)
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    let cleanup: (() => void) | undefined
    setup().then((fn) => { cleanup = fn })

    return () => { cleanup?.() }
  }, [lenis])

  return null
}
