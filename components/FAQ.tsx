'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'What is Shoulder Monkey and how is it different from other tools?',
    a: 'Shoulder Monkey is an all-in-one business management platform built for service businesses worldwide — with a strong focus on Australia and New Zealand. Unlike generic tools like HubSpot or ActiveCampaign — which are built for enterprise and require weeks of setup — Shoulder Monkey is pre-configured for your industry and operational from day one. It replaces your booking app, CRM, email marketing, SMS, pipeline tracker, and reputation tool with a single platform that actually works together.',
  },
  {
    q: 'Do I need to be tech-savvy to use it?',
    a: 'No. Shoulder Monkey is built for business owners who run salons, gyms, clinics, and service businesses — not software engineers. Your account is pre-configured with your snapshot before you log in, so you\'re not starting from scratch. We walk you through everything and the platform is designed to be used by someone who just wants it to work — not learn a new system.',
  },
  {
    q: 'What exactly happens during the 14-day free trial?',
    a: 'You get full access to your plan — not a limited demo version — for 14 days. Your account is pre-configured with your snapshot including 2 pipelines, calendar, email templates, and 30 custom CRM fields. We walk you through the platform so you\'re using it from day one. Your card is captured upfront but you won\'t be charged until your trial ends.',
  },
  {
    q: 'Will this replace my existing booking software (Fresha, Cliniko, Mindbody)?',
    a: 'For most clients, yes — Shoulder Monkey has a built-in booking and appointment system that handles confirmations, reminders, and calendar management. If you\'re in a clinical setting using specialised practice management software like Cliniko for clinical records, Shoulder Monkey sits alongside it handling your marketing, lead follow-up, and CRM — not your clinical workflows.',
  },
  {
    q: 'How long does it take to get set up?',
    a: 'Same day. We apply your pre-configured snapshot when you sign up, which means your pipelines, calendar, email templates, and CRM fields are already built. You don\'t configure anything from scratch. Most clients are actively using the platform within a few hours of signing up.',
  },
  {
    q: 'What platform does Shoulder Monkey run on?',
    a: 'Shoulder Monkey is built on enterprise-grade business management infrastructure used by tens of thousands of agencies worldwide. It\'s fully white-labelled and pre-configured specifically for your type of service business — so you\'re not getting a generic account. You\'re getting a system that\'s already been set up for your industry, with real support from a team based in Australia.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No lock-in contracts, no cancellation fees. Cancel anytime through your account dashboard or by contacting us. If you cancel during your trial, you won\'t be charged.',
  },
  {
    q: 'What if I need help after I sign up?',
    a: 'You get access to our knowledge base immediately, and we\'re based in Sydney — you\'re not dealing with an offshore call centre. We\'re available by email and chat, and for clients on monthly plans, we\'re here when you need us.',
  },
  {
    q: 'Does Shoulder Monkey work for my type of business?',
    a: 'If you run a service business — any kind — it almost certainly does. Shoulder Monkey works across hair and beauty, gyms and fitness, med spas and clinics, mortgage brokers, allied health, tradies, real estate, accountants, cleaners, coaches, pet services, and more. If your business captures leads, books appointments, sends invoices, and needs clients to come back, Shoulder Monkey was built for you. If you\'re unsure, email us at info@shouldermonkey.co and we\'ll tell you straight.',
  },
]

function FAQItem({ faq, index }: { faq: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{
        borderBottom: '1px solid rgba(132,75,254,0.1)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '1.5rem 0',
          background: 'none', border: 'none',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-syne), sans-serif',
          fontSize: 'clamp(0.975rem, 2vw, 1.0625rem)',
          fontWeight: 700, color: open ? '#a673ff' : '#ffffff',
          lineHeight: 1.4, transition: 'color 0.2s ease',
        }}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: open ? 'rgba(132,75,254,0.2)' : 'rgba(132,75,254,0.08)',
            border: '1px solid rgba(132,75,254,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="#844bfe" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ paddingBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(240,237,255,0.55)', lineHeight: 1.75 }}>
                {faq.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  return (
    <section
      id="faq"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        background: '#030108',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4rem)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="label-pill">Common Questions</div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800, lineHeight: 1.1,
              letterSpacing: '-0.03em', color: '#ffffff',
            }}
          >
            Everything you want to know <span className="text-gradient-purple">before you sign up.</span>
          </motion.h2>
        </div>

        {/* FAQs */}
        <div>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center', marginTop: '3.5rem',
            padding: '2.5rem',
            background: 'rgba(132,75,254,0.05)',
            border: '1px solid rgba(132,75,254,0.15)',
            borderRadius: '20px',
          }}
        >
          <p style={{ fontSize: '1.0625rem', color: 'rgba(240,237,255,0.6)', marginBottom: '1.25rem' }}>
            Still got questions? We're based in Sydney, AU — and we actually reply.
          </p>
          <a href="mailto:info@shouldermonkey.co" className="btn-ghost">
            Send us a message
          </a>
        </motion.div>
      </div>
    </section>
  )
}
