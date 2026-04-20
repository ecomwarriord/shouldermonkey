'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#f7fcfa',
  surface:  '#edf7f4',
  text:     '#0a1f1a',
  muted:    'rgba(10,31,26,0.48)',
  subtle:   'rgba(10,31,26,0.22)',
  accent:   '#0d9488',
  accentLt: 'rgba(13,148,136,0.08)',
  border:   'rgba(13,148,136,0.18)',
  borderHi: 'rgba(13,148,136,0.38)',
  card:     'rgba(255,255,255,0.82)',
  green:    '#166534',
  greenBg:  'rgba(22,163,74,0.08)',
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
  { text: 'New referral → Emma T.', sub: 'GP referral received · intake form sent · appointment confirmed', color: C.accent },
  { text: 'Progress report sent → Jack M.', sub: 'Week 6 physio progress · shared with referring GP', color: '#3b82f6' },
  { text: 'Appointment reminder → Yuki S.', sub: 'Tomorrow 10am · pre-session instructions attached', color: C.accent },
  { text: 'NDIS claim lodged → Peter R.', sub: '$420 · processed automatically · receipt sent', color: '#22c55e' },
  { text: '5-star review → Natasha B.', sub: '"I can walk without pain for the first time in years"', color: '#f59e0b' },
  { text: 'Discharge planning → David L.', sub: 'Goal achieved · home exercise program sent · 6wk check-in scheduled', color: C.accent },
  { text: 'Home exercise reminder → Maria C.', sub: 'Day 3 of recovery plan · "How are you feeling?" sent', color: '#3b82f6' },
  { text: 'New DVA client → Robert H.', sub: 'DVA referral · eligibility checked · priority booking offered', color: '#22c55e' },
]

const REVIEWS: Review[] = [
  { name: 'Emma T.', initials: 'ET', bg: '#0d9488', plan: 'Post-Surgery Rehab', time: '2 days ago', text: "After my knee surgery, I was terrified I wouldn't get back to hiking. The team at Restore had a program set up before my first session, sent home exercises after every appointment, and checked in every few days. 4 months later I finished a 20km trail. I'm in tears writing this." },
  { name: 'Jack M.', initials: 'JM', bg: '#059669', plan: 'Sports Physio', time: '4 days ago', text: "The communication is what sets Restore apart. I get a recap after every session, a progress update every two weeks, and my exercises come through as videos I can actually follow. I've never been this consistent with rehab in my life." },
  { name: 'Natasha B.', initials: 'NB', bg: '#7c3aed', plan: 'Chronic Pain', time: '1 week ago', text: "I'd been managing back pain for 6 years. Three physios before Restore. The difference? They actually followed a plan and checked in between appointments. I can walk without pain for the first time in years. That's not nothing — that's everything." },
  { name: 'Peter R.', initials: 'PR', bg: '#b45309', plan: 'NDIS Client', time: '1 week ago', text: "Navigating NDIS funding was overwhelming until Restore. They handled everything — the forms, the claims, the reporting. I just focused on my recovery. The monthly NDIS reports made it easy for my support coordinator too." },
  { name: 'Yuki S.', initials: 'YS', bg: '#0e7490', plan: 'Occupational Therapy', time: '2 weeks ago', text: "The work injury process was stressful enough without admin chaos. Restore handled my insurer paperwork, kept my employer updated on my capacity, and never made me feel like a case number. I genuinely felt cared for." },
  { name: 'Maria C.', initials: 'MC', bg: '#be123c', plan: 'Pilates + Physio', time: '3 weeks ago', text: "The combination of clinical physio and the pilates program is exactly what my body needed. And the home exercise reminders actually make me do them. I've been coming here for 8 months and the improvement has been extraordinary." },
]

const SEQUENCE = [
  { time: 'Mon 11:22am', label: 'GP referral received', icon: '📋', message: `Hi Emma! Welcome to Restore Allied Health 🌿\n\nWe've received your referral from Dr Williams and would love to support your recovery.\n\nBefore your first session, could you complete our intake form? It only takes 5 minutes.\n\n→ Complete your intake [link]` },
  { time: 'Mon 11:45am', label: 'Appointment confirmed', icon: '✅', message: `Emma, you're all booked! 😊\n\n📅 Wednesday 23 Apr at 9:00am\n👤 Sam Chen — Senior Physiotherapist\n📍 5 Hume St, Crows Nest\n\nPlease wear comfortable clothing. We'll have your full treatment plan ready to discuss.\n\nSee you Wednesday!` },
  { time: 'Tue 9:00am', label: 'Pre-session prep', icon: '🧘', message: `Hi Emma! Your first session with Sam is tomorrow at 9am.\n\nA few things to bring:\n✓ Your referral (already in our system!)\n✓ Medicare card\n✓ Any previous scans or reports\n\nSam will do a full assessment and design a recovery plan just for you 🙂` },
  { time: 'Wed 11:30am', label: '2.5 hours post-session', icon: '💬', message: `Hi Emma! Hope your first session went well 🌿\n\nSam has put together your personalised exercise program:\n\n→ View your exercises (with videos) [link]\n\nAim to do these once today and twice tomorrow. I'll check in with you on Friday.\n\n— The Restore Team` },
  { time: 'Fri 9:00am', label: 'Check-in day', icon: '🔍', message: `Morning Emma! How's the knee feeling? 🙂\n\nQuick check-in after your first exercises:\n\n1. Any pain or discomfort? (reply YES or NO)\n2. Were the exercises clear and manageable?\n\nSam will review your response before your next session. We want to make sure the plan is working for you.` },
  { time: '+6 weeks', label: 'Progress review', icon: '📊', message: `Emma — 6-week progress milestone! 🎉\n\nSam has updated your progress report. Key highlights:\n\n✓ ROM improved 40°\n✓ Pain score: 7/10 → 3/10\n✓ Walking distance: 200m → 1.2km\n\n→ View full report [link]\n\nYou're on track. 4 more sessions and we'll hit your hiking goal 🏔️` },
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

export default function AlliedHealthPage() {
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
        background: 'rgba(247,252,250,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ ...W, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>🌿</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>Restore</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Allied Health · Crows Nest</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
              {['Services', 'Our Team', 'NDIS', 'Referrals'].map(l => (
                <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
            <button style={{
              background: C.accent, color: '#fff', fontSize: 13, fontWeight: 700,
              padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              Book a Session
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.bg} 0%, #d1f5ee 50%, ${C.bg} 100%)` }} />
        <div style={{ position: 'absolute', top: '-10%', right: '0%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(13,148,136,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '0%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(13,148,136,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ ...W, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center', padding: `clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem)` }}>

          {/* Left copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
              <span style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Accepting new referrals · Crows Nest, Sydney</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', fontWeight: 900, color: C.text, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Where recovery<br />
              <span style={{ color: C.accent }}>actually happens.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: C.muted, fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Physiotherapy, occupational therapy, and pilates in Crows Nest — with follow-up that&apos;s genuinely there for you between sessions.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button style={{ background: C.accent, color: '#fff', fontWeight: 800, padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                Book a Session
              </button>
              <button style={{ border: `1px solid ${C.border}`, color: C.text, fontWeight: 500, padding: '14px 32px', borderRadius: 12, background: 'none', cursor: 'pointer', fontSize: 14 }}>
                GP Referrals
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', stat: '4.9', label: '628 Google reviews' },
                { icon: '🌿', stat: '11yr', label: 'in Crows Nest' },
                { icon: '❤️', stat: '92%', label: 'goal achievement rate' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, color: C.text }}>{item.stat}</span>
                  <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — recovery progress card */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, boxShadow: '0 8px 40px rgba(13,148,136,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Practice Overview · April</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 999, padding: '4px 12px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ color: C.accent, fontSize: 11, fontWeight: 700 }}>Open now</span>
                </div>
              </div>
              {[
                { label: 'Active patients', value: '184', sub: 'across physio, OT, and pilates', bar: 80 },
                { label: 'Goal achievement rate', value: '92%', sub: 'patients reaching recovery goals', bar: 92 },
                { label: 'Avg sessions per patient', value: '8.4', sub: 'full recovery programs', bar: 70 },
                { label: 'NDIS & DVA claims', value: '47', sub: 'this month · 100% processed', bar: 100 },
              ].map((stat, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{stat.label}</span>
                    <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{stat.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(13,148,136,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.bar}%` }}
                      transition={{ duration: 1.5, delay: 0.8 + i * 0.12, ease: 'easeOut' }}
                      style={{ height: '100%', background: C.accent, borderRadius: 999 }}
                    />
                  </div>
                  <div style={{ color: C.subtle, fontSize: 11, marginTop: 4 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }}
              style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(13,148,136,0.06)' }}>
              <span style={{ fontSize: 20 }}>🎉</span>
              <div>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>Goal achieved!</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Emma T. — 6-week post-surgery check — walking 1.2km pain-free</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <div style={{ overflow: 'hidden', background: C.accent, padding: '10px 0' }}>
        <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}>
          {[1,2,3,4].map(i => (
            <span key={i} style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 48 }}>
              92% goal achievement  ·  184 active patients  ·  NDIS & DVA registered  ·  4.9 ★ Google  ·  11 years Crows Nest  ·  same-week bookings available  ·
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
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: C.text, margin: 0 }}>Restore this month</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Active Patients', value: 184, change: '+22 this month' },
              { label: 'Goal Achievement', value: 92, suffix: '%', change: 'industry avg 71%' },
              { label: 'NDIS Claims', value: 47, change: '100% processed' },
              { label: 'Google Rating', value: 49, change: '628 reviews' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(13,148,136,0.04)' }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 10 }}>
                    {s.label === 'Google Rating'
                      ? <span>4.9</span>
                      : <Counter to={s.value} suffix={s.suffix || ''} />
                    }
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: C.accentLt, padding: '3px 10px', borderRadius: 999 }}>{s.change}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recovery Journey ─────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Patient Journey</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>
                From referral to recovery, we&apos;re with you
              </h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto' }}>
                Every patient gets a personalised program, home exercise reminders, progress tracking, and check-ins between sessions — automatically.
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
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 16px', maxWidth: 320, boxShadow: '0 2px 12px rgba(13,148,136,0.05)' }}>
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
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: '0 4px 20px rgba(13,148,136,0.05)' }}>
                  <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Patient Outcomes</div>
                  {[
                    { label: 'Goal achievement rate', value: '92%' },
                    { label: 'Avg sessions to milestone', value: '4.2' },
                    { label: 'Home exercise adherence', value: '81%' },
                    { label: 'Patient satisfaction score', value: '4.9 / 5.0' },
                    { label: 'Readmission within 3mo', value: '3.4%' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none', paddingBottom: i < 4 ? 12 : 0, marginBottom: i < 4 ? 12 : 0 }}>
                      <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                      <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div style={{ background: C.accent, borderRadius: 20, padding: 24, color: '#fff' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 8 }}>Goals achieved this month</div>
                  <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 4 }}><Counter to={54} /></div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>patients reached their recovery milestone</div>
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
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Patient Stories</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>Real recoveries, real results</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Stars />
                <span style={{ fontWeight: 800, color: C.text }}>4.9</span>
                <span style={{ color: C.muted, fontSize: 13 }}>· 628 Google reviews · North Sydney&apos;s highest-rated allied health clinic</span>
              </div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <AnimatePresence>
              {REVIEWS.slice(0, reviewsVisible).map((r) => (
                <motion.div key={r.name} layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(13,148,136,0.04)' }}>
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
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, color: C.text, marginBottom: 32 }}>Supporting patients right now</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {liveItems.map((item, i) => (
                <motion.div key={`${item.text}-${i}`} layout
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(13,148,136,0.04)' }}>
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
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(13,148,136,0.05)', filter: 'blur(80px)' }} />
        </div>
        <div style={{ ...W, maxWidth: 860, textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,53,245,0.1)', border: '1px solid rgba(107,53,245,0.3)', borderRadius: 999, padding: '8px 20px', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purple }} />
              <span style={{ color: '#a673ff', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>The system behind Restore</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(240,237,255,0.4)', fontSize: 18, marginBottom: 16 }}>Restore doesn&apos;t just treat patients. It supports them between every session.</p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#f0edff' }}>It runs on </span>
              <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shoulder Monkey.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'rgba(240,237,255,0.5)', fontSize: 17, maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
              Every referral followed up. Every exercise program sent. Every progress update tracked. Every NDIS claim lodged. All automatic — so therapists focus on patients, not paperwork.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56, textAlign: 'left' }}>
              {[
                { icon: '📋', label: 'Referral intake', desc: 'GP referrals accepted and confirmed automatically — no phone tag' },
                { icon: '🧘', label: 'Home exercise delivery', desc: 'Video programs sent after every session with check-in reminders' },
                { icon: '📊', label: 'Progress reporting', desc: 'Milestone reports sent to patients, GPs, and insurers automatically' },
                { icon: '💳', label: 'NDIS & DVA billing', desc: 'Claims lodged, processed, and receipts issued without staff effort' },
                { icon: '⭐', label: 'Review generation', desc: 'Requested at recovery milestones — when patients feel the win' },
                { icon: '🔁', label: 'Discharge & recall', desc: 'Home programs on discharge, 3-month check-ins to prevent relapse' },
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
                Ready to transform your allied health practice?
              </div>
              <p style={{ color: 'rgba(240,237,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Setup in 7 days. Better outcomes, less admin, more time for patients.
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
