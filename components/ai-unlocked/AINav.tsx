'use client'

import { useEffect, useState } from 'react'

export function AINav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 40) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Top gradient — prevents nodes bleeding into nav zone */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: 120,
          zIndex: 39,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <nav
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 32px',
          transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
          background: scrolled ? 'rgba(0,0,0,0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}
        aria-label="Site navigation"
      >
        {/* Co-brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.01em',
            color: '#ffffff',
          }}>
            RackTheBrain
          </span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>×</span>
          <span style={{
            fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.01em',
            color: '#7B3FE4',
          }}>
            ShoulderMonkey
          </span>
        </div>

        {/* CTA */}
        <a
          href="#waitlist"
          className="btn-primary"
          style={{
            padding: '0.65rem 1.6rem',
            fontSize: '0.875rem',
            background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)',
          }}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Join the Waitlist
        </a>
      </nav>
    </>
  )
}
