'use client'

import { useEffect, useState } from 'react'

export function AINav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 60) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(3,1,8,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(132,75,254,0.12)' : 'none',
      }}
      aria-label="Site navigation"
    >
      {/* Co-brand lock-up */}
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-sm tracking-wider" style={{ color: 'var(--ai-text, #f0edff)' }}>
          RackTheBrain
        </span>
        <span style={{ color: 'var(--ai-muted)' }}>×</span>
        <span className="font-display font-black text-sm tracking-wider" style={{ color: 'var(--ai-accent, #844bfe)' }}>
          ShoulderMonkey
        </span>
      </div>

      {/* CTA — hidden on mobile (sticky bar handles it) */}
      <a
        href="#waitlist"
        className="hidden md:inline-flex btn-primary"
        style={{ padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        Join the Waitlist
      </a>
    </nav>
  )
}
