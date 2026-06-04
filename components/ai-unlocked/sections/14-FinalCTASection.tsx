'use client'

import { useState, useEffect } from 'react'
import { ScrollReveal } from '../ui/ScrollReveal'
import { WaitlistForm } from '../forms/WaitlistForm'
import { SegmentationQuestion } from '../forms/SegmentationQuestion'
import { ParentHandoff } from '../forms/ParentHandoff'

type Step = 'form' | 'segment' | 'done'

interface CohortStats {
  total: number
  cities: { name: string; count: number }[]
}

function CohortMap({ stats }: { stats: CohortStats }) {
  return (
    <div className="mb-12 text-center">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--ai-muted)' }}>
        Waitlist signups by city — not yet enrolled students
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {stats.cities.map((city) => (
          <div
            key={city.name}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(132,75,254,0.1)', border: '1px solid rgba(132,75,254,0.2)', color: 'var(--ai-text)' }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--ai-accent)' }}
              aria-hidden="true"
            />
            {city.name} · {city.count}
          </div>
        ))}
      </div>
      <p className="text-xl font-black" style={{ color: 'var(--ai-accent)' }}>
        {stats.total}+ on the waitlist
      </p>
    </div>
  )
}

export function FinalCTASection() {
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('unknown')
  const [stats, setStats] = useState<CohortStats>({ total: 76, cities: [] })

  useEffect(() => {
    fetch('/api/ai-unlocked-stats')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})

    // Poll every 30s
    const interval = setInterval(() => {
      fetch('/api/ai-unlocked-stats')
        .then((r) => r.json())
        .then((data) => setStats(data))
        .catch(() => {})
    }, 30_000)

    return () => clearInterval(interval)
  }, [])

  // Log page view
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ai_unlocked_page_view')
    }
  }, [])

  return (
    <section
      id="waitlist"
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #030108 0%, #1f1454 50%, #4623d3 100%)',
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              background: 'rgba(240,237,255,0.4)',
              left: `${5 + i * 5}%`,
              bottom: `${10 + (i % 5) * 18}%`,
              animation: `particle-rise ${4 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
              '--drift': `${(i % 2 === 0 ? 1 : -1) * (8 + i * 2)}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <ScrollReveal>
          <p className="label-pill mb-6 mx-auto" style={{ width: 'fit-content', borderColor: 'rgba(240,237,255,0.2)', background: 'rgba(240,237,255,0.06)', color: '#f0edff' }}>
            Founding Cohort — 50 seats
          </p>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#ffffff', letterSpacing: '-0.03em' }}
          >
            The AI generation starts here.
          </h2>
          <p className="text-lg mb-10" style={{ color: 'rgba(240,237,255,0.6)' }}>
            Webinar tickets from $149 AUD. Waitlist members get first access and founding cohort pricing.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <CohortMap stats={stats} />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div
            className="rounded-2xl p-8"
            style={{ background: 'rgba(3,1,8,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(240,237,255,0.1)' }}
          >
            {step === 'form' && (
              <WaitlistForm
                onSuccess={(role) => {
                  setRole(role)
                  setStep('segment')
                }}
              />
            )}
            {step === 'segment' && (
              <SegmentationQuestion
                email={email}
                onComplete={(r) => { setRole(r); setStep('done') }}
              />
            )}
            {step === 'done' && (
              <ParentHandoff role={role} />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <p className="mt-8 text-sm" style={{ color: 'rgba(240,237,255,0.4)' }}>
            Sydney · Online · For 13+ young entrepreneurs and their parents
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
