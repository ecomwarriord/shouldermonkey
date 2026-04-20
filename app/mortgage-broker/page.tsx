'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#080d1a',
  surface:  '#0e1527',
  text:     '#f8f9ff',
  muted:    'rgba(248,249,255,0.42)',
  subtle:   'rgba(248,249,255,0.2)',
  accent:   '#d4a04a',
  accentLt: 'rgba(212,160,74,0.08)',
  border:   'rgba(212,160,74,0.15)',
  borderHi: 'rgba(212,160,74,0.35)',
  card:     'rgba(248,249,255,0.04)',
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
  { text: 'Pre-approval submitted → Michael T.', sub: '3 lenders · best rate locked in 4 hours', color: C.accent },
  { text: 'Property alert triggered → Sarah & James W.', sub: 'New listing matches brief · notification sent', color: '#3b82f6' },
  { text: 'New enquiry → Chen L.', sub: 'Facebook ad → form → broker called within 3 min', color: C.accent },
  { text: 'Settlement follow-up → The Nguyen Family', sub: '"Congratulations on your new home!" sent', color: '#22c55e' },
  { text: '5-star review → Rebecca K.', sub: '"Best decision we ever made" — Google review', color: '#f59e0b' },
  { text: 'Refinance check → David & Anna P.', sub: '2-year check-in · potential $380/mo saving identified', color: '#3b82f6' },
  { text: 'Rate update → 847 clients', sub: 'Rate drop notification with personalised savings calc', color: C.accent },
  { text: 'Document collected → The Okafor Family', sub: 'Bank statements uploaded · auto-verified · submitted', color: '#22c55e' },
]

const REVIEWS: Review[] = [
  { name: 'Michael T.', initials: 'MT', bg: '#1d4ed8', plan: 'First Home Buyer', time: '1 day ago', text: "I'd spoken to my bank and two other brokers before finding Atlas. The difference was instant — they actually called me back, explained everything in plain English, and had my pre-approval sorted in 4 hours. Bought within the month." },
  { name: 'Sarah & James W.', initials: 'SJ', bg: '#059669', plan: 'Upgrader', time: '3 days ago', text: "The communication alone is worth it. We knew exactly where our application was at every stage. No radio silence, no chasing, no stress. Atlas made buying our second home feel genuinely easy." },
  { name: 'Rebecca K.', initials: 'RK', bg: '#7c3aed', plan: 'Investor Loan', time: '1 week ago', text: "I've done 4 investment property loans now, all through Atlas. The process gets smoother every time — they remember my portfolio, know my goals, and always find a rate I couldn't have found myself." },
  { name: 'David & Anna P.', initials: 'DA', bg: '#b45309', plan: 'Refinance', time: '2 weeks ago', text: "We'd been on a terrible rate for 3 years. Atlas did a check-in call, identified the problem in 5 minutes, and had us refinanced and saving $430/month within 6 weeks. Why did we wait so long?" },
  { name: 'The Nguyen Family', initials: 'NF', bg: '#0e7490', plan: 'First Home Buyer', time: '3 weeks ago', text: "As first home buyers, we were completely overwhelmed. Atlas walked us through everything — grants, stamp duty, the whole process. We felt supported the entire time. Our broker felt like family by settlement day." },
  { name: 'Chen L.', initials: 'CL', bg: '#be123c', plan: 'Investor Loan', time: '1 month ago', text: "The speed was unbelievable. Filled out the form on a Saturday, had a callback within 3 minutes, pre-approval by Monday. I've referred 6 people to Atlas since. They all feel the same way I do." },
]

const SEQUENCE = [
  { time: 'Sat 2:17pm', label: 'New enquiry via Facebook', icon: '📥', message: `Hi Chen! Thanks for reaching out to Atlas Finance 👋\n\nWe specialise in investment loans and our brokers know how to structure them for maximum tax efficiency.\n\nI'd love to learn more about what you're looking at. When's a good time for a quick 10-min call?` },
  { time: 'Sat 2:20pm', label: '3 minutes later (auto)', icon: '⚡', message: `Hey Chen! Marcus from Atlas here.\n\nJust sent you a quick message — want to jump on a call now? I'm free for the next 30 minutes and can answer any questions you have.\n\n→ Or book a time that suits [link]\n\nHappy to run the numbers for your situation.` },
  { time: 'Mon 9:00am', label: 'Pre-approval checklist', icon: '📋', message: `Hi Chen 😊 Great speaking on Saturday!\n\nHere's what we'll need to get your pre-approval moving:\n\n✓ Last 2 payslips / tax returns\n✓ 3 months bank statements\n✓ Existing loan statements\n\n→ Upload securely here [link]\n\nOnce received, I'll have your pre-approval within 24 hours.` },
  { time: 'Mon 2:45pm', label: 'Pre-approval submitted', icon: '🏦', message: `Chen — great news! I've submitted your application to 3 lenders.\n\nBest rate found: 5.89% p.a. (comparison 6.12%)\n\nThis gives you a borrowing capacity of $840,000.\n\n→ View your full comparison [link]\n\nI'll call you at 4pm to walk through your options.` },
  { time: 'Wed 11:30am', label: 'Settlement reminder', icon: '🔑', message: `Big day, Chen! 🎉 Settlement is TODAY at 2pm.\n\nYour conveyancer will call when it's done. I'll be in touch shortly after with your first repayment details.\n\nHere's to your new investment property — congratulations! 🥂` },
  { time: '+6 months', label: 'Rate & equity review', icon: '📈', message: `Hi Chen! 6 months since settlement — how's the property going?\n\nI've run a quick review on your loan:\n\n✓ Your equity position: ~$62,000\n✓ Current rate vs market: competitive\n✓ Cash-out potential: $55,000\n\n→ Want to explore your next purchase? [link]` },
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

export default function MortgageBrokerPage() {
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
    const timers = [1400, 2800, 4200].map((ms) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(8,13,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ ...W, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, #b8860b)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>A</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>Atlas Finance</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Mortgage Brokers · Sydney CBD</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
              {['Buy', 'Refinance', 'Invest', 'About'].map(l => (
                <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
            <button style={{
              background: C.accent, color: '#fff', fontSize: 13, fontWeight: 800,
              padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              Get Pre-Approved
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #050a15 0%, ${C.bg} 50%, #0a0d08 100%)` }} />
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(212,160,74,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(212,160,74,0.04)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ ...W, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center', padding: `clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem)` }}>

          {/* Left copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Accredited mortgage brokers · Est. 2011</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)', fontWeight: 900, color: C.text, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Your home<br />
              <span style={{ color: C.accent }}>starts here.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: C.muted, fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Sydney&apos;s most responsive mortgage brokers. Pre-approvals in 24 hours, access to 40+ lenders, and a broker who actually answers their phone.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button style={{ background: C.accent, color: '#fff', fontWeight: 900, padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                Get Pre-Approved →
              </button>
              <button style={{ border: `1px solid ${C.border}`, color: C.text, fontWeight: 500, padding: '14px 32px', borderRadius: 12, background: 'none', cursor: 'pointer', fontSize: 14 }}>
                Calculate Borrowing
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', stat: '4.9', label: '1,240 Google reviews' },
                { icon: '🏠', stat: '$2.8B', label: 'loans settled' },
                { icon: '🏦', stat: '40+', label: 'lender panel' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, color: C.text }}>{item.stat}</span>
                  <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — loan tracker */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Loan Pipeline · This Week</div>
                <div style={{ color: C.accent, fontSize: 11, fontWeight: 700 }}>April 2025</div>
              </div>
              {[
                { label: 'Active applications', value: '24', sub: 'across first home, upgrade, investment', bar: 80 },
                { label: 'Pre-approvals issued', value: '11', sub: 'this week · avg 18hr turnaround', bar: 73 },
                { label: 'Settlements this month', value: '$14.2M', sub: '9 properties · avg $1.58M', bar: 88 },
                { label: 'Avg interest rate secured', value: '5.89%', sub: 'vs 6.42% big 4 advertised', bar: 65 },
              ].map((stat, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 20 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{stat.label}</span>
                    <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{stat.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(212,160,74,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.bar}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + i * 0.12, ease: 'easeOut' }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${C.accent}, #b8860b)`, borderRadius: 999 }}
                    />
                  </div>
                  <div style={{ color: C.subtle, fontSize: 11, marginTop: 4 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }}
              style={{ marginTop: 12, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 20 }}>🎉</span>
              <div>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>Settlement just completed</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>The Nguyen Family — $1.24M in Crows Nest · 6.01% fixed 3yr</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', background: `linear-gradient(90deg, ${C.accent}, #b8860b, ${C.accent})`, padding: '10px 0' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[1,2,3,4].map(i => (
            <span key={i} style={{ color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 48 }}>
              $2.8B settled  ·  40+ lenders  ·  24hr pre-approval  ·  4.9 ★ Google  ·  1,240 five-star reviews  ·  0 leads unanswered  ·
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
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: C.text, margin: 0 }}>Atlas this month</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Loans Settled', value: 9, suffix: ' deals', change: '$14.2M total' },
              { label: 'Avg Settlement Time', value: 32, suffix: ' days', change: 'vs 62 day avg' },
              { label: 'Client Referral Rate', value: 67, suffix: '%', change: 'word of mouth' },
              { label: 'Pre-Approval Rate', value: 94, suffix: '%', change: 'applications approved' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24 }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 10 }}>
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: C.accentLt, padding: '3px 10px', borderRadius: 999 }}>{s.change}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Journey ───────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Client Journey</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>
                From first enquiry to settlement, automated
              </h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto' }}>
                Every lead gets a personal response in minutes — then stays informed at every step until the keys are in their hand.
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
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accentLt, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                        {step.icon}
                      </div>
                      {i < SEQUENCE.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, margin: '4px 0', minHeight: 40 }} />}
                    </div>
                    <div style={{ paddingBottom: 24, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ color: C.muted, fontSize: 11, fontWeight: 700 }}>{step.time}</span>
                        <span style={{ background: C.accentLt, color: C.accent, fontSize: 11, padding: '2px 10px', borderRadius: 999, fontWeight: 600 }}>{step.label}</span>
                      </div>
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 16px', maxWidth: 320 }}>
                        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.65, whiteSpace: 'pre-line' }}>{step.message}</div>
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
                  <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Brokerage Performance</div>
                  {[
                    { label: 'Avg response to enquiry', value: '< 4 min' },
                    { label: 'Pre-approval turnaround', value: '18 hrs' },
                    { label: 'Settlement success rate', value: '94%' },
                    { label: 'Client referral rate', value: '67%' },
                    { label: 'Staff time on admin', value: '−74%' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', paddingBottom: i < 4 ? 12 : 0, marginBottom: i < 4 ? 12 : 0 }}>
                      <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ background: `linear-gradient(135deg, ${C.accent}, #b8860b)`, borderRadius: 20, padding: 24, color: '#fff' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 8 }}>Settled this month</div>
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: 4 }}>$14.2M</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>across 9 settlements · managed automatically</div>
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
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Client Stories</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>1,240 happy homeowners</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Stars />
                <span style={{ fontWeight: 800, color: C.text }}>4.9</span>
                <span style={{ color: C.muted, fontSize: 13 }}>· 1,240 Google reviews · Sydney&apos;s highest-rated mortgage broker</span>
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
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Live Activity</div>
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, color: C.text, marginBottom: 32 }}>Working for our clients, right now</h2>
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
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(212,160,74,0.04)', filter: 'blur(80px)' }} />
        </div>
        <div style={{ ...W, maxWidth: 860, textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,53,245,0.1)', border: '1px solid rgba(107,53,245,0.3)', borderRadius: 999, padding: '8px 20px', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purple }} />
              <span style={{ color: '#a673ff', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>The system behind Atlas Finance</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(240,237,255,0.4)', fontSize: 18, marginBottom: 16 }}>Atlas doesn&apos;t run on spreadsheets and cold calls.</p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#f0edff' }}>It runs on </span>
              <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shoulder Monkey.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'rgba(240,237,255,0.5)', fontSize: 17, maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
              Every lead followed up in minutes. Every application tracked automatically. Every client informed at every step. So brokers focus on closing deals, not chasing paperwork.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56, textAlign: 'left' }}>
              {[
                { icon: '⚡', label: 'Instant lead response', desc: 'Every enquiry called back within minutes, automatically' },
                { icon: '📋', label: 'Document collection', desc: 'Automated requests, uploads, and verification — zero chasing' },
                { icon: '🏦', label: 'Lender comparison', desc: 'Clients see personalised rate comparisons instantly' },
                { icon: '🔔', label: 'Settlement tracking', desc: 'Milestone updates keep clients calm and informed' },
                { icon: '⭐', label: 'Review generation', desc: 'Post-settlement reviews requested at exactly the right moment' },
                { icon: '🔁', label: 'Refinance check-ins', desc: '2-year equity and rate reviews sent automatically' },
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
                Ready to run your brokerage on autopilot?
              </div>
              <p style={{ color: 'rgba(240,237,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Setup in 7 days. More leads converted, less time on admin.
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
    </div>
  )
}
