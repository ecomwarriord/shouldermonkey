'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MILESTONES = [
  {
    day: 'Day 1',
    color: '#844bfe',
    title: 'You show up. We handle the rest.',
    body: 'Your account is set up, pre-configured for your niche, before the walkthrough call. You arrive to a working system — not a blank slate.',
  },
  {
    day: 'Day 3',
    color: '#00ebc1',
    title: 'First automation live.',
    body: 'Every new lead gets an instant reply in under 30 seconds — even at midnight. Your first workflow is running before the end of the week.',
  },
  {
    day: 'Day 7',
    color: '#fec871',
    title: 'Cancel your first old tool.',
    body: 'By day seven most members have replaced at least one subscription they were already paying for. The savings start immediately.',
  },
  {
    day: 'Day 14',
    color: '#a673ff',
    title: 'Trial ends. Your call.',
    body: 'You\'ve seen the platform work in your business for two weeks. Keep going, or cancel — you won\'t be charged. No awkward conversation required.',
  },
  {
    day: 'Day 30',
    color: '#ff0199',
    title: 'Money-back guarantee.',
    body: 'If you\'ve given it a full month and it\'s not working for you, ask for a refund. We\'d rather earn it than keep it.',
  },
]

const TRUST_ITEMS = [
  {
    label: 'Enterprise infrastructure',
    detail: 'Built for reliability, uptime, and scale',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.6-.8L10 2z" fill="#844bfe" opacity="0.8"/>
      </svg>
    ),
  },
  {
    label: 'Payments via Stripe',
    detail: 'Bank-grade checkout security',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="5" width="16" height="12" rx="2" stroke="#00ebc1" strokeWidth="1.4" opacity="0.8"/>
        <path d="M2 8h16" stroke="#00ebc1" strokeWidth="1.4" opacity="0.8"/>
      </svg>
    ),
  },
  {
    label: 'SOC 2 compliant',
    detail: 'Your data is encrypted and protected',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke="#fec871" strokeWidth="1.4" opacity="0.8"/>
        <path d="M7 10l2 2 4-4" stroke="#fec871" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      </svg>
    ),
  },
  {
    label: '14-day free trial',
    detail: 'Card captured, not charged until day 15',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#ff0199" strokeWidth="1.4" opacity="0.8"/>
        <path d="M10 6v4.5l2.5 1.5" stroke="#ff0199" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"/>
      </svg>
    ),
  },
  {
    label: 'Your data stays local',
    detail: 'Stored in your region — AU, NZ, or wherever your business operates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="#00ebc1" strokeWidth="1.4" opacity="0.8"/>
        <path d="M10 3c0 0-4 3-4 7s4 7 4 7M10 3c0 0 4 3 4 7s-4 7-4 7M3 10h14" stroke="#00ebc1" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"/>
      </svg>
    ),
  },
]

function MilestoneCard({ m, index }: { m: typeof MILESTONES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        background: 'rgba(10,6,18,0.6)',
        border: `1px solid ${m.color}20`,
        borderRadius: '20px',
        padding: '1.75rem',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
        overflow: 'hidden',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${m.color}60, transparent)`,
      }} />

      {/* Day badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '3px 12px', borderRadius: '100px', width: 'fit-content',
        background: `${m.color}12`, border: `1px solid ${m.color}30`,
        fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: m.color,
      }}>
        {m.day}
      </div>

      <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
        {m.title}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.7 }}>
        {m.body}
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  return (
    <section
      id="testimonials"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        background: 'linear-gradient(to bottom, #030108, #0a0612 50%, #030108)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,75,254,0.07), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,235,193,0.05), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div className="label-pill">No Surprises</div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            Here&apos;s exactly what<br />
            <span className="text-gradient-cyan">happens next.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'rgba(240,237,255,0.5)', lineHeight: 1.7,
              maxWidth: '520px', margin: '0 auto',
            }}
          >
            No complicated onboarding. No figuring it out alone. Here&apos;s what the first 30 days look like.
          </motion.p>
        </div>

        {/* Milestone grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          marginBottom: '5rem',
        }}>
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.day} m={m} index={i} />
          ))}
        </div>

        {/* 90-day success picture */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            margin: '0 0 4rem',
            padding: 'clamp(2rem, 4vw, 3rem)',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(0,235,193,0.06), rgba(132,75,254,0.04))',
            border: '1px solid rgba(0,235,193,0.15)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00ebc1', marginBottom: '1rem' }}>
            90 days in
          </div>
          <h3 style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.2,
            marginBottom: '1.25rem',
          }}>
            This is what your business looks like<br />
            <span className="text-gradient-cyan">when the system is working.</span>
          </h3>
          <p style={{ fontSize: '1rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.75, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Leads replied to in seconds — not hours. No-shows down. Reviews growing without you asking. Your calendar full because the system fills it. And you, finally, working on your business instead of in it.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            maxWidth: '700px', margin: '0 auto',
          }}>
            {[
              { stat: '< 30s', label: 'Average lead response time' },
              { stat: 'Automated', label: 'Every follow-up sequence' },
              { stat: 'Growing', label: 'Google reviews — passively' },
              { stat: 'Cancelled', label: 'At least 3 old subscriptions' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '1.25rem 1rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(0,235,193,0.1)',
              }}>
                <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.375rem', fontWeight: 800, color: '#00ebc1', marginBottom: '4px' }}>{item.stat}</div>
                <div style={{ fontSize: '0.775rem', color: 'rgba(240,237,255,0.4)', lineHeight: 1.4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platform trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            borderTop: '1px solid rgba(132,75,254,0.1)',
            paddingTop: '3rem',
          }}
        >
          <div style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240,237,255,0.2)', marginBottom: '2rem' }}>
            What&apos;s under the hood
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {TRUST_ITEMS.map((item) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ flexShrink: 0, marginTop: '1px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'rgba(240,237,255,0.8)', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ fontSize: '0.775rem', color: 'rgba(240,237,255,0.3)', lineHeight: 1.5 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
