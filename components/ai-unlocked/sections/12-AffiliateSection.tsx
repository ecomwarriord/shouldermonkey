'use client'

import { ScrollReveal } from '../ui/ScrollReveal'

// Only tools actually used in the course — Dee confirmed using ChatGPT and Claude
// Others are tools the course introduces and teaches — honest framing
const TOOLS = [
  { name: 'ChatGPT Plus', desc: 'The AI everyone knows. We go way deeper.', url: 'https://chat.openai.com' },
  { name: 'Claude Pro', desc: 'Best for writing, reasoning, and building.', url: 'https://claude.ai' },
  { name: 'Canva Pro', desc: 'Design anything — logos, posts, decks.', url: 'https://canva.com' },
  { name: 'Make', desc: 'Automate workflows without writing code.', url: 'https://make.com' },
]

export function AffiliateSection() {
  return (
    <section className="py-24 px-6" style={{ background: '#000' }}>
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <p className="label-pill mb-6 mx-auto" style={{ width: 'fit-content', color: '#7B3FE4', borderColor: 'rgba(123,63,228,0.3)', background: 'rgba(123,63,228,0.08)' }}>
            Tools we use
          </p>
          <h2
            className="font-display font-black mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#ffffff', letterSpacing: '-0.02em' }}
          >
            Here&apos;s what we&apos;ll be building with.
          </h2>
          <p className="mb-12 text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Four tools. You&apos;ll learn all of them in the course.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {TOOLS.map((tool, i) => (
            <ScrollReveal key={tool.name} delay={i * 0.08}>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 p-6 rounded-2xl text-left transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(123,63,228,0.06)',
                  border: '1px solid rgba(123,63,228,0.2)',
                  textDecoration: 'none',
                }}
                aria-label={`Learn about ${tool.name}`}
              >
                <p className="font-display font-black text-xl" style={{ color: '#ffffff' }}>{tool.name}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{tool.desc}</p>
                <p className="text-xs font-semibold mt-auto" style={{ color: '#7B3FE4' }}>You&apos;ll learn this →</p>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
