'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Start your free trial',
    body: 'Sign up in minutes. No complicated onboarding form. No contract. Your account is created instantly and your 14-day trial begins from day one — card required, but you won\'t be charged until your trial ends.',
    color: '#844bfe',
    detail: '14 days · Card required · Cancel anytime',
  },
  {
    number: '02',
    title: 'We set you up. You show up.',
    body: 'We apply your pre-configured snapshot — 2 pipelines built, calendar set up, email templates branded, 30 CRM fields ready. You get a walkthrough, not a setup job. You\'re operational the same day.',
    color: '#00ebc1',
    detail: 'Day 1 ready · Pre-configured snapshot · White-glove setup',
  },
  {
    number: '03',
    title: 'Your business runs. In the background.',
    body: 'Leads come in. Automations fire. Follow-ups go out. Appointments get reminders. Reviews get requested. You open your phone on a Monday morning and it\'s all done. You didn\'t do any of it manually.',
    color: '#ff0199',
    detail: 'Automated · Always on · No manual chasing',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%'])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        background: '#030108',
        overflow: 'hidden',
      }}
    >
      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="label-pill">How It Works</div>
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
            Three steps to a business<br />
            that <span className="text-gradient-cyan">runs itself.</span>
          </motion.h2>
        </div>

        {/* Steps */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '28px', top: '40px', bottom: '40px', width: '1px', background: 'rgba(132,75,254,0.12)' }}>
            <motion.div
              style={{ height: lineHeight, background: 'linear-gradient(to bottom, #844bfe, #00ebc1, #ff0199)', width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}
              >
                {/* Step circle */}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`,
                  border: `1px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 24px ${step.color}20`,
                  position: 'relative', zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-syne), sans-serif',
                    fontSize: '0.8125rem', fontWeight: 800,
                    color: step.color, letterSpacing: '0.04em',
                  }}>{step.number}</span>
                </div>

                {/* Content */}
                <div style={{ paddingTop: '8px', flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-syne), sans-serif',
                    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                    fontWeight: 800, color: '#ffffff',
                    letterSpacing: '-0.02em', marginBottom: '0.875rem',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '1rem', color: 'rgba(240,237,255,0.55)', lineHeight: 1.75, marginBottom: '1rem' }}>
                    {step.body}
                  </p>
                  <div style={{
                    display: 'inline-flex', padding: '4px 12px',
                    borderRadius: '100px',
                    background: `${step.color}10`,
                    border: `1px solid ${step.color}25`,
                    fontSize: '0.75rem', fontWeight: 600,
                    color: step.color, letterSpacing: '0.04em',
                  }}>
                    {step.detail}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA after steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <a href="#pricing" className="btn-primary" style={{ fontSize: '1.0625rem', padding: '1.125rem 2.75rem' }}>
            Start Your Free Trial
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'rgba(240,237,255,0.3)' }}>
            14 days free · No lock-in · Cancel anytime
          </p>
        </motion.div>

      </div>
    </section>
  )
}
