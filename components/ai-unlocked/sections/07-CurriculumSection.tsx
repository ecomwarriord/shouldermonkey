'use client'

import { ScrollReveal } from '../ui/ScrollReveal'

const WEEKS = [
  { n: 1, title: 'AI Foundations', sub: 'The new rules of the game', milestone: true },
  { n: 2, title: 'Your First $100', sub: 'Business models that work today', milestone: false },
  { n: 3, title: 'The Tool Arsenal', sub: 'ChatGPT, Claude, Gemini — mastered', milestone: false },
  { n: 4, title: 'Content Machine', sub: 'Social, YouTube, short-form video', milestone: false },
  { n: 5, title: 'AI Productivity', sub: 'Automate your boring life', milestone: false },
  { n: 6, title: 'No-Code AI Agents', sub: 'Build your first agent', milestone: true },
  { n: 7, title: 'AI Freelancing', sub: 'Getting paid for your skills', milestone: false },
  { n: 8, title: 'AI Marketing', sub: 'Grow any business', milestone: false },
  { n: 9, title: 'Build Your Product', sub: 'Digital products with AI', milestone: false },
  { n: 10, title: 'Monetise Online', sub: 'Courses, templates, services', milestone: false },
  { n: 11, title: 'Scale with Automation', sub: 'Work less, earn more', milestone: false },
  { n: 12, title: 'Your AI Business Launch', sub: 'First $1,000 Blueprint', milestone: true },
]

export function CurriculumSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--ai-surface, #0a0612)' }}>
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>The full course</p>
          <h2
            className="font-display font-black mb-2"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            12 Weeks. Real Projects.
          </h2>
          <p className="mb-10 text-lg max-w-xl" style={{ color: 'var(--ai-muted)' }}>
            Every week you build something you keep. Not exercises — actual products.
          </p>
        </ScrollReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-auto">
          {WEEKS.map((week, i) => (
            <ScrollReveal key={week.n} delay={i * 0.04}>
              <div
                className={`rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] ${
                  week.milestone ? 'col-span-2 md:col-span-1' : ''
                }`}
                style={{
                  background: week.milestone ? 'rgba(132,75,254,0.12)' : 'rgba(132,75,254,0.04)',
                  border: week.milestone
                    ? '1px solid rgba(254,200,113,0.5)'
                    : '1px solid rgba(132,75,254,0.12)',
                  boxShadow: week.milestone ? '0 0 24px rgba(254,200,113,0.1)' : 'none',
                }}
              >
                <p className="text-xs font-bold mb-2" style={{ color: week.milestone ? '#fec871' : 'var(--ai-muted)' }}>
                  Week {week.n} {week.milestone && '★'}
                </p>
                <h3 className="font-display font-black text-base leading-tight mb-1" style={{ color: 'var(--ai-text)' }}>
                  {week.title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--ai-muted)' }}>{week.sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div
            className="mt-8 rounded-2xl p-6"
            style={{ background: 'rgba(254,200,113,0.06)', border: '1px solid rgba(254,200,113,0.2)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--ai-text)' }}>
              <span style={{ color: '#fec871' }}>★ Week 12</span> — &quot;Your First $1,000 Blueprint&quot; is building a real product people pay for.
              Not dropshipping. Not a get-rich-quick scheme. A real business, built with AI.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
