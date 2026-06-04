'use client'

import { ScrollReveal } from '../ui/ScrollReveal'
import { GlowCard } from '../ui/GlowCard'

const DEE_PROJECTS = [
  { name: 'ShoulderMonkey', desc: 'All-in-one business platform for service businesses. 200+ active users.', url: 'https://shouldermonkey.co', tag: 'SaaS' },
  { name: 'Qaneri', desc: 'Enterprise-grade all-in-one platform. Live at qaneri.com.', url: 'https://qaneri.com', tag: 'Enterprise SaaS' },
  { name: 'Holmes', desc: 'Voice-first AI operating system with deep work orchestration.', url: null, tag: 'AI OS' },
  { name: 'Donna', desc: 'Personal assistant PWA — voice, tasks, shopping, calendar.', url: 'https://donna.shouldermonkey.co', tag: 'PWA' },
  { name: 'Veridian College', desc: 'AI-augmented school marketing site for a private college.', url: null, tag: 'EdTech' },
  { name: 'FORGE', desc: 'Fitness PWA with AI food scanner and macro tracker.', url: 'https://forge-dee.vercel.app', tag: 'Fitness' },
]

export function ProofSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-surface, #0a0612)' }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>Real proof</p>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            What AI looks like in the real world.
          </h2>
          <p className="mb-4 text-lg max-w-2xl" style={{ color: 'var(--ai-muted)' }}>
            This is what your instructor Dee built — in under 12 months, while running a business.
          </p>
        </ScrollReveal>

        {/* Founder proof */}
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--ai-muted)' }}>
            Built by Dee · 29 · Sydney
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEE_PROJECTS.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 0.07}>
                <GlowCard className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="label-pill text-xs">{p.tag}</span>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--ai-pop)' }}
                        aria-label={`View ${p.name} live`}
                      >
                        Live →
                      </a>
                    )}
                  </div>
                  <h3 className="font-display font-black text-lg mb-2" style={{ color: 'var(--ai-text)' }}>
                    {p.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--ai-muted)' }}>{p.desc}</p>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Outcome proof */}
        <ScrollReveal delay={0.3}>
          <div
            className="mt-10 rounded-2xl p-8"
            style={{ background: 'rgba(132,75,254,0.04)', border: '1px solid rgba(132,75,254,0.15)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--ai-pop)' }}>
              What students build in 12 weeks
            </p>
            <p className="text-lg font-medium" style={{ color: 'var(--ai-text)' }}>
              By Week 6, every student has a working AI product. By Week 12, they have a launch strategy and a clear path to their first real income online.
            </p>
            <p className="text-sm mt-3" style={{ color: 'var(--ai-muted)' }}>
              Cohort 1 hasn&apos;t started yet — you can be in it. These are projected outcomes based on the curriculum, not yet published testimonials.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
