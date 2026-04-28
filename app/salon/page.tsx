'use client'

import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion'
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
}

const W: React.CSSProperties = {
  width: '100%', maxWidth: 1240,
  margin: '0 auto',
  padding: '0 clamp(1.5rem, 4vw, 3rem)',
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

function Nav() {
  const [open, setOpen] = useState(false)
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
        {/* Desktop links */}
        <div className="sm-desktop-only" style={{ alignItems: 'center', gap: 32, fontSize: 13 }}>
          {[['Services','#services'],['Our Team','#team'],['Gallery','#gallery'],['Contact','#contact']].map(([l,h]) => (
            <a key={l} href={h} style={{ color: C.muted, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <button className="sm-desktop-only" style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '10px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Book Now
        </button>
        {/* Hamburger */}
        <button className="sm-mobile-only" onClick={() => setOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: C.text, transition: 'all 0.2s', transform: open && i === 0 ? 'translateY(7px) rotate(45deg)' : open && i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none', opacity: open && i === 1 ? 0 : 1 }} />)}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(250,248,244,0.98)', borderTop: `1px solid ${C.border}`, padding: '1.5rem clamp(1.5rem, 4vw, 3rem)' }}>
          {[['Services','#services'],['Our Team','#team'],['Gallery','#gallery'],['Contact','#contact']].map(([l,h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} style={{ display: 'block', color: C.text, textDecoration: 'none', fontSize: 16, fontWeight: 500, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>{l}</a>
          ))}
          <button style={{ marginTop: 20, background: C.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>Book Now</button>
        </div>
      )}
    </nav>
  )
}

function Hero() {
  const msgs = [
    { from: 'salon' as const, delay: 0.6,  text: '✅ Confirmed! The Loft Salon & Spa\n\n📅 Wed 23 Apr · 2:00pm\n✂️ Balayage with Emma\n📍 Knox St, Double Bay' },
    { from: 'salon' as const, delay: 1.8,  text: '⏰ Hey Sarah! Just a reminder — see you tomorrow at 2pm with Emma. Need to move it? Reply CHANGE 💛' },
    { from: 'client' as const, delay: 2.8, text: "Can't wait, thank you! 🙌" },
    { from: 'salon' as const, delay: 3.8,  text: '🌿 Hi Sarah! Your keratin is due for a refresh — want to lock in a time? We have spots this week 💛' },
  ]
  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: C.bg, overflow: 'hidden', paddingTop: 64 }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>
      <div style={{ ...W, padding: 'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(3rem, 5vw, 6rem)', alignItems: 'center' }}>
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
              Premium hair, skin & nail services in the heart of Double Bay. Come in for the experience. Leave looking — and feeling — your absolute best.
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

          <motion.div initial={{ opacity: 0, x: 32, y: 16 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22,1,0.36,1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-15%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.12) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Phone title="Your visit at The Loft" messages={msgs} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', width: '100%' }}>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.5 }}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 18px', textAlign: 'center', boxShadow: '0 4px 20px rgba(28,21,16,0.08)' }}>
                <Stars />
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 6 }}>4.9 · 847 reviews</div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.0, duration: 0.5 }}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '12px 18px', boxShadow: '0 4px 20px rgba(28,21,16,0.08)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.accent, marginBottom: 4 }}>Services from</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: '-0.03em' }}>$95</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Colour · Cut · Treatments</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const SERVICES = [
  {
    icon: '🎨',
    name: 'Colour',
    tagline: 'From soft balayage to bold transformations',
    items: ['Balayage from $180', 'Full Colour from $120', 'Highlights from $160', 'Toner Refresh from $60', 'Colour Correction POA'],
    bg: 'rgba(184,149,106,0.08)',
  },
  {
    icon: '✂️',
    name: 'Cut & Style',
    tagline: 'Precision cuts for every hair type and texture',
    items: ["Women's Cut & Blowout from $95", "Men's Cut from $55", 'Fringe Trim from $25', 'Dry Cut from $75', 'Bridal Trial from $180'],
    bg: 'rgba(184,149,106,0.04)',
  },
  {
    icon: '💆',
    name: 'Treatments',
    tagline: 'Repair, restore and strengthen from within',
    items: ['Keratin from $120', 'Brazilian Blowout from $220', 'Olaplex Treatment from $80', 'Scalp Ritual from $65', 'Bond Repair from $90'],
    bg: 'rgba(184,149,106,0.08)',
  },
  {
    icon: '👰',
    name: 'Bridal & Occasions',
    tagline: 'Flawless looks for your most important days',
    items: ['Bridal Hair by consultation', 'Bridal Party packages', 'Formal Updo from $120', 'Blow Dry Bar from $55', 'Colour + Style packages'],
    bg: 'rgba(184,149,106,0.04)',
  },
  {
    icon: '💅',
    name: 'Nails',
    tagline: 'Manicures, pedicures & gel sets',
    items: ['Gel Manicure from $60', 'Classic Manicure from $40', 'Gel Pedicure from $70', 'Classic Pedicure from $50', 'Nail Art from $15/nail'],
    bg: 'rgba(184,149,106,0.08)',
  },
  {
    icon: '🌿',
    name: 'Extensions',
    tagline: 'Instant length and volume with a natural finish',
    items: ['Tape-In from $600', 'Micro-Link from $800', 'Sew-In from $700', 'Clip-In Fitting from $80', 'Extension Maintenance from $180'],
    bg: 'rgba(184,149,106,0.04)',
  },
]

function Services() {
  return (
    <section id="services" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Our Services</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Everything you need. All in one place.</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>From your first cut to a full transformation — The Loft does it all, beautifully.</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {SERVICES.map((s, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div style={{ background: s.bg, border: `1px solid ${C.border}`, borderRadius: 24, padding: '28px 24px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.text, letterSpacing: '-0.02em', marginBottom: 6 }}>{s.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>{s.tagline}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.text }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.accent, flexShrink: 0, opacity: 0.7 }} />
                      {item}
                    </div>
                  ))}
                </div>
                <button style={{ marginTop: 24, background: 'transparent', border: `1px solid ${C.borderHi}`, borderRadius: 100, padding: '9px 18px', fontSize: 12, fontWeight: 700, color: C.accent, cursor: 'pointer', letterSpacing: '0.04em' }}>
                  Book {s.name} →
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

const TEAM = [
  { name: 'Emma Clarke',   role: 'Senior Colourist',  years: '8 years',  specialty: 'Balayage, colour correction & creative blondes', emoji: '🎨', quote: '"Every client deserves hair that makes them stop and stare."',   initials: 'EC' },
  { name: 'Natasha Reid',  role: 'Creative Director', years: '12 years', specialty: 'Precision cutting, editorial & bridal styling',      emoji: '✂️', quote: '"A great cut grows out beautifully — that\'s the real test."', initials: 'NR' },
  { name: 'Lily Chang',    role: 'Senior Stylist',    years: '6 years',  specialty: 'Keratin, treatments & Asian hair specialists',        emoji: '💆', quote: '"Healthy hair is the foundation of every great style."',       initials: 'LC' },
  { name: 'Jade Moretti',  role: 'Stylist',           years: '4 years',  specialty: 'Colour, curly hair & texture work',                  emoji: '🌿', quote: '"Your texture is your superpower — let\'s show it off."',      initials: 'JM' },
  { name: 'Zoe Park',      role: 'Nail Technician',   years: '5 years',  specialty: 'Gel sets, nail art & extensions',                    emoji: '💅', quote: '"Nails are the finishing touch that ties the whole look together."', initials: 'ZP' },
  { name: 'Chloe Adams',   role: 'Stylist',           years: '3 years',  specialty: 'Blow dry bar, toning & colour refreshes',            emoji: '🌸', quote: '"There\'s nothing like watching a client see themselves in the mirror."', initials: 'CA' },
]

function Team() {
  return (
    <section id="team" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Our Team</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 14px' }}>The artists behind the work</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>Six master stylists, each with their own craft. Together, they&apos;re The Loft.</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TEAM.map((member, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: 24, textAlign: 'center', boxShadow: '0 4px 24px rgba(28,21,16,0.06)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accentLt} 0%, rgba(184,149,106,0.2) 100%)`, border: `2px solid ${C.borderHi}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, flexShrink: 0 }}>
                  {member.emoji}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: '-0.01em', marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{member.role}</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>{member.years} experience</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 16 }}>{member.specialty}</div>
                <p style={{ fontSize: 12, color: C.subtle, fontStyle: 'italic', lineHeight: 1.6, margin: '0' }}>{member.quote}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function CinematicReel() {
  return (
    <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>The Loft Experience</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 12px' }}>See what we do</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>From colour to care — every service crafted with intention, by a team that genuinely loves what they do.</p>
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

const PEXELS = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop`

const GALLERY = [
  { label: 'Balayage',       sub: 'Emma · 3 hours',      tag: 'Colour',     c1: '#e8d5c4', c2: '#c9a47e', photo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80' },
  { label: 'Keratin Finish', sub: 'Lily · 2.5 hours',    tag: 'Treatment',  c1: '#dce8d5', c2: '#8eb87e', photo: PEXELS(3993330) },
  { label: 'Editorial Cut',  sub: 'Natasha · 1.5 hours', tag: 'Cut & Style',c1: '#d5dce8', c2: '#7e95b8', photo: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&h=400&fit=crop&q=80' },
  { label: 'Full Highlights',sub: 'Emma · 4 hours',      tag: 'Colour',     c1: '#e8ddd5', c2: '#b89e7e', photo: PEXELS(3993323) },
  { label: 'Bridal Updo',    sub: 'Natasha · 2 hours',   tag: 'Bridal',     c1: '#e8d5e0', c2: '#c47ea8', photo: PEXELS(10561323) },
  { label: 'Curly Texture',  sub: 'Jade · 2 hours',      tag: 'Cut & Style',c1: '#e8e5d5', c2: '#b8a87e', photo: PEXELS(9253775) },
]

function Gallery() {
  return (
    <section id="gallery" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Our Work</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 14px' }}>Transformations we&apos;re proud of</h2>
          <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto' }}>Every client leaves The Loft looking — and feeling — like the best version of themselves.</p>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {GALLERY.map((item, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div style={{ borderRadius: 20, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 4px 20px rgba(28,21,16,0.07)' }}>
                <div style={{ height: 220, background: `linear-gradient(160deg, ${item.c1} 0%, ${item.c2} 100%)`, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.photo} alt={item.label}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '4px 12px', fontSize: 11, fontWeight: 700, color: C.text, letterSpacing: '0.06em' }}>{item.tag}</div>
                </div>
                <div style={{ background: C.card, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Stars size={11} />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

const REVIEWS = [
  { name: 'Rachel M.', initials: 'RM', service: 'Balayage + Blow Dry', time: '2 hours ago',  text: "Emma is an absolute artist. My balayage has never looked so natural. I walked in with a photo reference and she nailed it — honestly better than I imagined." },
  { name: 'Priya K.',  initials: 'PK', service: 'Colour + Cut',        time: 'Yesterday',    text: "Walked in stressed, walked out feeling like a completely different person. The team here genuinely cares about what you want. Already booked my next one." },
  { name: 'Sophie T.', initials: 'ST', service: 'Keratin Treatment',   time: '3 days ago',   text: "I've been coming here 3 years and the quality just keeps getting better. Lily knows exactly what my hair needs. The keratin lasts months — totally worth it." },
  { name: 'Jess O.',   initials: 'JO', service: 'Full Highlights',     time: '1 week ago',   text: "Best salon in Double Bay, hands down. Tash always knows what I need before I even explain it. The vibe in here is incredible — it feels like a proper treat every time." },
  { name: 'Mia R.',    initials: 'MR', service: 'Brazilian Blowout',   time: '2 weeks ago',  text: "The whole experience is just flawless. They remember how I like my coffee, they remember my hair history. And the results are always incredible. 10/10 every time." },
  { name: 'Lauren B.', initials: 'LB', service: 'Toner Refresh',       time: '2 weeks ago',  text: "My hair has genuinely never been healthier since I switched to The Loft. Every single stylist is so talented and the atmosphere makes you feel like a total VIP." },
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
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.surface }}>
      <div style={W}>
        <FadeUp style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLt, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 16px', marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent }}>Client Reviews</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: C.text, letterSpacing: '-0.03em', margin: '0 0 16px' }}>What our clients say</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Stars />
            <span style={{ fontWeight: 700, color: C.text }}>4.9</span>
            <span style={{ fontSize: 14, color: C.muted }}>· 847 Google reviews</span>
          </div>
        </FadeUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <AnimatePresence>
            {REVIEWS.slice(0, count).map((r) => (
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

function BookingCTA() {
  return (
    <section id="contact" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: C.bg }}>
      <div style={W}>
        <FadeUp>
          <div style={{ background: `linear-gradient(135deg, rgba(184,149,106,0.1) 0%, rgba(184,149,106,0.04) 100%)`, border: `1px solid ${C.borderHi}`, borderRadius: 32, padding: 'clamp(2.5rem, 6vw, 4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,106,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>✂️</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 800, color: C.text, letterSpacing: '-0.04em', margin: '0 0 14px', lineHeight: 1.1 }}>
                Ready for your transformation?
              </h2>
              <p style={{ fontSize: 17, color: C.muted, maxWidth: 500, margin: '0 auto 36px', lineHeight: 1.7 }}>
                Book online in seconds. Choose your stylist, pick a time, and we&apos;ll take care of everything else.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
                <button style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 100, padding: '16px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 8px 30px rgba(184,149,106,0.3)` }}>
                  Book an Appointment →
                </button>
                <button style={{ background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 100, padding: '16px 32px', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                  Call us · (02) 9327 5880
                </button>
              </div>
              <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: '📍', text: 'Knox St, Double Bay NSW 2028' },
                  { icon: '🕐', text: 'Mon–Sat · 9am–7pm' },
                  { icon: '💳', text: 'All cards accepted' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.muted }}>
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

function Reveal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const glow = useTransform(scrollYProgress, [0, 0.4], [0, 1])
  return (
    <section ref={ref} style={{ position: 'relative', padding: 'clamp(5rem, 10vw, 8rem) 0', overflow: 'hidden', background: `linear-gradient(to bottom, ${C.bg} 0%, #030108 40%)` }}>
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
            Everything running seamlessly behind the scenes — booking confirmations, perfectly-timed reminders, review collection, full calendar — is Shoulder Monkey, running silently underneath The Loft&apos;s brand.
          </p>
        </FadeUp>
        <FadeUp delay={0.22}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 56, textAlign: 'left' }}>
            {[
              { label: 'Automated SMS sequences', desc: 'Confirmation → reminder → rebook. Every time, automatically.' },
              { label: 'Online booking system',   desc: '24/7 bookings. No phone calls. No double-bookings.' },
              { label: 'Review generation',       desc: 'Sent after every visit. Grows your reputation on autopilot.' },
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

import { NicheEnquiryForm } from '../../components/NicheEnquiryForm'

export default function SalonPage() {
  return (
    <div style={{ background: C.bg }}>
      <Nav />
      <Hero />
      <Services />
      <Team />
      <CinematicReel />
      <Gallery />
      <Reviews />
      <BookingCTA />
      <NicheEnquiryForm niche="salon" />
      <Reveal />
    </div>
  )
}
