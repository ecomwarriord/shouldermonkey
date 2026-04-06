'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FEATURES = [
  { icon: '🎯', label: 'CRM & Pipelines',     color: '#844bfe', desc: 'Every lead tracked. Every deal visible. Nothing falls through the cracks.' },
  { icon: '📅', label: 'Bookings & Calendar',  color: '#00ebc1', desc: 'Automated confirmations, reminders, and rescheduling — zero no-shows.' },
  { icon: '⚡', label: 'Automation & Workflows', color: '#ff0199', desc: 'Follow up every lead instantly. Nurture clients while you sleep.' },
  { icon: '⭐', label: 'Reputation Management', color: '#fec871', desc: 'Review requests go out automatically. Your Google profile builds itself.' },
  { icon: '📱', label: '2-Way SMS Marketing',   color: '#00ebc1', desc: 'Text your clients directly. They actually read texts.' },
  { icon: '📧', label: 'Email Marketing',        color: '#844bfe', desc: 'Campaigns, sequences, and broadcasts — all in one place.' },
  { icon: '🌐', label: 'Website Builder',        color: '#ff0199', desc: 'Build landing pages and your site without touching code.' },
  { icon: '📊', label: 'Tracking & Analytics',  color: '#fec871', desc: 'See exactly what\'s working and what\'s wasting your money.' },
  { icon: '📞', label: 'Call Tracking',          color: '#00ebc1', desc: 'Know which ads and campaigns are generating real phone calls.' },
  { icon: '📋', label: 'Invoices & Contracts',  color: '#844bfe', desc: 'Send proposals, invoices, and e-sign documents from one place.' },
  { icon: '📲', label: 'Social Planner',         color: '#ff0199', desc: 'Plan and schedule social media posts across platforms.' },
  { icon: '🔧', label: 'Sales Funnels',          color: '#fec871', desc: 'Capture leads with high-converting funnels built for service biz.' },
]

function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, borderColor: `${feat.color}40` }}
      style={{
        background: 'rgba(10,6,18,0.6)',
        border: '1px solid rgba(132,75,254,0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 16px 48px ${feat.color}18`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Top color bar */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${feat.color}60, transparent)`,
      }} />

      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: `${feat.color}12`,
        border: `1px solid ${feat.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '22px', marginBottom: '1rem',
      }}>
        {feat.icon}
      </div>
      <div style={{
        fontFamily: 'var(--font-syne), sans-serif',
        fontWeight: 700, fontSize: '0.975rem',
        color: '#ffffff', marginBottom: '6px',
      }}>
        {feat.label}
      </div>
      <p style={{ fontSize: '0.825rem', color: 'rgba(240,237,255,0.4)', lineHeight: 1.6 }}>
        {feat.desc}
      </p>
    </motion.div>
  )
}

export default function Solution() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #030108, #0a0612 30%, #0a0612 70%, #030108)',
      }}
    >
      {/* Gradient orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,75,254,0.08), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,235,193,0.06), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(3rem, 6vw, 5rem)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="label-pill">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#844bfe', display: 'inline-block' }} />
              Everything. One Platform.
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: '#ffffff',
            marginBottom: '1.25rem', textAlign: 'center',
          }}>
            Replace all of them<br />
            with{' '}
            <span className="text-gradient-purple">Shoulder Monkey.</span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(240,237,255,0.5)', lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto', textAlign: 'center',
          }}>
            Every tool your business needs, built into one platform that actually works together — so you stop managing software and start managing growth.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
          marginBottom: '4rem',
        }}>
          {FEATURES.map((feat, i) => (
            <FeatureCard key={feat.label} feat={feat} index={i} />
          ))}
        </div>

        {/* Day 1 snapshot callout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'linear-gradient(135deg, rgba(132,75,254,0.08) 0%, rgba(0,235,193,0.05) 100%)',
            border: '1px solid rgba(132,75,254,0.2)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top glow line */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(132,75,254,0.5), rgba(0,235,193,0.3), transparent)' }} />

          <div style={{ gridColumn: '1 / -1', marginBottom: '0.5rem' }}>
            <div className="label-pill" style={{ marginBottom: '1rem' }}>
              What you get on Day 1
            </div>
            <h3 style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em',
            }}>
              Pre-configured. Ready to run. <span className="text-gradient-cyan">From day one.</span>
            </h3>
          </div>

          {[
            { label: 'Discovery Call Calendar', desc: 'Pre-built and ready to share', icon: '📅' },
            { label: '2 Sales Pipelines', desc: 'Set up and mapped to your business', icon: '🎯' },
            { label: '3 Branded Email Templates', desc: 'Professional and ready to send', icon: '📧' },
            { label: '30 Custom CRM Fields', desc: 'Tailored to your service business', icon: '🔧' },
            { label: 'Review Request Flow', desc: 'Start building your reputation immediately', icon: '⭐' },
            { label: 'Knowledge Base Access', desc: 'Everything you need to learn fast', icon: '📚' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(132,75,254,0.12)',
                border: '1px solid rgba(132,75,254,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(240,237,255,0.4)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
