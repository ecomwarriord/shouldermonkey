'use client'

import { useEffect, useRef } from 'react'

const PANELS = [
  {
    label: 'Live AI build',
    headline: 'Watch a working product built from nothing.',
    detail: 'You get the template. You run it the same night.',
    color: '#7B3FE4',
  },
  {
    label: 'The tool stack',
    headline: 'ChatGPT, Claude, Canva AI, ElevenLabs.',
    detail: 'Shown live, not explained in slides. You leave knowing which one to use and when.',
    color: '#FF3366',
  },
  {
    label: 'One automation',
    headline: 'A workflow that saves 10 hours a week.',
    detail: 'Built in front of you. You get the template. It runs that night.',
    color: '#7B3FE4',
  },
  {
    label: 'Content in 60 minutes',
    headline: 'A full week of social posts created live in one hour.',
    detail: "You watch exactly how it's done.",
    color: '#FF3366',
  },
]

export function ValueStackHorizontal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<any>(null)

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return
    let mounted = true

    async function setup() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!mounted || !sectionRef.current || !trackRef.current) return

      const containerWidth = sectionRef.current.offsetWidth
      const totalTranslate = containerWidth * (PANELS.length - 1)

      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalTranslate}`,
        pin: true,
        scrub: 1,
        animation: gsap.to(trackRef.current, {
          x: -totalTranslate,
          ease: 'none',
        }),
      })
    }

    setup()

    return () => {
      mounted = false
      stRef.current?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.88)' }}
    >
      <div ref={trackRef} className="ai-value-track">
        {PANELS.map((panel) => (
          <div key={panel.label} className="ai-value-panel">
            <p style={{
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: panel.color, marginBottom: 20,
            }}>
              {panel.label}
            </p>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 600, letterSpacing: '-0.01em', color: '#ffffff',
              maxWidth: 640, lineHeight: 1.25, marginBottom: 20, textAlign: 'center',
            }}>
              {panel.headline}
            </h2>
            <p style={{
              fontSize: '1.1rem', color: 'rgba(255,255,255,0.55)',
              maxWidth: 500, textAlign: 'center', lineHeight: 1.65,
            }}>
              {panel.detail}
            </p>
            <div style={{
              marginTop: 28,
              width: 48, height: 2,
              background: `linear-gradient(to right, ${panel.color}, transparent)`,
            }} />
          </div>
        ))}
      </div>
    </section>
  )
}
