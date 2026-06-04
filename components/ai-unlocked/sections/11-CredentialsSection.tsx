'use client'

import { ScrollReveal } from '../ui/ScrollReveal'

export function CredentialsSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-bg, #030108)' }}>
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>The people behind this</p>
          <h2
            className="font-display font-black mb-12"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            Real people. Real results.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dee */}
          <ScrollReveal fromDirection="left">
            <div
              className="rounded-2xl p-8"
              style={{ background: 'rgba(132,75,254,0.06)', border: '1px solid rgba(132,75,254,0.15)' }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-2xl"
                  style={{ background: 'linear-gradient(135deg, #844bfe, #4623d3)', color: '#fff' }}
                  aria-hidden="true"
                >
                  D
                </div>
                <div>
                  <h3 className="font-display font-black text-xl" style={{ color: 'var(--ai-text)' }}>Dee</h3>
                  <p className="text-sm" style={{ color: 'var(--ai-muted)' }}>29 · Sydney · AI Builder</p>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--ai-text)' }}>
                Built 6 live AI products in under 12 months — all still running.
                Including ShoulderMonkey (a SaaS platform with 200+ active users) and Qaneri (enterprise platform, live).
              </p>
              <div className="flex flex-wrap gap-2">
                {['ShoulderMonkey', 'Qaneri', 'Holmes', 'Donna', 'Veridian', 'FORGE'].map((p) => (
                  <span key={p} className="label-pill text-xs">{p}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Abhinav */}
          <ScrollReveal fromDirection="right">
            <div
              className="rounded-2xl p-8"
              style={{ background: 'rgba(0,235,193,0.04)', border: '1px solid rgba(0,235,193,0.12)' }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-2xl"
                  style={{ background: 'linear-gradient(135deg, #00ebc1, #0d9488)', color: '#fff' }}
                  aria-hidden="true"
                >
                  A
                </div>
                <div>
                  <h3 className="font-display font-black text-xl" style={{ color: 'var(--ai-text)' }}>Abhinav Verma</h3>
                  <p className="text-sm" style={{ color: 'var(--ai-muted)' }}>Sydney · Educator · Podcaster</p>
                </div>
              </div>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--ai-text)' }}>
                1,000+ students through RackTheBrain — his online learning platform for young entrepreneurs
                in Australia and New Zealand. Host of the Rack the Brain podcast with 50+ episodes and
                high-profile guests from business, technology, and education.
              </p>
              <div className="flex flex-wrap gap-2">
                {['RackTheBrain', 'Podcast host', '1000+ students', 'Sydney educator'].map((p) => (
                  <span key={p} className="label-pill text-xs" style={{ color: '#00ebc1', borderColor: 'rgba(0,235,193,0.25)', background: 'rgba(0,235,193,0.08)' }}>{p}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Guest strip placeholder */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 rounded-xl p-6" style={{ background: 'rgba(132,75,254,0.04)', border: '1px solid rgba(132,75,254,0.1)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--ai-muted)' }}>
              Trusted voices on Abhinav&apos;s podcast
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 rounded-lg"
                  style={{ background: 'rgba(132,75,254,0.08)', border: '1px solid rgba(132,75,254,0.1)' }}
                  aria-label="Guest logo placeholder"
                />
              ))}
              <p className="text-sm" style={{ color: 'var(--ai-muted)' }}>Guest logos coming soon</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
