'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PLANS = [
  {
    name: 'Silver',
    price: 246,
    period: '/month',
    tag: 'Get Started',
    highlight: false,
    color: '#844bfe',
    stripeUrl: 'https://buy.stripe.com/00w7sL9Lx4dw9B01Dbg7e00',
    description: 'Everything you need to get your business organised and start capturing leads properly.',
    features: [
      { text: 'CRM & Contact Management',          included: true },
      { text: 'Sales Pipelines',                   included: true },
      { text: 'Booking & Appointment Calendar',    included: true },
      { text: 'Website Builder',                   included: true },
      { text: 'Surveys & Forms',                   included: true },
      { text: 'Social Media Planner',              included: true },
      { text: 'Invoicing & Document Management',   included: true },
      { text: 'Up to 5 Users',                     included: true },
      { text: 'Email Marketing',                   included: false },
      { text: 'Sales Funnels',                     included: false },
      { text: '2-Way SMS',                         included: false },
      { text: 'Automation & Workflows',            included: false },
      { text: 'Reputation Management',             included: false },
      { text: 'Call Tracking',                     included: false },
      { text: 'Mobile App',                        included: false },
    ],
  },
  {
    name: 'Gold',
    price: 368,
    period: '/month',
    tag: 'Most Popular',
    highlight: true,
    color: '#00ebc1',
    stripeUrl: 'https://buy.stripe.com/00gcN5e1NeSa6oOchPg7e01',
    description: 'The full marketing engine. Capture leads, nurture them, and convert them — automatically.',
    features: [
      { text: 'Everything in Silver',              included: true },
      { text: 'Email Marketing & Campaigns',       included: true },
      { text: 'Sales Funnels & Landing Pages',     included: true },
      { text: 'Tracking & Analytics',              included: true },
      { text: 'Blog & Content Management',         included: true },
      { text: 'Up to 5 Users',                     included: true },
      { text: '2-Way SMS',                         included: false },
      { text: 'Automation & Workflows',            included: false },
      { text: 'Reputation Management',             included: false },
      { text: 'Call Tracking',                     included: false },
      { text: 'Mobile App (iOS + Android)',        included: false },
    ],
  },
  {
    name: 'Platinum',
    price: 478,
    period: '/month',
    tag: 'Full Power',
    highlight: false,
    color: '#ff0199',
    stripeUrl: 'https://buy.stripe.com/dRm4gz2j57pI14uepXg7e02',
    description: 'The complete Shoulder Monkey experience. Automate everything. Grow without limits.',
    features: [
      { text: 'Everything in Gold',                included: true },
      { text: '2-Way SMS Marketing',               included: true },
      { text: 'Automation & Workflows',            included: true },
      { text: 'Reputation Management',             included: true },
      { text: 'Call Tracking',                     included: true },
      { text: 'Mobile App (iOS + Android)',        included: true },
      { text: 'Up to 5 Users',                     included: true },
    ],
  },
]

function PlanCard({ plan, index, annual }: { plan: typeof PLANS[0]; index: number; annual: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const price = annual ? Math.round(plan.price * (11 / 12)) : plan.price

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: '24px',
        background: plan.highlight
          ? `linear-gradient(160deg, rgba(0,235,193,0.1) 0%, rgba(10,6,18,0.9) 60%)`
          : 'rgba(10,6,18,0.6)',
        border: `1px solid ${plan.highlight ? 'rgba(0,235,193,0.35)' : 'rgba(132,75,254,0.12)'}`,
        padding: 'clamp(1.75rem, 4vw, 2.5rem)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        overflow: 'hidden',
        transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
        boxShadow: plan.highlight ? `0 32px 80px rgba(0,235,193,0.12)` : 'none',
      }}
    >
      {/* Top glow bar */}
      {plan.highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${plan.color}, transparent)`,
        }} />
      )}

      {/* Tag */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '3px 12px', borderRadius: '100px',
        background: `${plan.color}15`,
        border: `1px solid ${plan.color}30`,
        color: plan.color,
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        marginBottom: '1.25rem', width: 'fit-content',
      }}>
        {plan.highlight && <span style={{ width: 5, height: 5, borderRadius: '50%', background: plan.color, display: 'inline-block' }} />}
        {plan.tag}
      </div>

      {/* Name & price */}
      <div style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
        {plan.name}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
          fontWeight: 800,
          color: plan.color,
          lineHeight: 1,
        }}>
          ${price}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.35)' }}>/mo ex GST</span>
      </div>
      {annual && (
        <div style={{ fontSize: '0.75rem', color: plan.color, fontWeight: 600, marginBottom: '0.75rem', opacity: 0.8 }}>
          Billed as ${(price * 11).toLocaleString()}/yr · save ${plan.price}/mo
        </div>
      )}

      <p style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.45)', lineHeight: 1.65, marginBottom: '1.75rem' }}>
        {plan.description}
      </p>

      {/* CTA */}
      <a
        href={plan.stripeUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0.875rem',
          borderRadius: '100px',
          background: plan.highlight ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` : 'transparent',
          border: `1px solid ${plan.highlight ? 'transparent' : plan.color + '40'}`,
          color: plan.highlight ? '#ffffff' : plan.color,
          fontWeight: 700, fontSize: '0.9375rem',
          textDecoration: 'none',
          marginBottom: '1.75rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 8px 32px ${plan.color}35`
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Start 14-Day Free Trial
      </a>

      {/* Money-back note */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(240,237,255,0.3)', marginTop: '-1.25rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
        30-day money-back guarantee · Cancel anytime
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(132,75,254,0.1)', marginBottom: '1.5rem' }} />

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {plan.features.map((f) => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {f.included ? (
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: `${plan.color}18`, border: `1px solid ${plan.color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5l2 2L7.5 2" stroke={plan.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: '6px', height: '1px', background: 'rgba(240,237,255,0.2)' }} />
              </div>
            )}
            <span style={{
              fontSize: '0.85rem',
              color: f.included ? 'rgba(240,237,255,0.75)' : 'rgba(240,237,255,0.22)',
              lineHeight: 1.4,
            }}>
              {f.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section
      id="pricing"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        background: 'linear-gradient(to bottom, #030108, #0a0612 40%, #030108)',
        overflow: 'hidden',
      }}
    >
      {/* BG */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(132,75,254,0.07), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="label-pill">Transparent Pricing</div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1.25rem',
            }}
          >
            No surprises.{' '}
            <span className="text-gradient-purple">No hidden fees.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ fontSize: '1.1rem', color: 'rgba(240,237,255,0.5)', maxWidth: '480px', margin: '0 auto 1.25rem' }}
          >
            All plans include a 14-day free trial. Cancel anytime.
          </motion.p>

          {/* Price lock */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px', borderRadius: '100px',
              background: 'rgba(254,200,113,0.07)',
              border: '1px solid rgba(254,200,113,0.2)',
              marginBottom: '2rem',
            }}
          >
            <span style={{ fontSize: '13px' }}>🔒</span>
            <span style={{ fontSize: '0.8125rem', color: '#fec871', fontWeight: 600 }}>
              Lock in today&apos;s price — it won&apos;t increase as we grow.
            </span>
          </motion.div>

          {/* Annual toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}
          >
            <span style={{ fontSize: '0.875rem', color: annual ? 'rgba(240,237,255,0.4)' : 'rgba(240,237,255,0.8)', fontWeight: 500 }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: '48px', height: '26px', borderRadius: '100px',
                background: annual ? 'linear-gradient(135deg, #844bfe, #4623d3)' : 'rgba(132,75,254,0.2)',
                border: '1px solid rgba(132,75,254,0.3)',
                position: 'relative', transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: annual ? '24px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#ffffff',
                transition: 'left 0.25s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
            <span style={{ fontSize: '0.875rem', color: annual ? 'rgba(240,237,255,0.8)' : 'rgba(240,237,255,0.4)', fontWeight: 500 }}>
              Annual <span style={{ color: '#00ebc1', fontWeight: 700 }}>— 1 month free</span>
            </span>
          </motion.div>
        </div>

        {/* ROI maths */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            maxWidth: '680px', margin: '0 auto 3rem',
            padding: '1.5rem 2rem',
            borderRadius: '16px',
            background: 'rgba(132,75,254,0.06)',
            border: '1px solid rgba(132,75,254,0.18)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#844bfe', marginBottom: '0.75rem' }}>
            The maths
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.65)', lineHeight: 1.75, margin: 0 }}>
            The average service business misses <strong style={{ color: '#ffffff' }}>4–6 leads a week</strong> from slow or no follow-up.
            At A$150 per client, that's <strong style={{ color: '#ffffff' }}>A$2,400–3,600 a month</strong> walking out the door.
            Shoulder Monkey Gold costs <strong style={{ color: '#00ebc1' }}>A$368/mo</strong> and follows up every lead in under 30 seconds — automatically.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          alignItems: 'stretch',
          marginBottom: '3rem',
        }}>
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} annual={annual} />
          ))}
        </div>

        {/* Bottom trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '2rem', padding: '2rem', textAlign: 'center',
          }}
        >
          {[
            { icon: '🛡️', text: '14-day free trial included' },
            { icon: '💰', text: '30-day money-back guarantee' },
            { icon: '🚫', text: 'No lock-in contracts' },
            { icon: '🌏', text: 'Pricing in AUD · Available globally' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.45)', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
