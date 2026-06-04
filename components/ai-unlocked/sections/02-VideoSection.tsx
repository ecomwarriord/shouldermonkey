'use client'

import { ScrollReveal } from '../ui/ScrollReveal'

export function VideoSection() {
  return (
    <section className="relative py-24 px-6" style={{ background: 'var(--ai-bg, #030108)' }}>
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>Free preview</p>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            Watch 10 minutes before you decide anything.
          </h2>
          <p className="mb-8 text-lg" style={{ color: 'var(--ai-muted)' }}>
            This is a real excerpt from the webinar. No upsell. No pitch. Just the content.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          {/* YouTube embed placeholder — replace src with unlisted video ID */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ paddingBottom: '56.25%', background: 'rgba(132,75,254,0.08)', border: '1px solid rgba(132,75,254,0.2)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(132,75,254,0.2)', border: '1px solid rgba(132,75,254,0.4)' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7L8 5z" fill="#844bfe" />
                </svg>
              </div>
              <p className="text-sm" style={{ color: 'var(--ai-muted)' }}>Preview video coming soon</p>
            </div>
            {/* When video is ready, replace the div above with:
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="AI Unlocked — 10 minute preview"
            />
            */}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: '⚡', label: 'What you saw', text: 'A live AI build from scratch in under 15 minutes' },
              { icon: '🧠', label: 'The skill', text: 'How to think with AI — not just use it' },
              { icon: '💡', label: 'The point', text: 'This is one hour. Imagine 12 weeks.' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4"
                style={{ background: 'rgba(132,75,254,0.06)', border: '1px solid rgba(132,75,254,0.12)' }}
              >
                <span className="text-xl">{item.icon}</span>
                <p className="font-semibold text-sm mt-2" style={{ color: 'var(--ai-text)' }}>{item.label}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--ai-muted)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
