'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

/* ── Per-niche notification feeds ── */
const NICHE_NOTIFICATIONS: Record<string, Array<{ icon: string; name: string; action: string; time: string; color: string }>> = {
  'hair salons': [
    { icon: '💬', name: 'Mia Anderson',    action: 'New booking request via Instagram',       time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Confirmation + deposit link sent',         time: '0s',        color: '#00ebc1' },
    { icon: '📅', name: 'Emma Walsh',       action: 'Booked: Balayage — Sat 10am',             time: '3m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Jade after colour appointment',   time: '8m ago',    color: '#fec871' },
    { icon: '🔁', name: 'No-show follow-up',action: 'Auto SMS sent to cancelled slot',          time: '15m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Sophie Turner',    action: 'Enquiry: Extensions pricing',              time: '22m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Rebooking sent',   action: 'Follow-up to Lucy — 6 weeks later',       time: '30m ago',   color: '#00ebc1' },
  ],
  'gyms': [
    { icon: '💬', name: 'Lachlan Moore',   action: 'New membership enquiry via Facebook',      time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Trial offer sent', action: '7-day trial pass + welcome SMS sent',      time: '0s',        color: '#00ebc1' },
    { icon: '📅', name: 'Priya Sharma',    action: 'Booked: Intro class — Mon 6am',           time: '4m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Tom after week 1 check-in',       time: '9m ago',    color: '#fec871' },
    { icon: '🔁', name: 'Churn prevention', action: 'Re-engagement SMS to inactive member',    time: '14m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Riley Scott',     action: 'Enquiry: Personal training packages',      time: '20m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Upsell sent',     action: 'PT package offer to 3-month members',      time: '28m ago',   color: '#00ebc1' },
  ],
  'med spas': [
    { icon: '💬', name: 'Isabelle Chen',   action: 'Consultation request via Google Ads',     time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Consult booked + intake form sent',       time: '0s',        color: '#00ebc1' },
    { icon: '📅', name: 'Anna Kovacs',     action: 'Booked: Anti-wrinkle consult — Thu 2pm',  time: '5m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent 24hrs post-treatment to Sarah',      time: '10m ago',   color: '#fec871' },
    { icon: '🔁', name: 'Rebooking trigger',action: 'Auto SMS: "Your filler is due for a top-up"', time: '18m ago', color: '#ff0199' },
    { icon: '💬', name: 'Jessica Hart',    action: 'Enquiry: Skin package pricing',            time: '25m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Deposit collected',action: 'Payment link clicked by new client',      time: '32m ago',   color: '#00ebc1' },
  ],
  'mortgage brokers': [
    { icon: '💬', name: 'Daniel Nguyen',   action: 'Loan enquiry submitted — 9:47pm',          time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Intro + calendar booking link sent',       time: '23s',       color: '#00ebc1' },
    { icon: '📅', name: 'Sarah O\'Brien',  action: 'Discovery call booked — Tue 11am',         time: '6m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Mark post-settlement',             time: '12m ago',   color: '#fec871' },
    { icon: '🔁', name: 'Doc follow-up',   action: 'Reminder sent: payslips still needed',     time: '20m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Tanya Williams',  action: 'Enquiry: First home buyer scheme',         time: '27m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Pipeline updated', action: 'Daniel moved to: Docs Submitted',          time: '35m ago',   color: '#00ebc1' },
  ],
  'chiropractors': [
    { icon: '💬', name: 'James Fletcher',  action: 'New patient enquiry via website',             time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Intake form + booking link sent',             time: '0s',        color: '#00ebc1' },
    { icon: '📅', name: 'Rachel Kim',      action: 'Booked: Initial consult — Wed 9am',           time: '4m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent after 3rd visit to Michael',             time: '11m ago',   color: '#fec871' },
    { icon: '🔁', name: 'No-show rescued', action: 'Auto SMS: "Let\'s rebook your session"',      time: '19m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Karen Holt',      action: 'Enquiry: Chronic back pain treatment',        time: '26m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Care plan sent',   action: 'Automated 6-week plan to new patient',       time: '33m ago',   color: '#00ebc1' },
  ],
  'tradies': [
    { icon: '💬', name: 'Jake Morrison',   action: 'Plumbing enquiry via website',                time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Availability + quote booking link sent',      time: '18s',       color: '#00ebc1' },
    { icon: '📅', name: 'Tom Hargreaves',  action: 'Quote booked — Thu 8am',                      time: '5m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Lisa after job completion',           time: '11m ago',   color: '#fec871' },
    { icon: '🔁', name: 'Invoice reminder', action: 'Auto SMS: "Invoice #47 is due tomorrow"',    time: '18m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Chris Barry',     action: 'Electrical quote via Facebook',               time: '25m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Quote follow-up',  action: 'Auto SMS sent 48hrs after quote',            time: '32m ago',   color: '#00ebc1' },
  ],
  'real estate agents': [
    { icon: '💬', name: 'David Chen',      action: 'Property enquiry via Domain — 10:42pm',       time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Inspection times + agent contact sent',       time: '14s',       color: '#00ebc1' },
    { icon: '📅', name: 'Sarah Mitchell',  action: 'Inspection booked — Sat 11am',                time: '4m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to the Williams family post-settlement', time: '9m ago',    color: '#fec871' },
    { icon: '🔁', name: 'Vendor update',   action: 'Weekly campaign report sent automatically',   time: '16m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Michael Torres',  action: 'Appraisal request via REA',                   time: '23m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Referral sequence',action: 'Past client: "Know anyone looking to sell?"', time: '31m ago',   color: '#00ebc1' },
  ],
  'accountants': [
    { icon: '💬', name: 'Olivia Grant',    action: 'Tax return enquiry via website',              time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Welcome + onboarding form link sent',         time: '22s',       color: '#00ebc1' },
    { icon: '📅', name: 'Nathan Brooks',   action: 'Initial consult booked — Mon 2pm',            time: '5m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to clients post-lodgement',              time: '10m ago',   color: '#fec871' },
    { icon: '🔁', name: 'Referral sequence',action: '"Know anyone who needs an accountant?"',     time: '17m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Emma Wilson',     action: 'SMSF enquiry via Google Ads',                 time: '24m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Annual check-in',  action: 'Mid-year review sent to all active clients', time: '32m ago',   color: '#00ebc1' },
  ],
  'cleaners': [
    { icon: '💬', name: 'Sophie Harris',   action: 'House clean quote via Facebook',              time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Pricing guide + booking form sent',           time: '11s',       color: '#00ebc1' },
    { icon: '📅', name: 'Mark Johnson',    action: 'Regular clean booked — every Fri 9am',        time: '3m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Claire after first clean',            time: '8m ago',    color: '#fec871' },
    { icon: '🔁', name: 'Win-back sent',   action: 'Re-engagement SMS to lapsed client',          time: '15m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Rachel Nguyen',   action: 'End of lease clean enquiry',                  time: '22m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Referral request', action: '"Loved your clean? Know anyone else?"',      time: '29m ago',   color: '#00ebc1' },
  ],
  'coaches': [
    { icon: '💬', name: 'Alex Porter',     action: 'Discovery call request via Instagram',        time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Booking link sent',action: 'Calendar link + intake form sent',            time: '8s',        color: '#00ebc1' },
    { icon: '📅', name: 'Hannah Clarke',   action: 'Discovery call booked — Wed 10am',            time: '4m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Testimonial req',  action: 'Sent to client completing 12-week programme', time: '9m ago',    color: '#fec871' },
    { icon: '🔁', name: 'Proposal follow-up',action: 'Auto SMS: "Any questions about the proposal?"', time: '16m ago', color: '#ff0199' },
    { icon: '💬', name: 'Ben Matthews',    action: 'Group programme enquiry via website',          time: '23m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Re-engagement',    action: 'Alumni: "Ready for your next step?"',         time: '30m ago',   color: '#00ebc1' },
  ],
  'pet services': [
    { icon: '💬', name: 'Lucy Tan',        action: 'Grooming enquiry — cavoodle, full groom',     time: 'just now',  color: '#844bfe' },
    { icon: '✅', name: 'Auto-reply sent',  action: 'Availability + booking link sent',            time: '9s',        color: '#00ebc1' },
    { icon: '📅', name: 'Oscar (Labrador)', action: 'Groom booked — Sat 9am',                     time: '3m ago',    color: '#844bfe' },
    { icon: '⭐', name: 'Review request',   action: 'Sent to Jess after Bella\'s groom',          time: '8m ago',    color: '#fec871' },
    { icon: '🔁', name: 'Rebook reminder', action: '"Time for Oscar\'s next groom — 6 weeks!"',   time: '14m ago',   color: '#ff0199' },
    { icon: '💬', name: 'Tom Reid',        action: 'Dog wash + nail trim enquiry',                 time: '21m ago',   color: '#844bfe' },
    { icon: '✅', name: 'Loyalty offer',    action: '5th visit reward: 10% off sent automatically',time: '28m ago',   color: '#00ebc1' },
  ],
}

const PIPELINE_STAGES = [
  { label: 'New Lead',   count: 12, color: '#844bfe' },
  { label: 'Contacted',  count: 8,  color: '#00ebc1' },
  { label: 'Proposal',   count: 5,  color: '#fec871' },
  { label: 'Won',        count: 3,  color: '#00ebc1' },
]

const NICHES = ['hair salons', 'gyms', 'med spas', 'mortgage brokers', 'chiropractors', 'tradies', 'real estate agents', 'accountants', 'cleaners', 'coaches', 'pet services'] as const

/* ── Niche-aware notification feed ── */
function NotificationFeed({ nicheIndex }: { nicheIndex: number }) {
  const niche = NICHES[nicheIndex]
  const pool = NICHE_NOTIFICATIONS[niche]
  const [items, setItems] = useState(pool.slice(0, 4))

  // Reset feed when niche changes
  useEffect(() => {
    setItems(NICHE_NOTIFICATIONS[NICHES[nicheIndex]].slice(0, 4))
  }, [nicheIndex])

  useEffect(() => {
    let i = 4
    const interval = setInterval(() => {
      const currentPool = NICHE_NOTIFICATIONS[NICHES[nicheIndex]]
      const next = currentPool[i % currentPool.length]
      setItems((prev) => [next, ...prev.slice(0, 3)])
      i++
    }, 3200)
    return () => clearInterval(interval)
  }, [nicheIndex])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <AnimatePresence mode="popLayout">
        {items.map((item, idx) => (
          <motion.div
            key={`${item.name}-${item.time}-${idx}`}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px',
              opacity: idx === 0 ? 1 : idx === 1 ? 0.75 : 0.5,
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: `${item.color}18`, border: `1px solid ${item.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#ffffff', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(240,237,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.action}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(240,237,255,0.25)', flexShrink: 0 }}>{item.time}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function PipelineBar() {
  const total = PIPELINE_STAGES.reduce((a, b) => a + b.count, 0)
  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
        {PIPELINE_STAGES.map((s) => (
          <motion.div
            key={s.label}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ flex: s.count / total, background: s.color, transformOrigin: 'left', opacity: 0.85 }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {PIPELINE_STAGES.map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
            <span style={{ fontSize: '10px', color: 'rgba(240,237,255,0.45)' }}>{s.label}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(240,237,255,0.7)' }}>{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductMockup({ nicheIndex }: { nicheIndex: number }) {
  const niche = NICHES[nicheIndex]
  const nicheLabel = niche.charAt(0).toUpperCase() + niche.slice(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'rgba(10,6,18,0.95)',
        border: '1px solid rgba(132,75,254,0.2)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(132,75,254,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        width: '100%',
        maxWidth: '480px',
      }}
    >
      {/* Window chrome */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: '8px',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'rgba(240,237,255,0.25)', fontFamily: 'monospace' }}>
          app.shouldermonkey.co
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ebc1', boxShadow: '0 0 6px #00ebc1', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: '10px', color: '#00ebc1', fontWeight: 600 }}>LIVE</span>
        </div>
      </div>

      {/* Sidebar + content */}
      <div style={{ display: 'flex', height: '380px' }}>
        {/* Sidebar */}
        <div style={{
          width: '44px', borderRight: '1px solid rgba(255,255,255,0.05)',
          padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.01)',
        }}>
          {['🎯', '📅', '💬', '📊', '⭐', '⚡'].map((icon, i) => (
            <div key={i} style={{
              width: '30px', height: '30px', borderRadius: '7px',
              background: i === 0 ? 'rgba(132,75,254,0.2)' : 'transparent',
              border: i === 0 ? '1px solid rgba(132,75,254,0.3)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
            }}>
              {icon}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top bar — niche-aware */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={nicheLabel}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', marginBottom: '1px' }}>{nicheLabel}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(240,237,255,0.35)' }}>All automations running</div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div style={{
              padding: '3px 8px', borderRadius: '100px',
              background: 'rgba(0,235,193,0.12)', border: '1px solid rgba(0,235,193,0.2)',
              fontSize: '10px', fontWeight: 600, color: '#00ebc1',
            }}>
              ↑ 24% this week
            </div>
          </div>

          {/* Notification feed */}
          <div style={{ padding: '10px 12px', flex: 1, overflow: 'hidden' }}>
            <NotificationFeed nicheIndex={nicheIndex} />
          </div>

          {/* Pipeline */}
          <div style={{
            padding: '10px 14px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(240,237,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pipeline</div>
            <PipelineBar />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(() => {
      window.location.href = `https://buy.stripe.com/00gcN5e1NeSa6oOchPg7e01?prefilled_email=${encodeURIComponent(email)}`
    }, 600)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          padding: '1rem 1.5rem', borderRadius: '100px',
          background: 'rgba(0,235,193,0.08)', border: '1px solid rgba(0,235,193,0.25)',
          display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '440px',
        }}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,235,193,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2 2L8.5 2" stroke="#00ebc1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontSize: '0.9rem', color: 'rgba(240,237,255,0.8)', fontWeight: 500 }}>Got it — taking you to your trial now</span>
      </motion.div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '440px' }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            flex: 1, padding: '0.875rem 1.25rem', borderRadius: '100px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(132,75,254,0.25)',
            color: '#ffffff', fontSize: '0.9375rem', outline: 'none', minWidth: 0,
            transition: 'border-color 0.2s ease', fontFamily: 'inherit',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(132,75,254,0.6)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(132,75,254,0.25)' }}
        />
        <button type="submit" className="btn-primary" style={{ padding: '0.875rem 1.5rem', fontSize: '0.9rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Start Free Trial
        </button>
      </form>
      {/* Risk reversal */}
      <div style={{ marginTop: '0.625rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 3v3.5l2 1" stroke="rgba(240,237,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: '0.775rem', color: 'rgba(240,237,255,0.28)', fontWeight: 500 }}>
          14-day free trial · Card captured, not charged until day 15 · Cancel anytime
        </span>
      </div>
    </div>
  )
}

/* ── Social proof avatars ── */
const AVATAR_INITIALS = ['TH', 'BR', 'JT', 'MD', 'PK', 'SC']
const AVATAR_COLORS   = ['#ff0199', '#844bfe', '#00ebc1', '#fec871', '#a673ff', '#00ebc1']

function SocialProofChip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        padding: '8px 16px 8px 8px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '100px',
        marginBottom: '2rem',
      }}
    >
      {/* Live dot */}
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ebc1', boxShadow: '0 0 8px #00ebc1', flexShrink: 0, animation: 'pulse-glow 2s infinite' }} />

      {/* Text */}
      <span style={{ fontSize: '12.5px', color: 'rgba(240,237,255,0.6)', fontWeight: 500, whiteSpace: 'nowrap' }}>
        The all-in-one platform for service businesses · AU, NZ & worldwide
      </span>
    </motion.div>
  )
}

export default function Hero() {
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [200, 1400], [1, 0])
  const heroY = useTransform(scrollY, [0, 1400], [0, -50])

  const [nicheIndex, setNicheIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setNicheIndex((i) => (i + 1) % NICHES.length), 2800)
    return () => clearInterval(t)
  }, [])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: '#030108',
        overflow: 'hidden',
        paddingTop: '68px',
      }}
    >
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(132,75,254,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,235,193,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <motion.div style={{ y: heroY, opacity: heroOpacity, width: '100%' }}>
        <div
          style={{
            maxWidth: '1280px', margin: '0 auto',
            padding: 'clamp(3rem, 8vw, 5rem) 2rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left: Copy */}
          <div>
            <SocialProofChip />

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)',
                fontWeight: 800, lineHeight: 1.06,
                letterSpacing: '-0.03em', color: '#ffffff',
                marginBottom: '1.25rem',
              }}
            >
              Stop losing leads.<br />
              Start winning<br />
              <span className="text-gradient-purple">clients.</span>
            </motion.h1>

            {/* Subheadline — tightened into two punchy lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '0.75rem', maxWidth: '460px' }}
            >
              <p style={{ fontSize: 'clamp(1rem, 1.75vw, 1.125rem)', color: 'rgba(240,237,255,0.7)', lineHeight: 1.65, marginBottom: '0.5rem', fontWeight: 500 }}>
                One platform that captures leads, follows up automatically, and fills your calendar.
              </p>
              <p style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', color: 'rgba(240,237,255,0.4)', lineHeight: 1.65 }}>
                Replaces 12+ tools. Pre-configured for your business. Live the same day.
              </p>
            </motion.div>

            {/* Rotating niche */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.3)', marginBottom: '2rem', fontStyle: 'italic' }}
            >
              Built for{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={NICHES[nicheIndex]}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #844bfe, #00ebc1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontStyle: 'normal',
                    fontWeight: 600,
                  }}
                >
                  {NICHES[nicheIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Email capture + risk reversal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginBottom: '1.5rem' }}
            >
              <EmailCapture />
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <a href="#how-it-works" style={{
                  fontSize: '0.875rem', color: 'rgba(240,237,255,0.38)',
                  textDecoration: 'none', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '5px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.75)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.38)' }}
                >
                  See how it works
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </motion.div>

            {/* Bottom trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              {[
                { icon: '🌏', text: 'AU · NZ · Global' },
                { icon: '⚡', text: 'Live day one' },
                { icon: '🔓', text: 'No lock-in' },
              ].map((t) => (
                <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px' }}>{t.icon}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(240,237,255,0.3)', fontWeight: 500 }}>{t.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Niche-aware product mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ProductMockup nicheIndex={nicheIndex} />
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div style={{
            maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 2rem',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
          }}>
            {[
              { value: '12+',    label: 'Tools replaced' },
              { value: '14',     label: 'Day free trial' },
              { value: '<24h',   label: 'To go live' },
              { value: '$1.4k',  label: 'Saved per month' },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-syne), sans-serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800,
                  background: 'linear-gradient(135deg, #a673ff, #844bfe)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  lineHeight: 1, marginBottom: '4px',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(240,237,255,0.35)', fontWeight: 500, letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
