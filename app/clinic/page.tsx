'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#f8faff',
  surface:  '#eef4ff',
  text:     '#0f1829',
  muted:    'rgba(15,24,41,0.48)',
  subtle:   'rgba(15,24,41,0.22)',
  accent:   '#0284c7',
  accentLt: 'rgba(2,132,199,0.08)',
  border:   'rgba(2,132,199,0.15)',
  borderHi: 'rgba(2,132,199,0.35)',
  card:     'rgba(255,255,255,0.85)',
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
  { text: 'Appointment booked → Sarah M.', sub: 'Online form → confirmed SMS in 45 seconds', color: C.accent },
  { text: 'Recall reminder sent → David T.', sub: 'Annual check-up due · appointment booked', color: '#059669' },
  { text: 'New patient enquiry → Linda R.', sub: 'Google search → intake form → nurse notified', color: C.accent },
  { text: 'Post-consult follow-up → James O.', sub: '"How are you feeling?" · patient replied "much better"', color: '#059669' },
  { text: 'Review request sent → Anna K.', sub: '5-star Google review received 12 minutes later', color: '#f59e0b' },
  { text: 'Referral follow-up → Mark S.', sub: 'Specialist referral tracked · appointment confirmed', color: C.accent },
  { text: 'No-show re-engaged → Chen W.', sub: 'Missed appointment · rebooked within 2 hours', color: '#9333ea' },
  { text: 'Payment collected → Patricia L.', sub: 'Gap invoice paid · receipt sent automatically', color: '#059669' },
]

const REVIEWS: Review[] = [
  { name: 'Sarah M.', initials: 'SM', bg: '#0284c7', plan: 'Private Patient', time: '2 days ago', text: "The level of follow-up after my procedure was extraordinary. A nurse checked in the next day, I got a reminder about my next appointment, and the whole process felt genuinely caring." },
  { name: 'David T.', initials: 'DT', bg: '#059669', plan: 'Corporate Health', time: '4 days ago', text: "I've been going to Pinnacle for 3 years. The recall system means I've never missed an annual check-up. They remember everything — it's the most organised medical practice I've ever attended." },
  { name: 'Linda R.', initials: 'LR', bg: '#7c3aed', plan: 'Private Patient', time: '1 week ago', text: "From the first phone call to walking out the door — seamless. The intake process, the appointment reminders, the after-care follow-up. This is what premium healthcare should look like." },
  { name: 'James O.', initials: 'JO', bg: '#b45309', plan: 'Family Health Plan', time: '1 week ago', text: "Genuinely impressed. The practice remembered my preferences, sent my test results the same day, and followed up to check I understood everything. Rare to find a clinic that treats you like a person." },
  { name: 'Anna K.', initials: 'AK', bg: '#0e7490', plan: 'Preventive Care', time: '2 weeks ago', text: "The preventive health reminders have been life-changing. I would have put off my skin check for another year — they prompted me, I booked, caught something early. That's the kind of care that matters." },
  { name: 'Mark S.', initials: 'MS', bg: '#be123c', plan: 'Private Patient', time: '3 weeks ago', text: "Managing specialist referrals has always been a nightmare. Pinnacle tracks everything and sends reminders when I need to follow up. I finally feel like someone's looking after my whole health picture." },
]

const SEQUENCE = [
  { time: 'Mon 9:14am', label: 'New patient enquiry', icon: '📋', message: `Hi Linda! Welcome to Pinnacle Health ✨\n\nThank you for reaching out. To ensure we match you with the right practitioner, could you briefly describe what you'd like help with?\n\nWe'll have a coordinator in touch within the hour.` },
  { time: 'Mon 9:22am', label: '8 minutes later (auto)', icon: '⚡', message: `Hi Linda! Great news — Dr Chen has availability this week.\n\n📅 Wednesday 23 Apr at 2:15pm\n📍 Level 4, 1 Pacific Hwy, North Sydney\n\n→ Confirm your appointment [link]\n\nNew patient intake form attached — takes 5 minutes.` },
  { time: 'Tue 9:00am', label: 'Intake + reminder', icon: '📎', message: `Hi Linda, your appointment with Dr Chen is tomorrow at 2:15pm.\n\n🏥 Pinnacle Health, Level 4, 1 Pacific Hwy\n\nA few things to bring:\n✓ Medicare card\n✓ Private health card\n✓ Any relevant previous results\n\nSee you tomorrow!` },
  { time: 'Wed 3:45pm', label: '90 mins post-consult', icon: '💬', message: `Hi Linda 😊 We hope your appointment with Dr Chen went well.\n\nDr Chen has noted a follow-up in 6 weeks. We'll send a reminder when it's time to book.\n\nAny questions about today? Reply here and we'll be in touch.` },
  { time: 'Thu 11:00am', label: 'Results follow-up', icon: '📊', message: `Hi Linda — your results from yesterday's consult are ready.\n\nDr Chen has reviewed them and left a summary note:\n\n→ View results + notes [secure link]\n\nIf you have any concerns, please don't hesitate to call us on (02) 9000 0000.` },
  { time: '+6 weeks', label: 'Follow-up recall', icon: '🔔', message: `Hi Linda! 👋 It's time to book your 6-week follow-up with Dr Chen.\n\nHer next available appointments:\n- Mon 2 Jun · 10:00am\n- Tue 3 Jun · 2:30pm\n- Wed 4 Jun · 9:15am\n\n→ Book your preferred time [link]` },
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

export default function ClinicPage() {
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
        background: 'rgba(248,250,255,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ ...W, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L12 22M2 12L22 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, color: C.text, fontSize: 14 }}>Pinnacle Health</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Private Medical · North Sydney</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 28, fontSize: 13 }}>
              {['Our Doctors', 'Services', 'Pathology', 'Contact'].map(l => (
                <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
            <button style={{
              background: C.accent, color: '#fff', fontSize: 13, fontWeight: 700,
              padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
            }}>
              Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.bg} 0%, #dceeff 50%, ${C.bg} 100%)` }} />
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(2,132,199,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(2,132,199,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ ...W, position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center', padding: `clamp(5rem, 10vw, 8rem) clamp(1.5rem, 4vw, 3rem)` }}>

          {/* Left copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 999, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
              <span style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Accepting new patients · North Sydney</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.2rem)', fontWeight: 900, color: C.text, lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Pinnacle Health<br />
              <span style={{ color: C.accent }}>North Sydney</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{ color: C.muted, fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
              Premium private medical care in the heart of North Sydney. GPs, specialists, and pathology — all under one roof, with follow-up that actually follows up.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button style={{ background: C.accent, color: '#fff', fontWeight: 800, padding: '14px 32px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                Book an Appointment
              </button>
              <button style={{ border: `1px solid ${C.border}`, color: C.text, fontWeight: 500, padding: '14px 32px', borderRadius: 12, background: 'none', cursor: 'pointer', fontSize: 14 }}>
                Meet Our Doctors
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
              style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', stat: '4.9', label: '847 Google reviews' },
                { icon: '👩‍⚕️', stat: '14', label: 'specialist GPs' },
                { icon: '🏥', stat: '23yr', label: 'serving North Sydney' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontWeight: 800, color: C.text }}>{item.stat}</span>
                  <span style={{ color: C.muted, fontSize: 13 }}>{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — patient portal card */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 28, boxShadow: '0 8px 40px rgba(2,132,199,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Practice Overview · Today</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 999, padding: '4px 12px' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ color: C.accent, fontSize: 11, fontWeight: 700 }}>Open now</span>
                </div>
              </div>
              {[
                { label: 'Appointments today', value: '64', sub: '6 practitioners on', bar: 85 },
                { label: 'Avg wait time', value: '4 min', sub: 'below 10-min target', bar: 92 },
                { label: 'Patient recall rate', value: '94%', sub: 'annual check-ups completed', bar: 94 },
                { label: 'Online bookings', value: '78%', sub: 'of all appointments', bar: 78 },
              ].map((stat, i) => (
                <div key={i} style={{ marginBottom: i < 3 ? 18 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ color: C.muted, fontSize: 12 }}>{stat.label}</span>
                    <span style={{ color: C.accent, fontWeight: 800, fontSize: 13 }}>{stat.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(2,132,199,0.08)', borderRadius: 999, overflow: 'hidden' }}>
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
              style={{ marginTop: 12, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(2,132,199,0.06)' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>New patient just booked</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>Linda R. — confirmed with Dr Chen, intake form sent</div>
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
              4.9 ★ on Google  ·  64 appointments today  ·  94% recall rate  ·  4 min avg wait  ·  14 specialist GPs  ·  accepting new patients  ·
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
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, color: C.text, margin: 0 }}>Pinnacle by the numbers</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Monthly Appointments', value: 1420, change: '+18% vs last year' },
              { label: 'Patient Recall Rate', value: 94, suffix: '%', change: 'industry avg 61%' },
              { label: 'Avg Review Score', value: 49, prefix: '', suffix: '', change: '847 Google reviews' },
              { label: 'Online Booking Rate', value: 78, suffix: '%', change: 'was 34% in 2022' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(2,132,199,0.04)' }}>
                  <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 10 }}>
                    {s.label === 'Avg Review Score'
                      ? <span>4.9</span>
                      : <Counter to={s.value} prefix={s.prefix || ''} suffix={s.suffix || ''} />
                    }
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, background: C.accentLt, padding: '3px 10px', borderRadius: 999 }}>{s.change}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Patient Journey ──────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>Patient Journey</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>
                From enquiry to ongoing care, seamlessly
              </h2>
              <p style={{ color: C.muted, maxWidth: 480, margin: '0 auto' }}>
                Every patient gets a confirmed appointment, intake form, reminders, results, and follow-up — without a single manual step.
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
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px 16px 16px 4px', padding: '12px 16px', maxWidth: 320, boxShadow: '0 2px 12px rgba(2,132,199,0.05)' }}>
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
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 16, boxShadow: '0 4px 20px rgba(2,132,199,0.05)' }}>
                  <div style={{ color: C.accent, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Patient Experience Results</div>
                  {[
                    { label: 'Time to booking confirmation', value: '< 2 min' },
                    { label: 'Patients who rebook', value: '94%' },
                    { label: 'No-show rate', value: '4.2%' },
                    { label: 'Patient satisfaction score', value: '4.9 / 5.0' },
                    { label: 'Staff time on phone bookings', value: '−68%' },
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
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>New patients this month</div>
                  <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 4 }}><Counter to={86} /></div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>from automated intake alone — zero phone tag</div>
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
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>What our patients say</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Stars />
                <span style={{ fontWeight: 800, color: C.text }}>4.9</span>
                <span style={{ color: C.muted, fontSize: 13 }}>· 847 Google reviews · North Sydney&apos;s highest-rated clinic</span>
              </div>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            <AnimatePresence>
              {REVIEWS.slice(0, reviewsVisible).map((r) => (
                <motion.div key={r.name} layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(2,132,199,0.04)' }}>
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
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, color: C.text, marginBottom: 32 }}>Happening right now at Pinnacle</h2>
          </Reveal>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {liveItems.map((item, i) => (
                <motion.div key={`${item.text}-${i}`} layout
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(2,132,199,0.04)' }}>
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
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'rgba(2,132,199,0.05)', filter: 'blur(80px)' }} />
        </div>
        <div style={{ ...W, maxWidth: 860, textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,53,245,0.1)', border: '1px solid rgba(107,53,245,0.3)', borderRadius: 999, padding: '8px 20px', marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.purple }} />
              <span style={{ color: '#a673ff', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>The system behind Pinnacle</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(240,237,255,0.4)', fontSize: 18, marginBottom: 16 }}>Pinnacle doesn&apos;t run on phone calls and paper.</p>
            <h2 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#f0edff' }}>It runs on </span>
              <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Shoulder Monkey.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'rgba(240,237,255,0.5)', fontSize: 17, maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
              Every appointment booked. Every patient followed up. Every result delivered. Every recall sent. All automatic — so your practitioners focus on patient care, not admin.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 56, textAlign: 'left' }}>
              {[
                { icon: '📋', label: 'Online intake & booking', desc: 'New patients booked and onboarded without a phone call' },
                { icon: '🔔', label: 'Recall & reminders', desc: 'Annual check-ups, referrals, and follow-ups on autopilot' },
                { icon: '📊', label: 'Results delivery', desc: 'Pathology and consult notes delivered securely, automatically' },
                { icon: '⭐', label: 'Review generation', desc: 'Sent at the right moment — building your Google rating daily' },
                { icon: '💳', label: 'Gap billing & payments', desc: 'Invoices sent, payments collected, receipts issued automatically' },
                { icon: '🔁', label: 'No-show re-engagement', desc: 'Missed appointments rebooked with a single automated message' },
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
                Ready to modernise your practice?
              </div>
              <p style={{ color: 'rgba(240,237,255,0.5)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Setup takes 7 days. Your staff will wonder how they ever managed without it.
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
