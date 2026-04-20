'use client'

import { motion, useInView, animate, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const SalonPlayer = dynamic(
  () => import('../../components/SalonPlayer').then(m => ({ default: m.SalonPlayer })),
  {
    ssr: false,
    loading: () => (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f4f0ea' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid rgba(184,149,106,0.2)', borderTopColor: '#b8956a', animation: 'spin 0.9s linear infinite' }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(28,21,16,0.35)' }}>Loading preview...</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    ),
  }
)

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:       '#faf8f4',
  surface:  '#f4f0ea',
  text:     '#1c1510',
  muted:    'rgba(28,21,16,0.48)',
  subtle:   'rgba(28,21,16,0.22)',
  accent:   '#b8956a',
  accentLt: 'rgba(184,149,106,0.1)',
  border:   'rgba(184,149,106,0.18)',
  borderHi: 'rgba(184,149,106,0.4)',
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

// ─── Primitives ───────────────────────────────────────────────────────────────

function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [v, setV] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 2.2, ease: 'easeOut', onUpdate: n => setV(Math.floor(n)) })
    return c.stop
  }, [inView, to])
  return <span ref={ref}>{prefix}{v.toLocaleString()}{suffix}</span>
}

function FadeUp({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

function Stars({ size = 13, color = C.accent }: { size?: number; color?: string }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 13 13" fill={color}>
          <path d="M6.5 0.5l1.4 3.3 3.6.5-2.6 2.5.6 3.5L6.5 9 3 10.3l.6-3.5L1 4.3l3.6-.5z"/>
        </svg>
      ))}
    </span>
  )
}

// ─── Phone ────────────────────────────────────────────────────────────────────

function Phone({ messages, title }: { messages: { text: string; from: 'salon'|'client'; delay: number }[]; title: string }) {
  return (
    <div style={{ position: 'relative', width: 260, height: 540, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 44,
        border: `2px solid ${C.borderHi}`,
        background: '#fff', overflow: 'hidden',
        boxShadow: `0 0 0 1px rgba(0,0,0,0.04), 0 32px 80px rgba(28,21,16,0.14), 0 8px 24px rgba(184,149,106,0.12)`,
      }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 96, height: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, background: '#fff', zIndex: 10 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 4px' }}>
          <span style={{ color: C.text, fontSize: 11, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 96 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[12,9,6].map((h,i) => <div key={i} style={{ width: 4, height: h, borderRadius: 2, background: C.text, opacity: 0.4 }} />)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>TL</div>
          <div>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>The Loft</div>
            <div style={{ color: C.muted, fontSize: 10 }}>{title}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, overflow: 'hidden' }}>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: m.delay, duration: 0.4, ease: [0.22,1,0.36,1] }}
              style={{ display: 'flex', justifyContent: m.from === 'salon' ? 'flex-start' : 'flex-end' }}>
              <div style={{
                maxWidth: '85%', borderRadius: m.from === 'salon' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                padding: '8px 12px', fontSize: 11, lineHeight: 1.55, whiteSpace: 'pre-line',
                background: m.from === 'salon' ? C.accentLt : C.accent,
                color: m.from === 'salon' ? C.text : '#fff',
              }}>{m.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ ...W, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>TL</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: '-0.01em' }}>The Loft</div>
            <div style={{ fontSize: 10, color: C.muted }}>Salon & Spa · Double Bay</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13, color: C.muted }}>
          {['Services','Our Team','Gallery','Contact'].map(l => (
            <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <button style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 20px rgba(184,149,106,0.3)` }}>
          Book Now
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const msgs = [
    { from: 'salon' as const, delay: 0.6,  text: '✅ Confirmed! The Loft Salon & Spa\n\n📅 Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay' },
    { from: 'salon' as const, delay: 1.8,  text: '⏰ Hey Sarah! Reminder — see you tomorrow at 2pm with Emma. Need to move it? Reply CHANGE 💛' },
    { from: 'client' as const, delay: 2.8, text: "All good, can't wait! 🙌" },
    { from: 'salon' as const, delay: 3.6,  text: '⭐ Hi Sarah! Hope you loved today. 30 secs for a Google review? → [link]' },
  ]
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: C.bg, overflow: 'hidden', paddingTop: 64 }}>
      {/* Subtle warm glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
      <div style={{ ...W, padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Double Bay, Sydney · Est. 2018</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22,1,0.36,1] }}
              style={{ margin: '0 0 20px', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
              <span style={{ display: 'block', color: C.text, fontSize: 'clamp(52px, 5.5vw, 80px)', fontWeight: 800 }}>The Loft</span>
              <span style={{ display: 'block', fontSize: 'clamp(52px, 5.5vw, 80px)', fontWeight: 800, background: `linear-gradient(135deg, ${C.accent} 0%, #9e7a50 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Salon & Spa</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease: [0.22,1,0.36,1] }}
              style={{ fontSize: 17, lineHeight: 1.75, color: C.muted, margin: '0 0 36px', maxWidth: 400 }}>
              Where every visit feels like your first. Premium hair, skin & nail services — with a system that makes every client feel truly seen.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26, ease: [0.22,1,0.36,1] }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <button style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 30px rgba(184,149,106,0.3)` }}>
                Book an Appointment
              </button>
              <button style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 100, padding: '14px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                View Services
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', value: '4.9', label: '847 Google reviews' },
                { icon: '✂️', value: '6', label: 'master stylists' },
                { icon: '📅', value: 'Open', label: 'until 7pm today' },
              ].map((s,i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 100, padding: '8px 16px', fontSize: 13, boxShadow: '0 2px 8px rgba(28,21,16,0.06)' }}>
                  <span>{s.icon}</span>
                  <span style={{ fontWeight: 700, color: C.text }}>{s.value}</span>
                  <span style={{ color: C.muted }}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right */}
          <motion.div initial={{ opacity: 0, x: 32, y: 16 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22,1,0.36,1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-15%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.12) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Phone title="Booking confirmed" messages={msgs} />
              </div>
            </div>
            {/* Stat badges below phone — always in flow, never clips */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', width: '100%' }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.5 }}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 18px', textAlign: 'center', boxShadow: '0 4px 20px rgba(28,21,16,0.08)' }}>
                <Stars />
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 6 }}>4.9 · 847 reviews</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.5 }}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 18px', boxShadow: '0 4px 20px rgba(28,21,16,0.08)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.accent, marginBottom: 4 }}>This month</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.03em' }}>$47,230</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>↑ 18% vs last month</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Cinematic Reel ───────────────────────────────────────────────────────────

function CinematicReel() {
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Live Preview · April 2025</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 12px' }}>A salon running at full power</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>Real numbers. Real messages. This is The Loft, running on autopilot.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{ position: 'relative', maxWidth: 960, margin: '0 auto', borderRadius: 24, overflow: 'hidden', background: '#f4f0ea', aspectRatio: '16/9', boxShadow: `0 0 0 1px ${C.border}, 0 40px 80px rgba(28,21,16,0.12), 0 0 60px rgba(184,149,106,0.08)` }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <SalonPlayer />
            </div>
          </div>
        </FadeUp>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </section>
  )
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const txt = '47 appointments this week  ·  3 new 5-star reviews today  ·  $8,400 collected  ·  94% rebooking rate  ·  12 automated messages sent  ·  0 missed follow-ups  ·  '
  return (
    <div style={{ overflow: 'hidden', padding: '11px 0', background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <motion.div animate={{ x: ['0%','-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {[1,2,3,4].map(i => <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, opacity: 0.7, marginRight: 32 }}>{txt}</span>)}
      </motion.div>
    </div>
  )
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

function Metrics() {
  const stats = [
    { label: 'Monthly Revenue',  value: 47230, pre: '$', suf: '',  change: '+18%', sub: 'vs last month' },
    { label: 'New Clients',      value: 127,   pre: '',  suf: '',  change: '+23%', sub: 'this month' },
    { label: 'Rebooking Rate',   value: 94,    pre: '',  suf: '%', change: '+6pts', sub: 'vs 6 months ago' },
    { label: 'Avg Ticket Value', value: 178,   pre: '$', suf: '',  change: '+$24', sub: 'this quarter' },
  ]
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, marginBottom: 12 }}>April 2025</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: 0 }}>The Loft, by the numbers</h2>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s,i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '28px 24px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px rgba(28,21,16,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, marginBottom: 16 }}>{s.label}</div>
                <div style={{ fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.04em', marginBottom: 14 }}>
                  <Counter to={s.value} prefix={s.pre} suffix={s.suf} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: C.greenBg, color: C.green }}>{s.change}</span>
                  <span style={{ fontSize: 12, color: C.subtle }}>{s.sub}</span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Automation ───────────────────────────────────────────────────────────────

function Automation() {
  const stages = [
    { step: '01', label: 'Instantly on booking',  preview: 'Confirmed! Wed 23 Apr · 2pm with Emma' },
    { step: '02', label: '24 hours before',        preview: 'Reminder — see you tomorrow at 2pm' },
    { step: '03', label: '2 hours before',         preview: 'See you soon! Free parking on Guilfoyle Ave' },
    { step: '04', label: '2 hours after visit',    preview: 'Hope you loved today! Leave us a review?' },
    { step: '05', label: '3 days later',           preview: 'Ready to book your next visit?' },
    { step: '06', label: '6 weeks later',          preview: 'Your hair might be craving some love' },
  ]
  const msgs = [
    { from: 'salon' as const, delay: 0.3, text: '✅ Confirmed! Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay 💛' },
    { from: 'salon' as const, delay: 1.2, text: '⏰ Tomorrow at 2pm with Emma. Need to move it? Reply CHANGE' },
    { from: 'client' as const, delay: 2.1, text: 'Perfect, see you then! ✨' },
    { from: 'salon' as const, delay: 3.0, text: "📍 2 hours away! Free parking on Guilfoyle Ave. Can't wait to see you!" },
    { from: 'salon' as const, delay: 4.2, text: '⭐ Hope you\'re loving your new look! 30 seconds for a Google review? → [link]' },
  ]
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, marginBottom: 12 }}>Client Journey</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Every client, perfectly looked after</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 500, margin: '0 auto' }}>From booking to six weeks later — every message, sent automatically, at exactly the right time.</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 5vw, 5rem)', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stages.map((s,i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 12px rgba(28,21,16,0.05)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, opacity: 0.5, minWidth: 24 }}>{s.step}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.accent, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 13, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.preview}</div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, opacity: 0.3, flexShrink: 0 }} />
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-20%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}><Phone title="Automated sequence" messages={msgs} /></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {[{ label: 'No-shows down', value: '67%' }, { label: 'Review rate', value: '38%' }, { label: 'Rebook rate', value: '52%' }].map((stat,i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', textAlign: 'center', minWidth: 90, boxShadow: '0 2px 12px rgba(28,21,16,0.06)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

const REVIEWS = [
  { name: 'Rachel M.', initials: 'RM', service: 'Balayage + Blow Dry', time: '2 hours ago',  text: "Emma is an absolute artist. My balayage has never looked so natural. And the reminder texts are such a lovely touch — I never forget my appointments anymore!" },
  { name: 'Priya K.',  initials: 'PK', service: 'Colour + Cut',        time: 'Yesterday',    text: "Walked in stressed, walked out feeling like a completely different person. The team at The Loft are genuinely magic. Already booked my next one." },
  { name: 'Sophie T.', initials: 'ST', service: 'Keratin Treatment',   time: '3 days ago',   text: "I've been coming here 3 years and they just keep getting better. I never even have to remember to rebook — they send me a text at exactly the right time." },
  { name: 'Jess O.',   initials: 'JO', service: 'Full Highlights',     time: '1 week ago',   text: "Best salon in Double Bay, hands down. Tash always knows what I need before I even explain it. The post-visit follow-up made me feel so looked after." },
  { name: 'Mia R.',    initials: 'MR', service: 'Brazilian Blowout',   time: '2 weeks ago',  text: "The whole experience — from booking online to the little check-in message after — is just flawless. I recommend The Loft to every person I know." },
  { name: 'Lauren B.', initials: 'LB', service: 'Toner Refresh',      time: '2 weeks ago',  text: "My hair has genuinely never been healthier. And the messages they send make me feel like a VIP client every single time." },
]

function Reviews() {
  const [count, setCount] = useState(3)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const t1 = setTimeout(() => setCount(4), 1400)
    const t2 = setTimeout(() => setCount(5), 2800)
    const t3 = setTimeout(() => setCount(6), 4200)
    return () => [t1,t2,t3].forEach(clearTimeout)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, marginBottom: 12 }}>Reputation</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 16px' }}>Reviews that write themselves</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Stars />
            <span style={{ fontWeight: 700, color: C.text }}>4.9</span>
            <span style={{ fontSize: 14, color: C.muted }}>· 847 Google reviews · new ones arriving daily</span>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <AnimatePresence>
            {REVIEWS.slice(0, count).map((r,i) => (
              <motion.div key={r.name} layout initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(28,21,16,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: C.accentLt, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.accent }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{r.service}</div>
                    </div>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <Stars />
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: '12px 0 0', flex: 1 }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ fontSize: 12, color: C.subtle, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>{r.time}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── Live Feed ────────────────────────────────────────────────────────────────

const LIVE = [
  { text: 'Reminder sent → Sarah M.',        sub: 'Wed 2pm appointment · delivered',              dot: C.accent },
  { text: 'Review received → Rachel M.',     sub: '5 stars · "Never looked so natural"',          dot: C.green },
  { text: 'Rebooking confirmed → Priya K.',  sub: 'Thu 15 May at 11am · locked in',              dot: C.accent },
  { text: '$340 collected → Chloe B.',       sub: 'Balayage package · auto-receipt sent',         dot: C.green },
  { text: 'New lead → Jamie (Instagram)',    sub: 'Auto-replied · appointment booked in 4 min',   dot: C.accent },
  { text: 'Win-back → Marcus T.',            sub: '9 weeks no visit · offer sent · booked',      dot: C.green },
  { text: 'Review received → Sophie T.',     sub: '5 stars · "Just keeps getting better"',       dot: C.accent },
  { text: '$178 collected → Lauren B.',      sub: 'Toner refresh · auto-receipt sent',           dot: C.green },
]

function LiveFeed() {
  const [items, setItems] = useState(LIVE.slice(0,4))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const idx = useRef(4)
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setItems(prev => [LIVE[idx.current % LIVE.length], ...prev].slice(0,6))
      idx.current++
    }, 2000)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={{ ...W, maxWidth: 800 }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Live · right now</span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 8px' }}>The business, running itself</h2>
          <p style={{ fontSize: 15, color: C.muted, margin: '0 0 32px' }}>While Emma&apos;s with a client, the system is doing all of this.</p>
        </FadeUp>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {items.map((item,i) => (
              <motion.div key={`${item.text}-${i}`} layout initial={{ opacity: 0, y: -16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px', boxShadow: '0 2px 10px rgba(28,21,16,0.05)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sub}</div>
                </div>
                <div style={{ fontSize: 12, color: C.subtle, flexShrink: 0 }}>just now</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── SM Reveal ────────────────────────────────────────────────────────────────

function Reveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const glow = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section ref={ref} style={{ position: 'relative', padding: 'clamp(5rem, 10vw, 8rem) 0', overflow: 'hidden', background: `linear-gradient(to bottom, ${C.surface} 0%, #030108 40%)` }}>
      <motion.div style={{ opacity: glow, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(107,53,245,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,235,193,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </motion.div>

      <div style={{ ...W, textAlign: 'center' }}>
        <FadeUp>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(107,53,245,0.08)', border: '1px solid rgba(107,53,245,0.25)', borderRadius: 100, padding: '7px 18px', marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6b35f5', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a673ff' }}>The system behind The Loft</span>
          </div>
        </FadeUp>
        <FadeUp delay={0.08}>
          <p style={{ fontSize: 17, color: 'rgba(240,237,255,0.3)', margin: '0 0 12px' }}>The Loft doesn&apos;t run on luck, or hustle, or sticky notes.</p>
          <h2 style={{ fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: '#f0edff', margin: '0 0 24px' }}>
            It runs on{' '}
            <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Shoulder Monkey.</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.16}>
          <p style={{ fontSize: 17, color: 'rgba(240,237,255,0.45)', maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
            Everything you just saw — the automated messages, the review generation, the full calendar, the live dashboard — is Shoulder Monkey, running silently underneath The Loft&apos;s brand.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 56, textAlign: 'left' }}>
            {[
              { label: 'Automated SMS sequences', desc: 'Confirmation → reminder → review → rebook. Every time.' },
              { label: 'Online booking system',   desc: '24/7 bookings. No phone calls. No double-bookings.' },
              { label: 'Review generation',       desc: 'Sent 2 hours after every visit. 38% conversion rate.' },
              { label: 'Payments & invoicing',    desc: 'Cards on file. Auto-receipts. Zero chasing.' },
              { label: 'Rebooking campaigns',     desc: 'Win back lapsed clients before they go elsewhere.' },
              { label: 'Revenue dashboard',       desc: 'Every metric, in real time, on your phone.' },
            ].map((f,i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                style={{ background: 'rgba(240,237,255,0.03)', border: '1px solid rgba(107,53,245,0.14)', borderRadius: 18, padding: '22px 20px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0edff', marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(240,237,255,0.35)' }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>
        <FadeUp delay={0.32}>
          <div style={{ background: 'linear-gradient(135deg, rgba(107,53,245,0.1) 0%, rgba(0,235,193,0.03) 100%)', border: '1px solid rgba(107,53,245,0.22)', borderRadius: 28, padding: 'clamp(2rem, 5vw, 3.5rem)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 240, height: 1, background: 'linear-gradient(90deg, transparent, rgba(107,53,245,0.5), transparent)' }} />
            <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: '#f0edff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Ready to build this for your salon?</h3>
            <p style={{ fontSize: 16, color: 'rgba(240,237,255,0.42)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>We set everything up in 7 days. You focus on your clients. We handle the rest — forever.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://www.shouldermonkey.co" style={{ display: 'inline-flex', alignItems: 'center', background: '#6b35f5', color: '#fff', textDecoration: 'none', borderRadius: 100, padding: '15px 32px', fontSize: 15, fontWeight: 700, boxShadow: '0 0 40px rgba(107,53,245,0.3)' }}>
                Book a free strategy call →
              </a>
              <a href="https://www.shouldermonkey.co" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(107,53,245,0.3)', color: '#a673ff', textDecoration: 'none', borderRadius: 100, padding: '15px 32px', fontSize: 15, fontWeight: 600 }}>
                See pricing
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, color: 'rgba(240,237,255,0.28)', fontSize: 13 }}>
              <Stars color="#6b35f5" size={11} />
              <span>Trusted by 200+ service businesses across Australia & NZ</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SalonPage() {
  return (
    <div style={{ background: C.bg }}>
      <Nav />
      <Hero />
      <CinematicReel />
      <Ticker />
      <Metrics />
      <Automation />
      <Reviews />
      <LiveFeed />
      <Reveal />
    </div>
  )
}
