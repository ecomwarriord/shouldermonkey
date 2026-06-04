'use client'

import { ScrollReveal } from '../ui/ScrollReveal'
import { HorizontalScroll } from '../ui/HorizontalScroll'

const PANELS = [
  {
    time: '0–10 min',
    title: 'The Hook & What\'s at Stake',
    points: ['Why AI is the biggest skill shift in 30 years', 'What happens to people who wait', 'The 3 things you\'ll be able to do after tonight'],
    color: '#ff0199',
    bg: 'rgba(255,1,153,0.06)',
  },
  {
    time: '10–25 min',
    title: 'The Money Angle',
    points: ['3 real ways people earn with AI today', 'Live demo: watch it happen in real time', 'Why you don\'t need to be a developer'],
    color: '#fec871',
    bg: 'rgba(254,200,113,0.06)',
  },
  {
    time: '25–40 min',
    title: 'The Tool Stack',
    points: ['ChatGPT, Claude, Canva AI, Runway — live', 'How to combine them, not just use them', 'The 5 tools you need to start'],
    color: '#00ebc1',
    bg: 'rgba(0,235,193,0.06)',
  },
  {
    time: '40–55 min',
    title: 'Build Live: Automation',
    points: ['One automation that saves 10+ hours per week', 'Built in front of you, step by step', 'You leave with the template'],
    color: '#844bfe',
    bg: 'rgba(132,75,254,0.08)',
  },
  {
    time: '55–70 min',
    title: 'Content Creation Machine',
    points: ['A week of social content in 60 minutes', 'AI-generated, human-edited, ready to post', 'The workflow the top creators are using'],
    color: '#a673ff',
    bg: 'rgba(166,115,255,0.06)',
  },
  {
    time: '70–90 min',
    title: 'The Roadmap & The Offer',
    points: ['The full 12-week curriculum revealed', 'What you\'ll build, week by week', 'Founding cohort pricing — one night only'],
    color: '#f0edff',
    bg: 'rgba(240,237,255,0.04)',
  },
]

export function WebinarSection() {
  return (
    <section className="py-24" style={{ background: 'var(--ai-bg, #030108)' }}>
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content' }}>The webinar</p>
          <h2
            className="font-display font-black"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
          >
            90 minutes. No fluff.
          </h2>
          <p className="mt-3 text-lg" style={{ color: 'var(--ai-muted)' }}>
            Here&apos;s exactly what happens, minute by minute.
          </p>
        </ScrollReveal>
      </div>

      <HorizontalScroll>
        {PANELS.map((panel) => (
          <div
            key={panel.title}
            className="h-screen flex items-center justify-center px-12"
            style={{ background: panel.bg }}
          >
            <div className="max-w-lg">
              <p className="text-sm font-bold mb-4 uppercase tracking-widest" style={{ color: panel.color }}>
                {panel.time}
              </p>
              <h3
                className="font-display font-black mb-6"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--ai-text)', letterSpacing: '-0.02em' }}
              >
                {panel.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {panel.points.map((point) => (
                  <li key={point} className="flex gap-3 items-start">
                    <span
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ background: panel.color }}
                      aria-hidden="true"
                    />
                    <span className="text-base" style={{ color: 'var(--ai-text)' }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </section>
  )
}
