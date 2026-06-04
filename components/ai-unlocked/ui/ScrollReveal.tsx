'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  fromDirection?: 'bottom' | 'left' | 'right'
  delay?: number
}

export function ScrollReveal({ children, className = '', fromDirection = 'bottom', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

    const initialX = fromDirection === 'left' ? -60 : fromDirection === 'right' ? 60 : 0
    const initialY = fromDirection === 'bottom' ? 40 : 0
    el.style.opacity = '0'
    el.style.transform = `translate(${initialX}px, ${initialY}px)`
    el.style.willChange = 'transform, opacity'

    let gsapInstance: typeof import('gsap').gsap
    let stInstance: ReturnType<typeof import('gsap/ScrollTrigger').ScrollTrigger.create>

    async function setup() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsapInstance = gsap

      stInstance = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay,
          })
        },
        once: true,
      })
    }

    setup()

    return () => {
      stInstance?.kill()
    }
  }, [fromDirection, delay])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
