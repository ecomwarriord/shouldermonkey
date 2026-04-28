'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { NicheEnquiryForm } from '../../components/NicheEnquiryForm'
import { useEffect, useRef, useState } from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#07090a',
  surface:  '#0d1210',
  text:     '#f0fff4',
  muted:    'rgba(240,255,244,0.45)',
  subtle:   'rgba(240,255,244,0.22)',
  accent:   '#22c55e',
  accentLt: 'rgba(34,197,94,0.08)',
  border:   'rgba(34,197,94,0.15)',
  borderHi: 'rgba(34,197,94,0.35)',
  card:     'rgba(34,197,94,0.04)',
  purple:   '#6b35f5',
  cyan:     '#00ebc1',
}

const W: React.CSSProperties = {
  width: '100%', maxWidth: 1240,
  margin: '0 auto',
  padding: '0 clamp(1.5rem, 4vw, 3rem)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Activity { text: string; sub: string; color: string }
interface Review { name: string; initials: string; text: string; plan: string; time: string; bg: string }

const LIVE_ACTIVITY: Activity[] = [
  { text: 'Trial booked → Jess W.', sub: 'Instagram DM → auto-replied → booked in 4 min', color: C.accent },
  { text: 'Membership renewed → Tom H.', sub: '$89/mo · card on file · auto-receipt sent', color: '#3b82f6' },
  { text: 'No-show follow-up → Ryan K.', sub: '"We missed you — rebook your session" sent', color: '#f59e0b' },
  { text: 'New lead → Marcus B.', sub: 'Google search → form → SMS reply in 90 seconds', color: C.accent },
  { text: '5-star review → Priya M.', sub: '"The progress tracking is next level" ⭐⭐⭐⭐⭐', color: '#f59e0b' },
  { text: 'Lapsed member re-engaged → Sam T.', sub: "Hadn't visited in 3 weeks · win-back offer accepted", color: '#3b82f6' },
  { text: '$189 collected → Chloe R.', sub: '3-month program · payment plan · auto-scheduled', color: C.accent },
  { text: 'PT session booked → Daniel L.', sub: 'Automated availability check → confirmed instantly', color: '#3b82f6' },
]

const REVIEWS: Review[] = [
  { name: 'Tom H.', initials: 'TH', bg: '#1d4ed8', plan: 'Elite Membership', time: '1 day ago', text: "I've tried 4 gyms in Bondi. Apex is the only one where I actually feel like they know who I am. The check-ins and progress updates are a game changer." },
  { name: 'Priya M.', initials: 'PM', bg: '#059669', plan: 'PT + Membership', time: '3 days ago', text: "My PT sessions are tracked, my meals are logged, my progress is monitored — and I get a weekly summary SMS. No other gym does this. It's like having a coach 24/7." },
  { name: 'Sam T.', initials: 'ST', bg: '#7c3aed', plan: 'Foundation Plan', time: '1 week ago', text: "Missed a week due to work and they texted me to check in. Not in a pushy sales way — genuinely checking in. That kind of care is rare. I'm a member for life." },
  { name: 'Jess W.', initials: 'JW', bg: '#b45309', plan: 'Elite Membership', time: '2 weeks ago', text: "From my first DM to walking through the door took less than 10 minutes. Everything was instant. This is what fitness should feel like in 2025." },
  { name: 'Ryan K.', initials: 'RK', bg: '#0e7490', plan: 'Group Classes', time: '2 weeks ago', text: "The app sends me class reminders, my trainer sends me check-ins, and I get a motivation message every Monday morning. I haven't missed a session in 6 weeks." },
  { name: 'Chloe R.', initials: 'CR', bg: '#be123c', plan: '3-Month Program', time: '3 weeks ago', text: "Signed up for the 3-month transformation and the automated progress tracking alone is worth the price. I can see exactly where I'm heading. Down 8kg in 10 weeks." },
]

const SEQUENCE = [
  { time: 'Mon 6:32pm', label: 'Lead submits form', icon: '📥', message: `Hi Jess! 👋 Thanks for your interest in Apex Performance.\n\nWe'd love to show you around. When works best for a free tour?\n\n→ Book your visit [link]\n\nOr reply with a time and we'll lock it in!` },
  { time: 'Mon 6:33pm', label: '90 seconds later (auto)', icon: '⚡', message: `Hey Jess! Quick one — your free tour at Apex is confirmed:\n\n📅 Tomorrow, Tue 22 Apr at 10am\n📍 Shop 2, Hall St, Bondi Beach\n\nBring your gym gear — we'll get you started on the floor 💪` },
  { time: 'Tue 8:00am', label: 'Morning of tour', icon: '🗺️', message: `Morning Jess! See you at 10am today 🙌\n\n📍 Shop 2, Hall St, Bondi Beach\n🚗 Parking on Campbell Pde\n\nAsk for Jake at reception — he'll take great care of you!` },
  { time: 'Tue 1:30pm', label: '3 hours after tour', icon: '💬', message: `Hi Jess! So great meeting you today 💪\n\nIf you're ready to get started, here's your sign-up link — 7 day free trial, no lock-in:\n\n→ Start your trial [link]\n\nAny questions? Just reply here!` },
  { time: 'Wed 9:00am', label: 'If no signup yet', icon: '🔁', message: `Hey Jess! Jake here from Apex 👋\n\nJust wanted to check in — did you get a chance to look at the trial?\n\nWe're running a special this week: first month half price if you start before Friday.\n\n→ Claim offer [link]` },
  { time: 'Fri 10:00am', label: 'Last chance offer', icon: '⏰', message: `Hi Jess — last reminder about the half-price first month at Apex 🏋️\n\nOffer closes tonight at midnight.\n\n→ Grab it now [link]\n\nEither way, it was great meeting you. Hope to see you on the floor!` },
]

// ─── Primitives ───────────────────────────────────────────────────────────────

function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, { duration: 2.4, ease: 'easeOut', onUpdate: v => setVal(Math.floor(v)) })
    return ctrl.stop
  }, [inView, to])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GymPage() {
  const [navOpen, setNavOpen] = useState(false)
  const [liveItems, setLiveItems] = useState<Activity[]>(LIVE_ACTIVITY.slice(0, 3))
  const [reviewsVisible, setReviewsVisible] = useState(3)
  const liveRef = useRef(null)
  const reviewRef = useRef(null)
  const liveInView = useInView(liveRef, { once: true })
  const reviewInView = useInView(reviewRef, { once: true })
  const liveIndex = useRef(3)

  useEffect(() => {
    if (!liveInView) return
    const interval = setInterval(() => {
      setLiveItems(prev => [LIVE_ACTIVITY[liveIndex.current % LIVE_ACTIVITY.length], ...prev].slice(0, 6))
      liveIndex.current++
    }, 2000)
    return () => clearInterval(interval)
  }, [liveInView])

  useEffect(() => {
    if (!reviewInView) return
    const timers = [1400, 2800, 4200].map((_, i) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), [1400, 2800, 4200][i])
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(7,9,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ ...W, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#000', fontSize: 11, fontWeight: 900 }}>AP</span>
            </div>
            <div>
              <div style={{ fontWeight: 900, color: C.text, fontSize: 13, letterSpacing: '0.12em' }}>APEX</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Performance Gym · Bondi</div>
            </div>
          </div>
          <div className="sm-desktop-only" style={{ alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28, color: C.muted, fontSize: 13 }}>
              {['Training', 'Coaches', 'Memberships'].map(l => (
                <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
            <button style={{ background: C.accent, color: '#000', fontSize: 13, fontWeight: 800, padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
              Free Trial →
            </button>
          </div>
          <button className="sm-mobile-only" onClick={() => setNavOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}>
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: C.text, transition: 'all 0.2s', transform: navOpen && i === 0 ? 'translateY(7px) rotate(45deg)' : navOpen && i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none', opacity: navOpen && i === 1 ? 0 : 1 }} />)}
          </button>
        </div>
        {navOpen && (
          <div style={{ background: 'rgba(7,9,10,0.97)', borderTop: `1px solid ${C.border}`, padding: '1.5rem clamp(1.5rem, 4vw, 3rem)' }}>
            {['Training', 'Coaches', 'Memberships'].map(l => (
              <a key={l} href="#" onClick={() => setNavOpen(false)} style={{ display: 'block', color: C.text, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>{l}</a>
            ))}
            <button style={{ marginTop: 20, background: C.accent, color: '#000', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer', width: '100%' }}>Free Trial →</button>
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
        {/* bg gradients */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #071a07 0%, ${C.bg} 50%, #07090f 100%)` }} />
        <div style={{ position: 'absolute', top: '30%', right: 0, width: 600, height: 600, borderRadius: '50%', background: 'rgba(34,197,94,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '25%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,197,94,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ ...W, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center', padding: `clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem)` }}>

          {/* Left copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', border: `1px solid rgba(34,197,94,0.28)`, borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Now accepting members · Bondi Beach, Sydney</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 900, color: C.text, lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 16 }}>
              APEX<br />
              <span style={{ color: C.accent }}>Performance</span><br />
              Gym
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: C.muted, fontSize: 17, lineHeight: 1.65, marginBottom: 32, maxWidth: 420 }}>
              Bondi&apos;s most results-driven gym. Personal training, group classes, and a system that actually keeps you accountable.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
              <button style={{ background: C.accent, color: '#000', fontWeight: 900, padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13 }}>
                Start Free Trial
              </button>
              <button style={{ border: `1px solid rgba(240,255,244,0.12)`, color: C.text, fontWeight: 500, padding: '14px 32px', borderRadius: 12, background: 'none', cursor: 'pointer', fontSize: 13 }}>
                View Memberships
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', stat: '4.9', label: '612 Google reviews' },
                { icon: '💪', stat: '340+', label: 'active members' },
                { icon: '🏆', stat: '8', label: 'certified coaches' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, color: C.text }}>{item.stat}</span>
                  <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — dashboard */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <div style={{ background: '#0d1210', border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
              <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>
                Member Dashboard · Live
              </div>
              {[
                { label: 'Sessions this week', value: '847', unit: 'total across all members', bar: 85 },
                { label: 'New member trials', value: '24', unit: 'this month · 71% converted', bar: 71 },
                { label: 'Avg member retention', value: '11.4', unit: 'months', bar: 95 },
                { label: 'Revenue this month', value: '$47,200', unit: 'recurring memberships', bar: 78 },
              ].map((stat, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 20 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{stat.label}</span>
                    <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{stat.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(240,255,244,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.bar}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', background: C.accent, borderRadius: 999 }}
                    />
                  </div>
                  <div style={{ color: C.subtle, fontSize: 11, marginTop: 4 }}>{stat.unit}</div>
                </div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }}
              style={{ marginTop: 12, background: 'rgba(34,197,94,0.08)', border: `1px solid rgba(34,197,94,0.18)`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <div>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>New lead just replied</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Marcus B. — auto-replied in 90 seconds, tour booked</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', background: C.accent, padding: '12px 0' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[1,2,3,4].map(i => (
            <span key={i} style={{ color: '#000', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: 48 }}>
              340+ active members  ·  73% trial-to-member rate  ·  $47,200 MRR  ·  11.4mo avg retention  ·  0 leads left uncontacted  ·
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Metrics ──────────────────────────────────────────────────────── */}
      <section style={{ background: C.surface, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>April 2025</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: C.text, margin: 0 }}>Apex this month</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Monthly Revenue', value: 47200, prefix: '$', change: '+22%' },
              { label: 'Active Members', value: 340, change: '+41 this month' },
              { label: 'Trial Conversion', value: 73, suffix: '%', change: 'industry avg 45%' },
              { label: 'Avg Retention', value: 11, suffix: '.4mo', change: 'industry avg 4.2mo' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 10 }}>
                    <Counter to={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: C.accentLt, padding: '3px 10px', borderRadius: 999 }}>{s.change}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead sequence ────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Lead Conversion</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>
                From enquiry to member, automatically
              </h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto' }}>
                Every lead gets a personal response in under 2 minutes — no matter when they enquire.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 56, alignItems: 'start' }}>
            {/* Sequence */}
            <div>
              {SEQUENCE.map((step, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentLt, border: `1px solid rgba(34,197,94,0.28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {step.icon}
                      </div>
                      {i < SEQUENCE.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(34,197,94,0.12)', margin: '4px 0', minHeight: 40 }} />}
                    </div>
                    <div style={{ paddingBottom: 24, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>{step.time}</span>
                        <span style={{ background: C.accentLt, color: C.accent, fontSize: 11, padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>{step.label}</span>
                      </div>
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 16px', maxWidth: 300 }}>
                        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{step.message}</div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Stats panel */}
            <div style={{ position: 'sticky', top: 96 }}>
              <Reveal delay={0.2}>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16 }}>
                  <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Conversion Results</div>
                  {[
                    { label: 'Avg response time', value: '90 sec' },
                    { label: 'Trial bookings from leads', value: '68%' },
                    { label: 'Trial-to-member rate', value: '73%' },
                    { label: 'Revenue per lead', value: '$214' },
                    { label: 'Staff time on follow-up', value: '0 hours' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', paddingBottom: i < 4 ? 12 : 0, marginBottom: i < 4 ? 12 : 0 }}>
                      <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ background: C.accent, borderRadius: 20, padding: 24, color: '#000' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 8 }}>Members added this month</div>
                  <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 4 }}><Counter to={41} /></div>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>from automated lead sequences alone</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section ref={reviewRef} style={{ background: C.surface, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Social Proof</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>612 reasons to join</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Stars />
                <span style={{ fontWeight: 800, color: C.text }}>4.9</span>
                <span style={{ color: C.muted, fontSize: 13 }}>· 612 Google reviews · growing daily</span>
              </div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <AnimatePresence>
              {REVIEWS.slice(0, reviewsVisible).map((r) => (
                <motion.div key={r.name} layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, background: r.bg, flexShrink: 0 }}>
                        {r.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>{r.name}</div>
                        <div style={{ color: C.muted, fontSize: 11 }}>{r.plan}</div>
                      </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <Stars />
                  <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.65, marginTop: 12 }}>&ldquo;{r.text}&rdquo;</p>
                  <div style={{ color: C.subtle, fontSize: 11, marginTop: 12 }}>{r.time}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Live Feed ────────────────────────────────────────────────────── */}
      <section ref={liveRef} style={{ background: C.bg, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={{ ...W, maxWidth: 860 }}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live Activity</div>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, color: C.text, marginBottom: 32 }}>Running in the background, right now</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {liveItems.map((item, i) => (
                <motion.div key={`${item.text}-${i}`} layout
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{item.text}</div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{item.sub}</div>
                    </div>
                  </div>
                  <div style={{ color: C.subtle, fontSize: 12, marginLeft: 16, whiteSpace: 'nowrap' }}>just now</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SM Reveal ────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(to bottom, ${C.surface} 0%, #030108 50%)`, padding: 'clamp(5rem, 10vw, 8rem) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 400, borderRadius: '50%', background: 'rgba(107,53,245,0.14)', filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,197,94,0.04)', filter: 'blur(80px)' }} />
        </div>
        <div style={{ ...W, maxWidth: 860, textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,53,245,0.1)', border: '1px solid rgba(107,53,245,0.3)', borderRadius: 999, padding: '8px 20px', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purple }} />
              <span style={{ color: '#a673ff', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>The system behind Apex</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(240,237,255,0.4)', fontSize: 18, marginBottom: 16 }}>Apex doesn&apos;t run on hustle.</p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#f0edff' }}>It runs on </span>
              <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shoulder Monkey.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'rgba(240,237,255,0.5)', fontSize: 17, maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
              Every lead followed up. Every member retained. Every review generated. Every payment collected. All automatic — so your team focuses on coaching, not admin.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56, textAlign: 'left' }}>
              {[
                { icon: '⚡', label: '90-second lead response', desc: 'Every enquiry answered instantly, day or night' },
                { icon: '🔄', label: 'Trial-to-member sequences', desc: 'Automated nurture from first visit to signed member' },
                { icon: '💰', label: 'Recurring billing', desc: 'Cards on file, auto-retry, zero chasing payments' },
                { icon: '⭐', label: 'Review generation', desc: 'Sent at the perfect moment after every session' },
                { icon: '📊', label: 'Member health tracking', desc: 'Attendance, churn risk, revenue — all in real time' },
                { icon: '🔁', label: 'Win-back campaigns', desc: 'Lapsed members re-engaged automatically' },
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(15,10,30,0.8)', border: '1px solid rgba(107,53,245,0.2)', borderRadius: 20, padding: 20 }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
                  <div style={{ color: '#f0edff', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{f.label}</div>
                  <div style={{ color: 'rgba(240,237,255,0.4)', fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ background: 'linear-gradient(135deg, #1a0a3e, #0a0612)', border: '1px solid rgba(107,53,245,0.3)', borderRadius: 28, padding: 'clamp(2rem, 5vw, 3rem)' }}>
              <div style={{ color: '#f0edff', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 800, marginBottom: 12 }}>
                Ready to build this for your gym?
              </div>
              <p style={{ color: 'rgba(240,237,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                We handle the entire setup in 7 days. You keep focusing on your members.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://www.shouldermonkey.co" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.purple, color: '#fff', fontWeight: 700, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', fontSize: 14 }}>
                  Book a free strategy call →
                </a>
                <a href="https://www.shouldermonkey.co" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(107,53,245,0.4)', color: '#a673ff', fontWeight: 600, padding: '14px 32px', borderRadius: 999, textDecoration: 'none', fontSize: 14 }}>
                  See pricing
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <NicheEnquiryForm niche="gym" />
    </div>
  )
}
