'use client'
import { useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Niche = 'salon' | 'gym' | 'clinic' | 'allied-health' | 'mortgage-broker' | 'print-training'

interface NicheConfig {
  accent: string
  accentBg: string
  accentBorder: string
  businessLabel: string
  challenges: string[]
}

const NICHE_CONFIG: Record<Niche, NicheConfig> = {
  salon: {
    accent: '#b8956a',
    accentBg: 'rgba(184,149,106,0.08)',
    accentBorder: 'rgba(184,149,106,0.2)',
    businessLabel: 'salon or beauty business',
    challenges: [
      'Clients not rebooking',
      'No-shows & last-minute cancellations',
      'Manually chasing Google reviews',
      'Too much admin, not enough floor time',
      'Leads who enquire but never book',
      'Other',
    ],
  },
  gym: {
    accent: '#22c55e',
    accentBg: 'rgba(34,197,94,0.08)',
    accentBorder: 'rgba(34,197,94,0.2)',
    businessLabel: 'gym or fitness business',
    challenges: [
      'Members going quiet or cancelling',
      'Leads not converting to memberships',
      'No-shows for classes or PT sessions',
      'Too much admin work',
      'Not enough Google reviews',
      'Other',
    ],
  },
  clinic: {
    accent: '#0284c7',
    accentBg: 'rgba(2,132,199,0.08)',
    accentBorder: 'rgba(2,132,199,0.2)',
    businessLabel: 'clinic or med spa',
    challenges: [
      'Patients not rebooking after treatment',
      'No-shows & last-minute cancellations',
      'Getting Google reviews consistently',
      'Admin eating into clinical time',
      'Leads falling through the cracks',
      'Other',
    ],
  },
  'allied-health': {
    accent: '#0d9488',
    accentBg: 'rgba(13,148,136,0.08)',
    accentBorder: 'rgba(13,148,136,0.2)',
    businessLabel: 'allied health practice',
    challenges: [
      'Patients not returning for follow-ups',
      'No-shows & cancellations',
      'Getting Google reviews consistently',
      'Too much admin work',
      'Leads not converting',
      'Other',
    ],
  },
  'mortgage-broker': {
    accent: '#d4a04a',
    accentBg: 'rgba(212,160,74,0.08)',
    accentBorder: 'rgba(212,160,74,0.2)',
    businessLabel: 'brokerage',
    challenges: [
      'Leads going cold before settlement',
      'Manual follow-up taking too long',
      'Keeping track of all applications',
      'Not getting enough referrals',
      'Other',
    ],
  },
  'print-training': {
    accent: '#844bfe',
    accentBg: 'rgba(132,75,254,0.08)',
    accentBorder: 'rgba(132,75,254,0.2)',
    businessLabel: 'print or training business',
    challenges: [
      'Losing quote requests',
      'Too much back-and-forth with clients',
      'Chasing repeat business',
      'Admin and job tracking',
      'Other',
    ],
  },
}

const INPUT_STYLE = (accent: string, accentBorder: string): React.CSSProperties => ({
  width: '100%',
  background: '#fff',
  border: `1px solid rgba(0,0,0,0.1)`,
  borderRadius: 10,
  padding: '13px 16px',
  fontSize: 14,
  color: '#1c1510',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
})

export function NicheEnquiryForm({ niche }: { niche: Niche }) {
  const config = NICHE_CONFIG[niche]
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const [form, setForm] = useState({ name: '', businessName: '', email: '', phone: '', challenge: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, niche, source: 'shouldermonkey' }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section style={{ background: '#faf8f5', padding: 'clamp(4rem, 8vw, 6rem) 0', borderTop: `1px solid ${config.accentBorder}` }}>
      <div style={{ width: '100%', maxWidth: 680, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-block',
              background: config.accentBg,
              border: `1px solid ${config.accentBorder}`,
              borderRadius: 100,
              padding: '5px 16px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: config.accent,
              marginBottom: 16,
            }}>
              Not ready to book?
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#1c1510', marginBottom: 12, lineHeight: 1.2, fontFamily: 'var(--font-jakarta)' }}>
              Tell us about your {config.businessLabel}.
            </h2>
            <p style={{ color: 'rgba(28,21,16,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              One of our team will reach out within one business day. No sales pitch — just a straight conversation about what you need.
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 2px 24px rgba(28,21,16,0.06), 0 1px 4px rgba(28,21,16,0.04)',
            border: '1px solid rgba(28,21,16,0.07)',
          }}>
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 1rem' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: config.accentBg, border: `2px solid ${config.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 24 }}>✓</div>
                <h3 style={{ fontFamily: 'var(--font-jakarta)', fontWeight: 700, fontSize: '1.25rem', color: '#1c1510', marginBottom: 10 }}>We&apos;ll be in touch.</h3>
                <p style={{ color: 'rgba(28,21,16,0.5)', fontSize: 14, lineHeight: 1.6 }}>
                  One of our team will reach out within one business day.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <Field label="Your name *">
                    <input type="text" placeholder="Jane Smith" required style={INPUT_STYLE(config.accent, config.accentBorder)} value={form.name} onChange={set('name')} />
                  </Field>
                  <Field label="Business name *">
                    <input type="text" placeholder="Your business" required style={INPUT_STYLE(config.accent, config.accentBorder)} value={form.businessName} onChange={set('businessName')} />
                  </Field>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <Field label="Email *">
                    <input type="email" placeholder="you@business.com" required style={INPUT_STYLE(config.accent, config.accentBorder)} value={form.email} onChange={set('email')} />
                  </Field>
                  <Field label="Phone *">
                    <input type="tel" placeholder="+61 4XX XXX XXX" required style={INPUT_STYLE(config.accent, config.accentBorder)} value={form.phone} onChange={set('phone')} />
                  </Field>
                </div>
                <Field label="What's your biggest challenge right now? *">
                  <select required style={{ ...INPUT_STYLE(config.accent, config.accentBorder), background: '#fff', cursor: 'pointer' }} value={form.challenge} onChange={set('challenge')}>
                    <option value="">Select one...</option>
                    {config.challenges.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    background: status === 'sending' ? `${config.accent}99` : config.accent,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 100,
                    padding: '15px 32px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: `0 4px 20px ${config.accentBg}`,
                    width: '100%',
                    marginTop: 4,
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send →'}
                </button>

                {status === 'error' && (
                  <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>
                    Something went wrong. Email us at hello@shouldermonkey.co
                  </p>
                )}

                <p style={{ color: 'rgba(28,21,16,0.3)', fontSize: 12, textAlign: 'center' }}>
                  No spam. No lock-in. Just a conversation.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(28,21,16,0.55)', letterSpacing: '0.02em' }}>{label}</label>
      {children}
    </div>
  )
}
