'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const NeuralCanvas = dynamic(
  () => import('../three/NeuralCanvas').then((m) => m.NeuralCanvas),
  { ssr: false }
)

const SplitHeadline = dynamic(
  () => import('../ui/SplitHeadline').then((m) => m.SplitHeadline),
  { ssr: false }
)

interface HeroSectionProps {
  preloaderDone: boolean
}

export function HeroSection({ preloaderDone }: HeroSectionProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileCTA, setShowMobileCTA] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)

    function onScroll() {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / vh))
      setScrollProgress(progress)
      setShowMobileCTA(rect.top < -100)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="relative w-full overflow-hidden"
        style={{ minHeight: '100svh', background: 'var(--ai-bg, #030108)' }}
      >
        {/* Mobile CSS fallback — shown when canvas is hidden */}
        {isMobile && (
          <div
            className="absolute inset-0 ai-hero-mobile-bg"
            aria-hidden="true"
          />
        )}

        {/* Three.js neural network — desktop only */}
        {!isMobile && <NeuralCanvas scrollProgress={scrollProgress} />}

        {/* Foreground content — z-10, rendered over canvas */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          {/* Co-brand pill */}
          <div className="label-pill mb-8" style={{ color: 'var(--ai-pop, #00ebc1)', borderColor: 'rgba(0,235,193,0.3)', background: 'rgba(0,235,193,0.08)' }}>
            RackTheBrain × Shoulder Monkey
          </div>

          {/* LCP element — server-rendered, visible immediately */}
          {preloaderDone ? (
            <SplitHeadline
              text="AI UNLOCKED"
              tag="h1"
              delay={0.1}
              className="font-display font-black tracking-tighter text-white"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              } as React.CSSProperties}
            />
          ) : (
            /* Static h1 shown before preloader completes — THIS is the LCP element */
            <h1
              className="font-display font-black tracking-tighter text-white"
              style={{
                fontSize: 'clamp(4rem, 10vw, 9rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
              }}
            >
              AI UNLOCKED
            </h1>
          )}

          <p
            className="mt-6 max-w-xl text-lg md:text-xl"
            style={{ color: 'var(--ai-muted, rgba(240,237,255,0.55))' }}
          >
            For young Australians who want to build real things with AI.
            <br />
            <span style={{ color: 'var(--ai-text, #f0edff)' }}>
              90 minutes. Learn it. Build it. Own it.
            </span>
          </p>

          {/* Urgency badge */}
          <div
            className="mt-4 text-sm font-semibold"
            style={{ color: 'var(--ai-pop, #00ebc1)' }}
          >
            Founding Cohort — capped at 50 students. Waitlist gets first access.
          </div>

          {/* CTA */}
          <a
            href="#waitlist"
            className="btn-primary mt-8"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Join the Waitlist →
          </a>

          {/* Audience clarifier */}
          <p className="mt-4 text-xs" style={{ color: 'var(--ai-muted)' }}>
            13 and up · Sydney and beyond · Free to join
          </p>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            aria-hidden="true"
          >
            <span className="text-xs" style={{ color: 'var(--ai-muted)' }}>scroll</span>
            <div
              className="w-px h-8"
              style={{
                background: 'linear-gradient(to bottom, rgba(132,75,254,0.6), transparent)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA bar — appears once hero scrolls out of view */}
      <div
        className="ai-mobile-cta-bar"
        style={{
          transform: showMobileCTA ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <a
          href="#waitlist"
          className="btn-primary w-full text-center"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Join the Waitlist →
        </a>
      </div>
    </>
  )
}
