'use client'

import { ScrollReveal } from '../ui/ScrollReveal'
import { LiveDemo } from '../ui/LiveDemo'

export function LiveDemoSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-surface, #0a0612)' }}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>Try it now — free</p>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            Try the kind of thing you&apos;ll learn to build.
          </h2>
          <p className="mb-10 text-lg max-w-xl" style={{ color: 'var(--ai-muted)' }}>
            Describe a business idea. AI turns it into a concept in seconds. No account. No card.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <LiveDemo />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href="#waitlist"
            className="btn-primary mt-10 inline-flex"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Join the Waitlist →
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
