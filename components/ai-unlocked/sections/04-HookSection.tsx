'use client'

import { ScrollReveal } from '../ui/ScrollReveal'
import { CountUp } from '../ui/CountUp'
import { GlowCard } from '../ui/GlowCard'

export function HookSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-bg, #030108)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: big stat */}
          <ScrollReveal fromDirection="left">
            <div>
              <div
                className="font-display font-black leading-none mb-2"
                style={{ fontSize: 'clamp(5rem, 14vw, 10rem)', color: 'var(--ai-accent)' }}
                aria-label="95% of Australian schools have no AI curriculum"
              >
                <CountUp target={95} suffix="%" className="tabular-nums" />
              </div>
              <p className="text-xl font-semibold" style={{ color: 'var(--ai-text)' }}>
                of Australian schools have no AI curriculum
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--ai-muted)' }}>
                Source: Deloitte AI Education in Australia Report, 2025
              </p>
            </div>
          </ScrollReveal>

          {/* Right: two contrast cards */}
          <div className="flex flex-col gap-4">
            <ScrollReveal fromDirection="right" delay={0}>
              <GlowCard glowColor="#ff0199" variant="dim">
                <p className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: 'rgba(255,1,153,0.7)' }}>
                  Most schools right now
                </p>
                <p className="text-base font-medium" style={{ color: 'var(--ai-text)' }}>
                  Still figuring out what AI even is — while ChatGPT is already on version 5.
                </p>
              </GlowCard>
            </ScrollReveal>

            <ScrollReveal fromDirection="right" delay={0.1}>
              <GlowCard glowColor="#00ebc1" variant="bright">
                <p className="font-bold text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--ai-pop)' }}>
                  You, after this course
                </p>
                <p className="text-base font-medium" style={{ color: 'var(--ai-text)' }}>
                  Building with AI before most people your age know how to prompt it.
                </p>
              </GlowCard>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
