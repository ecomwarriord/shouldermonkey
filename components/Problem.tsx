'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const TOOLS = [
  { name: 'CRM & Pipeline',        icon: '🎯', cost: '$99/mo',  pain: 'Contacts everywhere. Deals falling through cracks.',  replaces: 'HubSpot, ClickUp' },
  { name: 'Sales Funnels',         icon: '🔧', cost: '$297/mo', pain: 'High-converting funnels locked behind expensive tools.', replaces: 'ClickFunnels, Kartra' },
  { name: 'Website Builder',       icon: '🌐', cost: '$29/mo',  pain: 'Your site, your booking page, your forms — all separate.', replaces: 'WordPress, Wix, Squarespace' },
  { name: 'Surveys & Forms',       icon: '📋', cost: '$49/mo',  pain: 'Lead capture forms that live in a completely different app.', replaces: 'Typeform, Wufoo' },
  { name: 'Email Marketing',       icon: '📧', cost: '$99/mo',  pain: 'Campaigns that don\'t trigger from anything in your CRM.', replaces: 'Mailchimp, ActiveCampaign' },
  { name: '2-Way SMS',             icon: '📱', cost: '$99/mo',  pain: 'Texting clients from your personal number. No record kept.', replaces: 'Klaviyo, Twilio' },
  { name: 'Booking & Appointments',icon: '📅', cost: '$29/mo',  pain: 'Reminders only. No follow-up when they cancel or no-show.', replaces: 'Calendly, Acuity, Timely' },
  { name: 'Workflow Automation',   icon: '⚡', cost: '$169/mo', pain: 'Manual follow-up. Every. Single. Time.',                 replaces: 'Keap, ActiveCampaign' },
  { name: 'Courses & Products',    icon: '📚', cost: '$99/mo',  pain: 'Your knowledge base living on a platform that eats margin.', replaces: 'Kajabi, Teachable' },
  { name: 'Call Tracking',         icon: '📞', cost: '$95/mo',  pain: 'No idea which ads or campaigns are generating real calls.',  replaces: 'CallRail, Convirza' },
  { name: 'Reputation Management', icon: '⭐', cost: '$299/mo', pain: 'Manually asking for Google reviews one by one. Embarrassing.', replaces: 'Birdeye, Podium' },
  { name: 'Tracking & Analytics',  icon: '📊', cost: '$49/mo',  pain: 'Data in one place. Attribution in another. No full picture.', replaces: 'CallTrackingMetrics' },
]

function ToolCard({ tool, index }: { tool: typeof TOOLS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,1,153,0.25)' }}
      style={{
        background: 'rgba(10,6,18,0.6)',
        border: '1px solid rgba(132,75,254,0.1)',
        borderRadius: '14px',
        padding: '1.125rem 1.25rem',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Red pulse dot */}
      <div style={{
        position: 'absolute', top: '12px', right: '12px',
        width: '6px', height: '6px', borderRadius: '50%',
        background: '#ff0199',
        boxShadow: '0 0 8px rgba(255,1,153,0.8)',
        animation: 'pulse-glow 2s infinite',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{tool.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '3px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'rgba(240,237,255,0.9)' }}>{tool.name}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700,
              color: '#ff0199', padding: '1px 6px',
              background: 'rgba(255,1,153,0.08)',
              border: '1px solid rgba(255,1,153,0.15)',
              borderRadius: '100px', flexShrink: 0,
            }}>{tool.cost}</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'rgba(240,237,255,0.35)', lineHeight: 1.5, fontStyle: 'italic', marginBottom: '4px' }}>{tool.pain}</p>
          <p style={{ fontSize: '0.7rem', color: 'rgba(132,75,254,0.5)', lineHeight: 1.4 }}>Replaces: {tool.replaces}</p>
        </div>
      </div>
    </motion.div>
  )
}

const TOTAL_USD = 1412
const TOTAL_AUD_APPROX = Math.round(TOTAL_USD * 1.55)

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  const totalRef = useRef<HTMLDivElement>(null)
  const totalInView = useInView(totalRef, { once: true })

  return (
    <section
      id="problem"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #030108, #0a0612 50%, #030108)',
      }}
    >
      {/* Background glow */}
      <motion.div style={{ y, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(255,1,153,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </motion.div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div className="label-pill" style={{ borderColor: 'rgba(255,1,153,0.25)', background: 'rgba(255,1,153,0.08)', color: '#ff0199' }}>
              The Problem
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800, lineHeight: 1.05,
              letterSpacing: '-0.03em', color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            You're paying for<br />
            <span style={{
              background: 'linear-gradient(135deg, #ff0199, #844bfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>12 broken tools.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(240,237,255,0.5)',
              lineHeight: 1.7,
              maxWidth: '600px', margin: '0 auto',
            }}
          >
            Each one costs money. None of them talk to each other. And every gap between them is a lead you just lost.
          </motion.p>
        </div>

        {/* Tool grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '0.875rem',
          marginBottom: '3rem',
        }}>
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} index={i} />
          ))}
        </div>

        {/* Total cost callout */}
        <motion.div
          ref={totalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={totalInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '780px', margin: '0 auto',
            background: 'rgba(255,1,153,0.05)',
            border: '1px solid rgba(255,1,153,0.2)',
            borderRadius: '20px',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,1,153,0.08), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
            color: 'rgba(240,237,255,0.45)',
            marginBottom: '0.75rem', position: 'relative',
          }}>
            If you bought all 12 tools separately, you'd pay:
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 'clamp(1.5rem, 4vw, 4rem)', flexWrap: 'wrap',
            marginBottom: '1.25rem', position: 'relative',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ff0199, #ff6ac2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                US$1,412/mo
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,237,255,0.3)', letterSpacing: '0.05em' }}>for 12 separate tools</div>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'rgba(240,237,255,0.2)', fontWeight: 300 }}>→</div>

            <div>
              <div style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00ebc1, #844bfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                A$478/mo
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(240,237,255,0.3)', letterSpacing: '0.05em' }}>Shoulder Monkey Platinum</div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(0,235,193,0.08)', border: '1px solid rgba(0,235,193,0.2)',
            fontSize: '0.8125rem', fontWeight: 700, color: '#00ebc1',
            position: 'relative',
          }}>
            ✓ Everything included. One login. Operational from day one.
          </div>
        </motion.div>

      </div>
    </section>
  )
}
