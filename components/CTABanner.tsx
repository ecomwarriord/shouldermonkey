'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section
      id="trial"
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 14vw, 160px) 1.5rem',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #030108, #0a0612 50%, #030108)',
      }}
    >
      {/* Parallax orbs */}
      <motion.div style={{ y: y1, position: 'absolute', top: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(132,75,254,0.18), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <motion.div style={{ y: y2, position: 'absolute', bottom: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,235,193,0.12), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <motion.div style={{ y: y1, position: 'absolute', top: '30%', right: '20%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,1,153,0.1), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        {/* Monkey icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '64px', marginBottom: '1.5rem', display: 'block', animation: 'float 6s ease-in-out infinite' }}
        >
          🐒
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
        >
          <div className="label-pill">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ebc1', display: 'inline-block', animation: 'pulse-glow 2s infinite' }} />
            14-Day Free Trial
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: '#ffffff',
            marginBottom: '1.5rem',
          }}
        >
          Stop losing leads.<br />
          <span className="text-gradient-spectrum">Start winning clients.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(240,237,255,0.5)', lineHeight: 1.7,
            maxWidth: '560px', margin: '0 auto 2.5rem',
          }}
        >
          Your competitors are already using systems like this. Every day you don't is another day of leads going cold, no-shows going unreplaced, and clients drifting to whoever follows up faster.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}
        >
          <a href="#pricing" className="btn-primary" style={{ fontSize: '1.0625rem', padding: '1.125rem 2.75rem' }}>
            Start Your Free Trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="mailto:hello@shouldermonkey.co" className="btn-ghost" style={{ fontSize: '1.0625rem', padding: '1.125rem 2.25rem' }}>
            Book a Demo
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '0.8125rem', color: 'rgba(240,237,255,0.25)' }}
        >
          14 days free · 30-day money-back guarantee · No lock-in contracts · Pricing in AUD · Available globally
        </motion.p>
      </div>
    </section>
  )
}
