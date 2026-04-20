'use client'

import { motion, useInView, animate, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const SalonPlayer = dynamic(() => import('../../components/SalonPlayer').then(m => ({ default: m.SalonPlayer })), { ssr: false })

// ─── Design tokens ─────────────────────────────────────────────────────────
// Dark warm luxury — deep charcoal with amber/gold
const C = {
  bg:       '#0d0a07',
  surface:  '#1a1410',
  card:     'rgba(253,248,240,0.04)',
  border:   'rgba(232,168,110,0.12)',
  borderHi: 'rgba(232,168,110,0.35)',
  amber:    '#e8a86e',
  gold:     '#d4a04a',
  cream:    '#fdf8f0',
  muted:    'rgba(253,248,240,0.4)',
  subtle:   'rgba(253,248,240,0.12)',
  // SM colours bleed in at the bottom
  purple:   '#6b35f5',
  cyan:     '#00ebc1',
}

// ─── Primitives ─────────────────────────────────────────────────────────────

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

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Stars({ color = C.gold }: { color?: string }) {
  return (
    <span className="flex gap-px">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 13 13" fill={color}>
          <path d="M6.5 0.5l1.4 3.3 3.6.5-2.6 2.5.6 3.5L6.5 9 3 10.3l.6-3.5L1 4.3l3.6-.5z"/>
        </svg>
      ))}
    </span>
  )
}

// ─── Phone mockup ───────────────────────────────────────────────────────────

function PhoneMockup({ messages, title }: { messages: { text: string; from: 'salon' | 'client'; delay: number }[]; title: string }) {
  return (
    <div className="relative mx-auto" style={{ width: 260, height: 540 }}>
      {/* Frame */}
      <div className="absolute inset-0 rounded-[44px] border-2 overflow-hidden"
        style={{
          background: '#0f0c0a',
          borderColor: C.borderHi,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)`,
        }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl z-10"
          style={{ background: '#0f0c0a' }} />
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span style={{ color: C.cream, fontSize: 11, fontWeight: 600 }}>9:41</span>
          <div style={{ width: 96, height: 24 }} /> {/* notch space */}
          <div className="flex items-center gap-1">
            {[4,3,2].map((h,i) => <div key={i} className="w-1 rounded-sm" style={{ height: h*3, background: C.cream, opacity: 0.6 }} />)}
            <div className="ml-1 text-xs" style={{ color: C.cream, opacity: 0.6 }}>●</div>
          </div>
        </div>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b" style={{ borderColor: C.border }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: C.amber, color: '#0d0a07' }}>TL</div>
          <div>
            <div style={{ color: C.cream, fontSize: 13, fontWeight: 600 }}>The Loft</div>
            <div style={{ color: C.muted, fontSize: 10 }}>{title}</div>
          </div>
        </div>
        {/* Messages */}
        <div className="flex flex-col gap-2 px-3 py-3 overflow-hidden" style={{ maxHeight: 420 }}>
          {messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: m.delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${m.from === 'salon' ? 'justify-start' : 'justify-end'}`}
            >
              <div className="max-w-[85%] rounded-2xl px-3 py-2"
                style={{
                  background: m.from === 'salon' ? 'rgba(232,168,110,0.15)' : C.amber,
                  color: m.from === 'salon' ? C.cream : '#0d0a07',
                  fontSize: 11,
                  lineHeight: 1.5,
                  borderTopLeftRadius: m.from === 'salon' ? 4 : undefined,
                  borderTopRightRadius: m.from === 'client' ? 4 : undefined,
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

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  const heroMessages = [
    { from: 'salon' as const, delay: 0.6, text: '✅ Confirmed! The Loft Salon & Spa\n\n📅 Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay' },
    { from: 'salon' as const, delay: 1.8, text: '⏰ Hey Sarah! Reminder — see you tomorrow at 2pm with Emma. Need to move it? Reply CHANGE 💛' },
    { from: 'client' as const, delay: 2.8, text: 'All good, can\'t wait! 🙌' },
    { from: 'salon' as const, delay: 3.6, text: '⭐ Hi Sarah! Hope you loved today. If you have 30 secs, a Google review means the world → [link]' },
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: C.bg }}>
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(232,168,110,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(212,160,74,0.06) 0%, transparent 70%)' }} />
        {/* Noise grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#n)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center w-full">
        {/* Left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(232,168,110,0.08)', border: `1px solid ${C.border}`, color: C.amber }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.amber }} />
            Double Bay, Sydney · Est. 2018
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="leading-[1.0] tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 800 }}>
            <span style={{ color: C.cream }}>The Loft<br /></span>
            <span style={{
              background: `linear-gradient(135deg, ${C.amber} 0%, ${C.gold} 60%, #c8823a 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>Salon & Spa</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg leading-relaxed mb-10 max-w-md"
            style={{ color: C.muted }}>
            Where every visit feels like your first. Premium hair, skin & nail services — and a system that makes every client feel like they&apos;re your only one.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-3 mb-12">
            <button className="font-semibold px-7 py-3.5 rounded-full text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: C.amber, color: '#0d0a07', boxShadow: `0 0 0 0 ${C.amber}` }}>
              Book an Appointment
            </button>
            <button className="font-medium px-7 py-3.5 rounded-full text-sm transition-all duration-200"
              style={{ border: `1px solid ${C.border}`, color: C.muted, background: 'transparent' }}>
              View Services
            </button>
          </motion.div>

          {/* Stat pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap gap-3">
            {[
              { icon: '⭐', value: '4.9', label: '847 Google reviews' },
              { icon: '✂️', value: '6', label: 'master stylists' },
              { icon: '📅', value: 'Open', label: 'today until 7pm' },
            ].map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <span>{s.icon}</span>
                <span className="font-semibold" style={{ color: C.cream }}>{s.value}</span>
                <span style={{ color: C.muted }}>{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right — phone */}
        <motion.div initial={{ opacity: 0, x: 40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 blur-[60px] -z-10 rounded-full"
              style={{ background: `radial-gradient(circle, rgba(232,168,110,0.2) 0%, transparent 70%)` }} />

            <PhoneMockup title="Booking confirmed" messages={heroMessages} />

            {/* Floating badge — reviews */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="absolute -right-4 top-16 rounded-2xl px-4 py-3 shadow-2xl"
              style={{ background: '#1f1a14', border: `1px solid ${C.borderHi}` }}>
              <Stars />
              <div className="font-bold mt-1 text-sm" style={{ color: C.cream }}>4.9 · 847 reviews</div>
            </motion.div>

            {/* Floating badge — revenue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute -left-8 bottom-20 rounded-2xl px-4 py-3 shadow-2xl"
              style={{ background: '#1f1a14', border: `1px solid ${C.borderHi}` }}>
              <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: C.amber }}>This month</div>
              <div className="font-bold text-lg" style={{ color: C.cream, fontFamily: 'var(--font-syne)' }}>$47,230</div>
              <div className="text-xs mt-0.5" style={{ color: C.muted }}>↑ 18% vs last month</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Cinematic reel ─────────────────────────────────────────────────────────

function CinematicReel() {
  return (
    <section className="py-20 px-6" style={{ background: '#0a0805' }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-10">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.amber }}>Live Preview</div>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-syne)', color: C.cream }}>
            A salon running at full power
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="relative rounded-3xl overflow-hidden mx-auto"
            style={{
              maxWidth: 900,
              aspectRatio: '16/9',
              boxShadow: `0 0 0 1px rgba(232,168,110,0.1), 0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(232,168,110,0.06)`,
            }}>
            <SalonPlayer />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Ticker ──────────────────────────────────────────────────────────────────

function Ticker() {
  const items = '47 appointments this week  ·  3 new 5-star reviews today  ·  $8,400 collected  ·  94% rebooking rate  ·  12 automated messages sent  ·  0 missed follow-ups  ·  '
  return (
    <div className="overflow-hidden py-3 border-y" style={{ background: 'rgba(232,168,110,0.05)', borderColor: C.border }}>
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap">
        {[1,2,3,4].map(i => (
          <span key={i} className="text-xs font-semibold tracking-widest uppercase mr-8" style={{ color: C.amber, opacity: 0.7 }}>
            {items}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Metrics ─────────────────────────────────────────────────────────────────

function Metrics() {
  const stats = [
    { label: 'Monthly Revenue', value: 47230, pre: '$', suf: '', change: '+18%', sub: 'vs last month' },
    { label: 'New Clients', value: 127, pre: '', suf: '', change: '+23%', sub: 'this month' },
    { label: 'Rebooking Rate', value: 94, pre: '', suf: '%', change: '+6pts', sub: 'vs 6 months ago' },
    { label: 'Avg Ticket Value', value: 178, pre: '$', suf: '', change: '+$24', sub: 'vs last quarter' },
  ]
  return (
    <section className="py-24 px-6" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.amber }}>April 2025</div>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-syne)', color: C.cream }}>
            The Loft, by the numbers
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="relative rounded-2xl p-6 overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
                style={{ background: C.card, border: `1px solid ${C.border}`, backdropFilter: 'blur(12px)' }}>
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, rgba(232,168,110,0.08) 0%, transparent 70%)` }} />
                <div className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: C.muted }}>{s.label}</div>
                <div className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.cream, fontFamily: 'var(--font-syne)' }}>
                  <Counter to={s.value} prefix={s.pre} suffix={s.suf} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>{s.change}</span>
                  <span className="text-xs" style={{ color: C.subtle }}>{s.sub}</span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Automation showcase ─────────────────────────────────────────────────────

function AutomationShowcase() {
  const stages = [
    { icon: '✅', label: 'Instantly on booking',  preview: 'Confirmed! Wed 23 Apr · 2pm with Emma' },
    { icon: '⏰', label: '24h before',             preview: 'Reminder — see you tomorrow at 2pm 👋' },
    { icon: '📍', label: '2 hours before',         preview: 'See you soon! Free parking on Guilfoyle Ave' },
    { icon: '⭐', label: '2h after visit',          preview: 'Hope you loved today! Leave us a review? 🙏' },
    { icon: '💕', label: '3 days later',            preview: 'Ready to book your next visit?' },
    { icon: '🔮', label: '6 weeks later',           preview: 'Your hair might be craving some love 😄' },
  ]

  const phoneMessages = [
    { from: 'salon' as const, delay: 0.3, text: '✅ Confirmed! Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay 💛' },
    { from: 'salon' as const, delay: 1.2, text: '⏰ Tomorrow reminder! See you at 2pm with Emma. Need to move it? Reply CHANGE' },
    { from: 'client' as const, delay: 2.1, text: 'Perfect, see you then! ✨' },
    { from: 'salon' as const, delay: 3.0, text: '📍 2 hours away! Free parking on Guilfoyle Ave. Can\'t wait to see you!' },
    { from: 'salon' as const, delay: 4.2, text: '⭐ Hope you\'re loving your new look! 30 seconds for a Google review? → [link]' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: '#0f0c0a' }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.amber }}>Client Journey</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: C.cream }}>
            Every client, perfectly looked after
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: C.muted }}>
            From the moment they book to six weeks after their visit — every message, sent automatically, at exactly the right time.
          </p>
        </FadeUp>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Stage list */}
          <div className="space-y-2">
            {stages.map((s, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 group cursor-default"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: 'rgba(232,168,110,0.08)', border: `1px solid ${C.border}` }}>
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: C.amber }}>{s.label}</div>
                    <div className="text-sm truncate" style={{ color: C.muted }}>{s.preview}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: C.amber, opacity: 0.4 }} />
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Phone */}
          <FadeUp delay={0.2} className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 blur-[80px] -z-10 rounded-full"
                style={{ background: `radial-gradient(circle, rgba(232,168,110,0.15) 0%, transparent 60%)` }} />
              <PhoneMockup title="Automated sequence" messages={phoneMessages} />

              {/* Stats beside phone */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -right-4 top-1/3 space-y-3">
                {[
                  { label: 'No-shows reduced', value: '67%' },
                  { label: 'Review rate', value: '38%' },
                  { label: 'Rebooking rate', value: '52%' },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl px-3 py-2 text-right w-36"
                    style={{ background: '#1f1a14', border: `1px solid ${C.border}` }}>
                    <div className="text-lg font-bold" style={{ color: C.amber, fontFamily: 'var(--font-syne)' }}>{stat.value}</div>
                    <div className="text-xs" style={{ color: C.muted }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

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
    <section ref={ref} className="py-24 px-6" style={{ background: C.bg }}>
      <div className="max-w-6xl mx-auto">
        <FadeUp className="text-center mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: C.amber }}>Reputation</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-syne)', color: C.cream }}>
            Reviews that write themselves
          </h2>
          <div className="flex items-center justify-center gap-3">
            <Stars />
            <span className="font-bold" style={{ color: C.cream }}>4.9</span>
            <span className="text-sm" style={{ color: C.muted }}>· 847 Google reviews · new ones arriving daily</span>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {REVIEWS.slice(0, count).map((r, i) => (
              <motion.div key={r.name} layout
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl p-6 flex flex-col"
                style={{ background: C.card, border: `1px solid ${C.border}` }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `rgba(232,168,110,${0.2 + i * 0.05})`, color: C.amber, border: `1px solid ${C.border}` }}>
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: C.cream }}>{r.name}</div>
                      <div className="text-xs" style={{ color: C.muted }}>{r.service}</div>
                    </div>
                  </div>
                  {/* Google G */}
                  <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <Stars />
                <p className="text-sm leading-relaxed mt-3 flex-1" style={{ color: C.muted }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="text-xs mt-4 pt-4" style={{ color: C.subtle, borderTop: `1px solid ${C.border}` }}>
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

// ─── Live feed ───────────────────────────────────────────────────────────────

const LIVE = [
  { text: 'Reminder sent → Sarah M.', sub: 'Wed 2pm appointment · delivered', color: C.amber },
  { text: 'Review received → Rachel M.', sub: '5 stars · "Never looked so natural" ⭐⭐⭐⭐⭐', color: '#4ade80' },
  { text: 'Rebooking confirmed → Priya K.', sub: 'Thu 15 May at 11am · locked in', color: C.amber },
  { text: '$340 collected → Chloe B.', sub: 'Balayage package · card on file · receipt sent', color: '#4ade80' },
  { text: 'New lead → Jamie (Instagram)', sub: 'Auto-replied · appointment booked in 4 min', color: C.amber },
  { text: 'Win-back → Marcus T.', sub: '9 weeks no visit · offer sent · booked', color: '#4ade80' },
  { text: 'Review received → Sophie T.', sub: '5 stars · "Just keeps getting better" ⭐⭐⭐⭐⭐', color: C.amber },
  { text: '$178 collected → Lauren B.', sub: 'Toner refresh · auto-receipt sent', color: '#4ade80' },
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
    <section ref={ref} className="py-24 px-6" style={{ background: '#0f0c0a' }}>
      <div className="max-w-3xl mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.amber }} />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: C.amber }}>Live · right now</span>
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)', color: C.cream }}>
            The business, running itself
          </h2>
          <p className="text-base mb-10" style={{ color: C.muted }}>
            While Emma&apos;s with a client, the system is doing all of this.
          </p>
        </FadeUp>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div key={`${item.text}-${i}`} layout
                initial={{ opacity: 0, y: -16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 rounded-xl px-5 py-4"
                style={{ background: C.card, border: `1px solid ${C.border}` }}>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: C.cream }}>{item.text}</div>
                  <div className="text-xs truncate mt-0.5" style={{ color: C.muted }}>{item.sub}</div>
                </div>
                <div className="text-xs shrink-0" style={{ color: C.subtle }}>just now</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── SM Reveal — the curtain pull ────────────────────────────────────────────

function Reveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const purpleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1])

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #0f0c0a 0%, #030108 40%)` }}>

      {/* Purple bleeds in as you scroll into this section */}
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ opacity: purpleOpacity }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(107,53,245,0.25) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(0,235,193,0.08) 0%, transparent 70%)' }} />
      </motion.div>

      {/* Noise */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="n2"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter>
        <rect width="100%" height="100%" filter="url(#n2)" />
      </svg>

      <div className="relative max-w-4xl mx-auto text-center">
        <FadeUp>
          <div className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-10 text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(107,53,245,0.08)', border: '1px solid rgba(107,53,245,0.25)', color: '#a673ff' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#6b35f5' }} />
            The system behind The Loft
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <p className="text-lg mb-3" style={{ color: 'rgba(240,237,255,0.35)' }}>
            The Loft doesn&apos;t run on luck, or hustle, or sticky notes.
          </p>
          <h2 className="font-bold leading-[1.05] mb-6"
            style={{ fontFamily: 'var(--font-syne)', fontSize: 'clamp(44px, 6vw, 80px)', color: '#f0edff' }}>
            It runs on{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 40%, #00ebc1 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>Shoulder Monkey.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-lg max-w-2xl mx-auto mb-16 leading-relaxed"
            style={{ color: 'rgba(240,237,255,0.5)' }}>
            Everything you just saw — the automated messages, the review generation, the full calendar, the live dashboard — is Shoulder Monkey, running silently underneath The Loft&apos;s brand.
          </p>
        </FadeUp>

        {/* Feature grid */}
        <FadeUp delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-16 text-left">
            {[
              { icon: '📱', label: 'Automated SMS sequences', desc: 'Confirmation → reminder → review → rebook. Every time.' },
              { icon: '📅', label: 'Online booking system', desc: '24/7 bookings. No phone calls. No double-bookings.' },
              { icon: '⭐', label: 'Review generation', desc: 'Sent 2 hours after every visit. 38% conversion rate.' },
              { icon: '💰', label: 'Payments & invoicing', desc: 'Cards on file. Auto-receipts. Zero chasing.' },
              { icon: '🔄', label: 'Rebooking campaigns', desc: 'Win back lapsed clients before they go elsewhere.' },
              { icon: '📊', label: 'Revenue dashboard', desc: 'Every metric, in real time, on your phone.' },
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] group"
                style={{ background: 'rgba(240,237,255,0.03)', border: '1px solid rgba(107,53,245,0.15)' }}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-semibold text-sm mb-1.5" style={{ color: '#f0edff' }}>{f.label}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(240,237,255,0.35)' }}>{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp delay={0.4}>
          <div className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(107,53,245,0.12) 0%, rgba(0,235,193,0.04) 100%)',
              border: '1px solid rgba(107,53,245,0.25)',
            }}>
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(107,53,245,0.5), transparent)' }} />

            <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)', color: '#f0edff' }}>
              Ready to build this for your salon?
            </h3>
            <p className="mb-8 max-w-lg mx-auto" style={{ color: 'rgba(240,237,255,0.45)' }}>
              We set everything up in 7 days. You focus on your clients. We handle the rest — forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://www.shouldermonkey.co"
                className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full text-sm transition-all duration-300 hover:scale-105"
                style={{
                  background: '#6b35f5',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(107,53,245,0.3)',
                }}>
                Book a free strategy call →
              </a>
              <a href="https://www.shouldermonkey.co"
                className="inline-flex items-center justify-center gap-2 font-medium px-8 py-4 rounded-full text-sm transition-colors"
                style={{ border: '1px solid rgba(107,53,245,0.3)', color: '#a673ff' }}>
                See pricing
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 mt-8" style={{ color: 'rgba(240,237,255,0.3)', fontSize: 13 }}>
              <Stars color="#6b35f5" />
              <span>Trusted by 200+ service businesses across Australia & NZ</span>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(13,10,7,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: C.amber, color: '#0d0a07' }}>TL</div>
          <div>
            <div className="font-semibold text-sm tracking-wide" style={{ color: C.cream }}>The Loft</div>
            <div className="text-xs" style={{ color: C.muted }}>Salon & Spa</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: C.muted }}>
          {['Services', 'Our Team', 'Gallery', 'Contact'].map(l => (
            <a key={l} href="#" className="hover:opacity-80 transition-opacity">{l}</a>
          ))}
        </div>
        <button className="font-semibold px-5 py-2 rounded-full text-sm transition-all hover:opacity-90"
          style={{ background: C.amber, color: '#0d0a07' }}>
          Book Now
        </button>
      </div>
    </nav>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function SalonPage() {
  return (
    <div style={{ cursor: 'auto', background: C.bg }}>
      <style>{`
        .salon-page * { cursor: auto !important; }
        .salon-page a, .salon-page button { cursor: pointer !important; }
      `}</style>
      <div className="salon-page">
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
    </div>
  )
}
