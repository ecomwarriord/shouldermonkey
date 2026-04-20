'use client'

import { motion, useInView, animate, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const SalonPlayer = dynamic(
  () => import('../../components/SalonPlayer').then(m => ({ default: m.SalonPlayer })),
  {
    ssr: false,
    loading: () => (
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16, background: '#0d0a07',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '2px solid rgba(232,168,110,0.25)',
          borderTopColor: '#e8a86e',
          animation: 'spin 0.9s linear infinite',
        }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,168,110,0.4)' }}>
          Loading preview...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    ),
  }
)

// ─── Design tokens ─────────────────────────────────────────────────────────
const C = {
  bg:       '#0d0a07',
  surface:  '#1a1410',
  card:     'rgba(253,248,240,0.04)',
  border:   'rgba(232,168,110,0.12)',
  borderHi: 'rgba(232,168,110,0.3)',
  amber:    '#e8a86e',
  gold:     '#d4a04a',
  cream:    '#fdf8f0',
  muted:    'rgba(253,248,240,0.42)',
  subtle:   'rgba(253,248,240,0.14)',
  green:    '#4ade80',
  purple:   '#6b35f5',
  cyan:     '#00ebc1',
}

const CONTAINER: React.CSSProperties = {
  width: '100%',
  maxWidth: 1240,
  margin: '0 auto',
  padding: '0 clamp(1.5rem, 4vw, 3rem)',
}

// ─── Primitives ──────────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Stars({ color = C.gold, size = 13 }: { color?: string; size?: number }) {
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

// ─── Phone mockup ────────────────────────────────────────────────────────────

function PhoneMockup({ messages, title }: {
  messages: { text: string; from: 'salon' | 'client'; delay: number }[]
  title: string
}) {
  return (
    <div style={{ position: 'relative', width: 260, height: 540, margin: '0 auto' }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 44,
        border: `2px solid ${C.borderHi}`,
        background: '#0f0c0a', overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 96, height: 24, borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
          background: '#0f0c0a', zIndex: 10,
        }} />
        {/* Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 4px' }}>
          <span style={{ color: C.cream, fontSize: 11, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 96 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {[12, 9, 6].map((h, i) => (
              <div key={i} style={{ width: 4, height: h, borderRadius: 2, background: C.cream, opacity: 0.5 }} />
            ))}
          </div>
        </div>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 10px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#0d0a07', flexShrink: 0,
          }}>TL</div>
          <div>
            <div style={{ color: C.cream, fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>The Loft</div>
            <div style={{ color: C.muted, fontSize: 10 }}>{title}</div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px', overflow: 'hidden' }}>
          {messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: m.delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', justifyContent: m.from === 'salon' ? 'flex-start' : 'flex-end' }}
            >
              <div style={{
                maxWidth: '85%', borderRadius: m.from === 'salon' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                padding: '8px 12px',
                background: m.from === 'salon' ? 'rgba(232,168,110,0.14)' : C.amber,
                color: m.from === 'salon' ? C.cream : '#0d0a07',
                fontSize: 11, lineHeight: 1.55, whiteSpace: 'pre-line',
              }}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(13,10,7,0.88)', backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ ...CONTAINER, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 800, color: '#0d0a07',
          }}>TL</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.cream, letterSpacing: '-0.01em' }}>The Loft</div>
            <div style={{ fontSize: 10, color: C.muted }}>Salon & Spa</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 13, color: C.muted }}>
          {['Services', 'Our Team', 'Gallery', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: C.muted, textDecoration: 'none', opacity: 0.8 }}>{l}</a>
          ))}
        </div>
        <button style={{
          background: C.amber, color: '#0d0a07',
          border: 'none', borderRadius: 100, padding: '10px 22px',
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          letterSpacing: '-0.01em',
        }}>
          Book Now
        </button>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const heroMessages = [
    { from: 'salon' as const, delay: 0.6, text: '✅ Confirmed! The Loft Salon & Spa\n\n📅 Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay' },
    { from: 'salon' as const, delay: 1.8, text: '⏰ Hey Sarah! Reminder — see you tomorrow at 2pm with Emma. Need to move it? Reply CHANGE 💛' },
    { from: 'client' as const, delay: 2.8, text: 'All good, can\'t wait! 🙌' },
    { from: 'salon' as const, delay: 3.6, text: '⭐ Hi Sarah! Hope you loved today. 30 secs for a Google review? → [link]' },
  ]

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: C.bg, overflow: 'hidden', paddingTop: 64,
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,168,110,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '0', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,74,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* Noise grain */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.025 }} xmlns="http://www.w3.org/2000/svg">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      <div style={{ ...CONTAINER, padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'clamp(3rem, 5vw, 6rem)',
          alignItems: 'center',
        }}>
          {/* ── Left ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(232,168,110,0.07)', border: `1px solid ${C.border}`,
                borderRadius: 100, padding: '6px 16px', marginBottom: 28,
              }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.amber, display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber }}>
                Double Bay, Sydney · Est. 2018
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ margin: 0, marginBottom: 24, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
              <span style={{ display: 'block', color: C.cream, fontSize: 'clamp(52px, 5.5vw, 80px)', fontWeight: 800 }}>
                The Loft
              </span>
              <span style={{
                display: 'block', fontSize: 'clamp(52px, 5.5vw, 80px)', fontWeight: 800,
                background: `linear-gradient(135deg, ${C.amber} 0%, ${C.gold} 55%, #c8823a 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Salon & Spa
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontSize: 17, lineHeight: 1.7, color: C.muted, marginBottom: 36, maxWidth: 420, margin: '0 0 36px' }}>
              Where every visit feels like your first. Premium hair, skin & nail services — with a system that makes every client feel like they&apos;re your only one.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <button style={{
                background: C.amber, color: '#0d0a07', border: 'none',
                borderRadius: 100, padding: '14px 28px', fontSize: 14,
                fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em',
                boxShadow: `0 8px 30px rgba(232,168,110,0.25)`,
              }}>
                Book an Appointment
              </button>
              <button style={{
                background: 'transparent', color: C.muted,
                border: `1px solid ${C.border}`, borderRadius: 100,
                padding: '14px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}>
                View Services
              </button>
            </motion.div>

            {/* Stat pills */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: '⭐', value: '4.9', label: '847 Google reviews' },
                { icon: '✂️', value: '6', label: 'master stylists' },
                { icon: '📅', value: 'Open', label: 'until 7pm today' },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 100, padding: '8px 16px', fontSize: 13,
                  }}>
                  <span>{s.icon}</span>
                  <span style={{ fontWeight: 700, color: C.cream }}>{s.value}</span>
                  <span style={{ color: C.muted }}>{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right ── */}
          <motion.div initial={{ opacity: 0, x: 32, y: 16 }} animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            {/* Phone glow */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-20%', borderRadius: '50%', zIndex: 0,
                background: 'radial-gradient(circle, rgba(232,168,110,0.18) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <PhoneMockup title="Booking confirmed" messages={heroMessages} />
              </div>
            </div>

            {/* Stat badges BELOW phone — always visible, no clipping */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', width: '100%' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5 }}
                style={{
                  background: '#1a1410', border: `1px solid ${C.borderHi}`,
                  borderRadius: 16, padding: '12px 18px', textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                <Stars />
                <div style={{ fontSize: 13, fontWeight: 700, color: C.cream, marginTop: 6 }}>4.9 · 847 reviews</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.5 }}
                style={{
                  background: '#1a1410', border: `1px solid ${C.borderHi}`,
                  borderRadius: 16, padding: '12px 18px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.amber, marginBottom: 4 }}>
                  This month
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.cream, letterSpacing: '-0.03em' }}>$47,230</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>↑ 18% vs last month</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </section>
  )
}

// ─── Cinematic reel ───────────────────────────────────────────────────────────

function CinematicReel() {
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#0a0805' }}>
      <div style={CONTAINER}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(232,168,110,0.07)', border: `1px solid ${C.border}`,
            borderRadius: 100, padding: '6px 16px', marginBottom: 16,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.amber, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber }}>
              Live Preview · April 2025
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
            A salon running at full power
          </h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 500, margin: '0 auto' }}>
            Real numbers. Real messages. This is what The Loft looks like, running on autopilot.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div style={{
            position: 'relative', maxWidth: 960, margin: '0 auto',
            borderRadius: 24, overflow: 'hidden', background: '#0d0a07',
            aspectRatio: '16/9',
            boxShadow: '0 0 0 1px rgba(232,168,110,0.08), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(232,168,110,0.05)',
          }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <SalonPlayer />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Ticker ───────────────────────────────────────────────────────────────────

function Ticker() {
  const text = '47 appointments this week  ·  3 new 5-star reviews today  ·  $8,400 collected  ·  94% rebooking rate  ·  12 automated messages sent  ·  0 missed follow-ups  ·  '
  return (
    <div style={{ overflow: 'hidden', padding: '12px 0', background: 'rgba(232,168,110,0.04)', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {[1,2,3,4].map(i => (
          <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.amber, opacity: 0.6, marginRight: 32 }}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

function Metrics() {
  const stats = [
    { label: 'Monthly Revenue', value: 47230, pre: '$', suf: '', change: '+18%', sub: 'vs last month' },
    { label: 'New Clients', value: 127, pre: '', suf: '', change: '+23%', sub: 'this month' },
    { label: 'Rebooking Rate', value: 94, pre: '', suf: '%', change: '+6pts', sub: 'vs 6 months ago' },
    { label: 'Avg Ticket Value', value: 178, pre: '$', suf: '', change: '+$24', sub: 'vs last quarter' },
  ]
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={CONTAINER}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber, marginBottom: 12 }}>April 2025</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.03em', margin: 0 }}>
            The Loft, by the numbers
          </h2>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 20, padding: '28px 24px', backdropFilter: 'blur(12px)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, marginBottom: 16 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.04em', marginBottom: 14 }}>
                  <Counter to={s.value} prefix={s.pre} suffix={s.suf} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                    background: 'rgba(74,222,128,0.1)', color: C.green,
                  }}>{s.change}</span>
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

// ─── Automation showcase ──────────────────────────────────────────────────────

function AutomationShowcase() {
  const stages = [
    { step: '01', label: 'Instantly on booking',  preview: 'Confirmed! Wed 23 Apr · 2pm with Emma' },
    { step: '02', label: '24 hours before',        preview: 'Reminder — see you tomorrow at 2pm' },
    { step: '03', label: '2 hours before',         preview: 'See you soon! Free parking on Guilfoyle Ave' },
    { step: '04', label: '2 hours after visit',    preview: 'Hope you loved today! Leave us a review?' },
    { step: '05', label: '3 days later',           preview: 'Ready to book your next visit?' },
    { step: '06', label: '6 weeks later',          preview: 'Your hair might be craving some love' },
  ]

  const phoneMessages = [
    { from: 'salon' as const, delay: 0.3, text: '✅ Confirmed! Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay 💛' },
    { from: 'salon' as const, delay: 1.2, text: '⏰ Tomorrow at 2pm with Emma. Need to move it? Reply CHANGE' },
    { from: 'client' as const, delay: 2.1, text: 'Perfect, see you then! ✨' },
    { from: 'salon' as const, delay: 3.0, text: '📍 2 hours away! Free parking on Guilfoyle Ave. Can\'t wait to see you!' },
    { from: 'salon' as const, delay: 4.2, text: '⭐ Hope you\'re loving your new look! 30 seconds for a Google review? → [link]' },
  ]

  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#0f0c0a' }}>
      <div style={CONTAINER}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber, marginBottom: 12 }}>Client Journey</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.03em', margin: '0 0 14px' }}>
            Every client, perfectly looked after
          </h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 520, margin: '0 auto' }}>
            From the moment they book to six weeks after — every message, sent automatically, at exactly the right time.
          </p>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 5vw, 5rem)', alignItems: 'center' }}>
          {/* Stage list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stages.map((s, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 16, padding: '16px 20px',
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 800, color: C.amber,
                    opacity: 0.5, minWidth: 24, letterSpacing: '0.05em',
                  }}>{s.step}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.amber, marginBottom: 3 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.preview}
                    </div>
                  </div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.amber, opacity: 0.35, flexShrink: 0 }} />
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Phone + stats */}
          <FadeUp delay={0.2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-20%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(232,168,110,0.12) 0%, transparent 70%)',
                filter: 'blur(50px)', zIndex: 0,
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <PhoneMockup title="Automated sequence" messages={phoneMessages} />
              </div>
            </div>
            {/* Stats below phone */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              {[
                { label: 'No-shows reduced', value: '67%' },
                { label: 'Review rate', value: '38%' },
                { label: 'Rebooking rate', value: '52%' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: '#1a1410', border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: '12px 16px', textAlign: 'center', minWidth: 90,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.amber, letterSpacing: '-0.03em' }}>{stat.value}</div>
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
  { name: 'Rachel M.', initials: 'RM', service: 'Balayage + Blow Dry', time: '2 hours ago', text: "Emma is an absolute artist. My balayage has never looked so natural. And the reminder texts are such a lovely touch — I never forget my appointments anymore!" },
  { name: 'Priya K.', initials: 'PK', service: 'Colour + Cut', time: 'Yesterday', text: "Walked in stressed, walked out feeling like a completely different person. The team at The Loft are genuinely magic. Already booked my next one." },
  { name: 'Sophie T.', initials: 'ST', service: 'Keratin Treatment', time: '3 days ago', text: "I've been coming here 3 years and they just keep getting better. I never even have to remember to rebook — they send me a text at exactly the right time." },
  { name: 'Jess O.', initials: 'JO', service: 'Full Highlights', time: '1 week ago', text: "Best salon in Double Bay, hands down. Tash always knows what I need before I even explain it. The post-visit follow-up message made me feel so looked after." },
  { name: 'Mia R.', initials: 'MR', service: 'Brazilian Blowout', time: '2 weeks ago', text: "The whole experience — from booking online to the little check-in message after — is just flawless. I recommend The Loft to every person I know." },
  { name: 'Lauren B.', initials: 'LB', service: 'Toner Refresh', time: '2 weeks ago', text: "My hair has genuinely never been healthier. And the messages they send make me feel like a VIP client every single time." },
]

function ReviewsSection() {
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
      <div style={CONTAINER}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber, marginBottom: 12 }}>Reputation</div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            Reviews that write themselves
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Stars />
            <span style={{ fontWeight: 700, color: C.cream }}>4.9</span>
            <span style={{ fontSize: 14, color: C.muted }}>· 847 Google reviews · new ones arriving daily</span>
          </div>
        </FadeUp>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <AnimatePresence>
            {REVIEWS.slice(0, count).map((r, i) => (
              <motion.div key={r.name} layout
                initial={{ opacity: 0, scale: 0.93, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 20, padding: '24px',
                  display: 'flex', flexDirection: 'column',
                }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: `rgba(232,168,110,${0.15 + i * 0.04})`,
                      border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: C.amber,
                    }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.cream }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{r.service}</div>
                    </div>
                  </div>
                  {/* Google G */}
                  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <Stars />
                <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: '12px 0 0', flex: 1 }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ fontSize: 12, color: C.subtle, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  {r.time}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── Live feed ────────────────────────────────────────────────────────────────

const LIVE = [
  { text: 'Reminder sent → Sarah M.', sub: 'Wed 2pm appointment · delivered', color: C.amber },
  { text: 'Review received → Rachel M.', sub: '5 stars · "Never looked so natural"', color: C.green },
  { text: 'Rebooking confirmed → Priya K.', sub: 'Thu 15 May at 11am · locked in', color: C.amber },
  { text: '$340 collected → Chloe B.', sub: 'Balayage package · auto-receipt sent', color: C.green },
  { text: 'New lead → Jamie (Instagram)', sub: 'Auto-replied · appointment booked in 4 min', color: C.amber },
  { text: 'Win-back → Marcus T.', sub: '9 weeks no visit · offer sent · booked', color: C.green },
  { text: 'Review received → Sophie T.', sub: '5 stars · "Just keeps getting better"', color: C.amber },
  { text: '$178 collected → Lauren B.', sub: 'Toner refresh · auto-receipt sent', color: C.green },
]

function LiveFeed() {
  const [items, setItems] = useState(LIVE.slice(0, 4))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const idx = useRef(4)

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      setItems(prev => [LIVE[idx.current % LIVE.length], ...prev].slice(0, 6))
      idx.current++
    }, 2000)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: '#0f0c0a' }}>
      <div style={{ ...CONTAINER, maxWidth: 800 }}>
        <FadeUp>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.amber, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.amber }}>
              Live · right now
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 2.5vw, 34px)', fontWeight: 800, color: C.cream, letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            The business, running itself
          </h2>
          <p style={{ fontSize: 15, color: C.muted, margin: '0 0 32px' }}>
            While Emma&apos;s with a client, the system is doing all of this.
          </p>
        </FadeUp>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div key={`${item.text}-${i}`} layout
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: '16px 20px',
                }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.cream, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.text}</div>
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
  const purpleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  const features = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>, label: 'Automated SMS sequences', desc: 'Confirmation → reminder → review → rebook. Every time.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label: 'Online booking system', desc: '24/7 bookings. No phone calls. No double-bookings.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: 'Review generation', desc: 'Sent 2 hours after every visit. 38% conversion rate.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>, label: 'Payments & invoicing', desc: 'Cards on file. Auto-receipts. Zero chasing.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>, label: 'Rebooking campaigns', desc: 'Win back lapsed clients before they go elsewhere.' },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: 'Revenue dashboard', desc: 'Every metric, in real time, on your phone.' },
  ]

  return (
    <section ref={ref} style={{
      position: 'relative', padding: 'clamp(5rem, 10vw, 8rem) 0', overflow: 'hidden',
      background: 'linear-gradient(to bottom, #0f0c0a 0%, #030108 50%)',
    }}>
      {/* Purple scroll-triggered glow */}
      <motion.div style={{ opacity: purpleOpacity, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(107,53,245,0.22) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,235,193,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </motion.div>

      <div style={{ ...CONTAINER, textAlign: 'center' }}>
        <FadeUp>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(107,53,245,0.08)', border: '1px solid rgba(107,53,245,0.25)',
            borderRadius: 100, padding: '7px 18px', marginBottom: 32,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6b35f5', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a673ff' }}>
              The system behind The Loft
            </span>
          </div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p style={{ fontSize: 17, color: 'rgba(240,237,255,0.3)', margin: '0 0 12px' }}>
            The Loft doesn&apos;t run on luck, or hustle, or sticky notes.
          </p>
          <h2 style={{
            fontSize: 'clamp(44px, 6vw, 80px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0,
            color: '#f0edff', margin: '0 0 24px',
          }}>
            It runs on{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Shoulder Monkey.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.16}>
          <p style={{ fontSize: 17, color: 'rgba(240,237,255,0.45)', maxWidth: 600, margin: '0 auto 56px', lineHeight: 1.7 }}>
            Everything you just saw — the automated messages, the review generation, the full calendar, the live dashboard — is Shoulder Monkey, running silently underneath The Loft&apos;s brand.
          </p>
        </FadeUp>

        {/* Feature grid */}
        <FadeUp delay={0.22}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 56, textAlign: 'left' }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                style={{
                  background: 'rgba(240,237,255,0.03)', border: '1px solid rgba(107,53,245,0.14)',
                  borderRadius: 18, padding: '22px 20px',
                }}>
                <div style={{ color: '#a673ff', opacity: 0.7, marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0edff', marginBottom: 6 }}>{f.label}</div>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(240,237,255,0.35)' }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delay={0.32}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(107,53,245,0.1) 0%, rgba(0,235,193,0.03) 100%)',
            border: '1px solid rgba(107,53,245,0.22)', borderRadius: 28,
            padding: 'clamp(2rem, 5vw, 3.5rem)', position: 'relative', overflow: 'hidden',
          }}>
            {/* Top line glow */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 240, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(107,53,245,0.5), transparent)',
            }} />
            <h3 style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: '#f0edff', letterSpacing: '-0.03em', margin: '0 0 12px' }}>
              Ready to build this for your salon?
            </h3>
            <p style={{ fontSize: 16, color: 'rgba(240,237,255,0.42)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.6 }}>
              We set everything up in 7 days. You focus on your clients. We handle the rest — forever.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://www.shouldermonkey.co"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#6b35f5', color: '#fff', textDecoration: 'none',
                  borderRadius: 100, padding: '15px 32px', fontSize: 15, fontWeight: 700,
                  boxShadow: '0 0 40px rgba(107,53,245,0.3)',
                }}>
                Book a free strategy call →
              </a>
              <a href="https://www.shouldermonkey.co"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  border: '1px solid rgba(107,53,245,0.3)', color: '#a673ff',
                  textDecoration: 'none', borderRadius: 100, padding: '15px 32px',
                  fontSize: 15, fontWeight: 600,
                }}>
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
      <AutomationShowcase />
      <ReviewsSection />
      <LiveFeed />
      <Reveal />
    </div>
  )
}
