'use client'

import dynamic from 'next/dynamic'
import { ScrollReveal } from '../ui/ScrollReveal'

const SplitHeadline = dynamic(
  () => import('../ui/SplitHeadline').then((m) => m.SplitHeadline),
  { ssr: false }
)

export function TeenSection() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--ai-bg, #030108)' }}>
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: 'rgba(132,75,254,0.5)',
              left: `${10 + i * 8}%`,
              bottom: `${20 + (i % 4) * 15}%`,
              animation: `particle-rise ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              '--drift': `${(i % 2 === 0 ? 1 : -1) * (10 + i * 3)}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: headline + handoff */}
          <div>
            <p className="label-pill mb-6" style={{ width: 'fit-content' }}>For the builder in you</p>
            <SplitHeadline
              text="Stop watching. Start building."
              tag="h2"
              delay={0}
              className="font-display font-black leading-tight"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                letterSpacing: '-0.03em',
                color: 'var(--ai-text)',
              } as React.CSSProperties}
            />
            <p className="mt-6 text-lg leading-relaxed" style={{ color: 'var(--ai-muted)' }}>
              This is what you show your mates in Week 6. A working product. Something real.
              Not a certificate you print and forget — something that <em style={{ color: 'var(--ai-text)' }}>actually runs</em>.
            </p>

            {/* Shareable pull-quote — designed for Instagram Stories */}
            <div
              className="mt-8 rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(132,75,254,0.15), rgba(70,35,211,0.1))',
                border: '1px solid rgba(132,75,254,0.3)',
              }}
              data-shareable="true"
            >
              <p className="font-display font-black text-xl" style={{ color: '#f0edff' }}>
                &quot;I built an AI app at 16.&quot;
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--ai-muted)' }}>
                You could be saying this by Week 6. · AI Unlocked · aiunlocked.com.au
              </p>
            </div>
          </div>

          {/* Right: claims */}
          <ScrollReveal fromDirection="right">
            <div className="flex flex-col gap-4">
              {[
                { week: 'Week 6', claim: 'Build your first working AI product', color: 'var(--ai-accent)' },
                { week: 'Week 9', claim: 'Make your first money with AI', color: 'var(--ai-pop)' },
                { week: 'Week 12', claim: 'Launch your AI business', color: '#fec871' },
              ].map((item) => (
                <div
                  key={item.week}
                  className="flex gap-4 items-start rounded-xl p-4"
                  style={{ background: 'rgba(132,75,254,0.04)', border: '1px solid rgba(132,75,254,0.1)' }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: item.color }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: item.color }}>
                      {item.week}
                    </p>
                    <p className="font-semibold" style={{ color: 'var(--ai-text)' }}>{item.claim}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
