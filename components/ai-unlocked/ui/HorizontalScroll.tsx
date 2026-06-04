'use client'

import { useEffect, useRef, Children } from 'react'

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
}

/**
 * GSAP ScrollTrigger horizontal pin section.
 * On mobile (< 768px) renders as a vertical stack — no pin.
 * Stores ST ref and kills it on unmount to prevent ghost triggers on route remount.
 */
export function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<any>(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let mounted = true

    async function setup() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!mounted || !containerRef.current || !trackRef.current) return

      const panelCount = Children.count(children)
      const totalWidth = trackRef.current.scrollWidth
      const scrollDistance = totalWidth - window.innerWidth

      stRef.current = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        animation: gsap.to(trackRef.current, {
          x: -scrollDistance,
          ease: 'none',
        }),
        onLeave: () => { ScrollTrigger.refresh() },
      })
    }

    setup()
    return () => {
      mounted = false
      stRef.current?.kill()
      stRef.current = null
    }
  }, [children])

  const childArray = Children.toArray(children)

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {/* Desktop: horizontal track */}
      <div
        ref={trackRef}
        className="hidden md:flex"
        style={{ width: `${childArray.length * 100}vw` }}
      >
        {childArray.map((child, i) => (
          <div key={i} style={{ width: '100vw', flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>
      {/* Mobile: vertical stack */}
      <div className="flex md:hidden flex-col">
        {childArray}
      </div>
    </div>
  )
}
