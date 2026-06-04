'use client'

import { useEffect, useRef } from 'react'
import { SectionTheme } from '../ui/SectionTheme'

const WORDS = 'By Week 12, your child will have built their first AI-powered product and a strategy for their first real income online.'.split(' ')

export function PromiseSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      wordRefs.current.forEach((el) => {
        if (el) { el.style.opacity = '1'; el.style.clipPath = 'inset(0 0 0 0)' }
      })
      return
    }

    let st: any

    async function setup() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!containerRef.current) return

      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 0.8,
        animation: gsap.fromTo(
          wordRefs.current.filter(Boolean),
          { clipPath: 'inset(0 100% 0 0)', opacity: 0.2 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'none',
          }
        ),
      })
    }

    setup()
    return () => { st?.kill() }
  }, [])

  return (
    <SectionTheme theme="promise">
      <section
        className="py-32 px-6 flex items-center justify-center min-h-screen"
        aria-label="Our promise"
      >
        <div ref={containerRef} className="max-w-3xl mx-auto text-center">
          <p className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {WORDS.map((word, i) => (
              <span
                key={i}
                ref={(el) => { if (el) wordRefs.current[i] = el }}
                className="font-display font-black inline-block"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  clipPath: 'inset(0 100% 0 0)',
                  opacity: 0.2,
                }}
              >
                {word}
              </span>
            ))}
          </p>
          <p className="mt-10 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Results depend on effort, consistency, and application.
            This is a target, not a guarantee.
          </p>
        </div>
      </section>
    </SectionTheme>
  )
}
