'use client'

import { useState } from 'react'
import { ScrollReveal } from '../ui/ScrollReveal'
import { SectionTheme } from '../ui/SectionTheme'

const CAREER_PATHS = ['Technology', 'Creative', 'Business', 'Healthcare', 'Education']
const SCHOOL_YEARS = [7, 8, 9, 10, 11, 12]

function ROICalculator() {
  const [year, setYear] = useState(10)
  const [career, setCareer] = useState('Technology')
  const [hours, setHours] = useState(5)
  const [showResult, setShowResult] = useState(false)
  const [parentEmail, setParentEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const yearsToWork = 18 - year + 42 // rough career horizon
  const hourlyRate = career === 'Technology' ? 75 : career === 'Creative' ? 55 : career === 'Business' ? 65 : 50
  const advantage = Math.round(hourlyRate * hours * 50) // ~50 working weeks/year
  const score = Math.min(98, 60 + (12 - year) * 3 + hours * 2)

  function handleCalculate() { setShowResult(true) }

  async function handleEmailResult(e: React.FormEvent) {
    e.preventDefault()
    if (!parentEmail) return
    // Send to GHL with parent-roi tag
    await fetch('/api/ai-waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: parentEmail, role: 'parent', archetype: 'roi-calculator' }),
    }).catch(() => {})
    setEmailSent(true)
  }

  return (
    <div className="rounded-2xl p-8" style={{ background: 'rgba(70,35,211,0.06)', border: '1px solid rgba(70,35,211,0.15)' }}>
      <h3 className="font-display font-black text-xl mb-6" style={{ color: '#0a0612' }}>
        AI Advantage Calculator
      </h3>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#0a0612' }}>
            School Year: <span style={{ color: 'var(--ai-accent)' }}>Year {year}</span>
          </label>
          <input type="range" min={7} max={12} value={year} onChange={(e) => setYear(+e.target.value)}
            className="w-full" style={{ accentColor: '#4623d3' }} aria-label={`School year: Year ${year}`} />
          <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(10,6,18,0.4)' }}>
            <span>Year 7</span><span>Year 12</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#0a0612' }}>Career Path</label>
          <div className="flex flex-wrap gap-2">
            {CAREER_PATHS.map((c) => (
              <button
                key={c}
                onClick={() => setCareer(c)}
                className="px-3 py-1 rounded-full text-sm font-medium transition-all"
                style={{
                  background: career === c ? '#4623d3' : 'rgba(70,35,211,0.08)',
                  color: career === c ? '#fff' : '#0a0612',
                  border: '1px solid rgba(70,35,211,0.2)',
                }}
                aria-pressed={career === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#0a0612' }}>
            Hours per week available: <span style={{ color: 'var(--ai-accent)' }}>{hours}h</span>
          </label>
          <input type="range" min={2} max={10} value={hours} onChange={(e) => setHours(+e.target.value)}
            className="w-full" style={{ accentColor: '#4623d3' }} aria-label={`Hours per week: ${hours}`} />
          <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(10,6,18,0.4)' }}>
            <span>2h</span><span>10h</span>
          </div>
        </div>

        <button onClick={handleCalculate} className="btn-primary w-full" style={{ background: 'linear-gradient(135deg, #4623d3, #6b35f5)' }}>
          Calculate →
        </button>
      </div>

      {showResult && (
        <div className="mt-6 rounded-xl p-5" style={{ background: 'rgba(70,35,211,0.08)', border: '1px solid rgba(70,35,211,0.2)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4623d3' }}>AI Advantage Score</p>
          <p className="font-display font-black text-5xl mb-1" style={{ color: '#4623d3' }}>{score}<span className="text-2xl">/100</span></p>
          <p className="text-sm mb-4" style={{ color: 'rgba(10,6,18,0.6)' }}>
            Students in Year {year} with AI skills could earn an extra{' '}
            <strong style={{ color: '#0a0612' }}>${advantage.toLocaleString()} AUD/year</strong>{' '}
            within 3 years of starting their career.
          </p>
          <p className="text-xs mb-4" style={{ color: 'rgba(10,6,18,0.4)' }}>
            This is an illustrative estimate, not a financial guarantee. Results vary.
          </p>

          {!emailSent ? (
            <form onSubmit={handleEmailResult} className="flex gap-2">
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="Email this result to yourself"
                className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                style={{ background: '#fff', border: '1px solid rgba(70,35,211,0.2)', color: '#0a0612' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, #4623d3, #6b35f5)' }}>
                Send
              </button>
            </form>
          ) : (
            <p className="text-sm font-semibold" style={{ color: '#4623d3' }}>✓ Sent — check your inbox</p>
          )}

          <div className="mt-4">
            <a
              href="#waitlist"
              className="text-sm font-semibold underline"
              style={{ color: '#4623d3' }}
              onClick={(e) => { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Reserve their founding cohort spot →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export function ParentSection() {
  function handleShareToParent() {
    const url = `${window.location.origin}/ai-unlocked?role=parent#for-parents`
    const text = `Hey, I found this AI course I want to do — can you have a look? ${url}`
    if (navigator.share) {
      navigator.share({ title: 'AI Unlocked', text, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied! Paste it in a message to your parents.')
      }).catch(() => {})
    }
  }

  return (
    <SectionTheme theme="light" className="py-24 px-6" id="for-parents">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p className="label-pill mb-4" style={{ width: 'fit-content', borderColor: 'rgba(70,35,211,0.25)', background: 'rgba(70,35,211,0.06)', color: '#4623d3' }}>
            For parents
          </p>
          <h2
            className="font-display font-black mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#0a0612', letterSpacing: '-0.02em' }}
          >
            The smart investment you haven&apos;t been offered before.
          </h2>
          <p className="mb-12 text-lg max-w-xl" style={{ color: 'rgba(10,6,18,0.6)' }}>
            Less than 10 private tutoring sessions at Sydney rates. More targeted than any of them.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ROI Calculator */}
          <ScrollReveal fromDirection="left">
            <ROICalculator />
          </ScrollReveal>

          {/* Credibility + FAQ preview */}
          <ScrollReveal fromDirection="right">
            <div className="flex flex-col gap-6">
              {/* Guarantee */}
              <div className="rounded-xl p-5" style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.2)' }}>
                <p className="font-bold text-sm" style={{ color: '#0d9488' }}>14-day satisfaction guarantee</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(10,6,18,0.6)' }}>Full refund within 14 days, no questions. We only want students who are committed.</p>
              </div>

              {/* Parent FAQ preview */}
              {[
                { q: 'Is this supervised?', a: 'Yes — weekly live sessions with both instructors, plus a moderated community.' },
                { q: 'What if my child loses interest?', a: '14-day refund. No risk. We\'d rather you trust the process than feel trapped.' },
                { q: 'Do they need any experience?', a: 'Zero. If they can use a smartphone, they can start this course.' },
              ].map((item) => (
                <div key={item.q} className="rounded-xl p-4" style={{ background: 'rgba(70,35,211,0.04)', border: '1px solid rgba(70,35,211,0.1)' }}>
                  <p className="font-semibold text-sm mb-1" style={{ color: '#0a0612' }}>{item.q}</p>
                  <p className="text-sm" style={{ color: 'rgba(10,6,18,0.6)' }}>{item.a}</p>
                </div>
              ))}

              {/* Payment plan callout */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(70,35,211,0.06)', border: '1px solid rgba(70,35,211,0.2)' }}>
                <p className="font-bold text-sm" style={{ color: '#4623d3' }}>Payment plan available</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(10,6,18,0.6)' }}>
                  3 × $1,099 AUD — or pay upfront at $2,999 AUD. Webinar ticket fee ($149) credited to course if you enrol within 48 hours.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Send to parent button — for teens scrolling through */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-sm mb-3" style={{ color: 'rgba(10,6,18,0.5)' }}>If you&apos;re a student — send this section to your parents</p>
            <button
              onClick={handleShareToParent}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(70,35,211,0.1)', border: '1px solid rgba(70,35,211,0.3)', color: '#4623d3' }}
            >
              📤 Send to parent →
            </button>
          </div>
        </ScrollReveal>
      </div>
    </SectionTheme>
  )
}
