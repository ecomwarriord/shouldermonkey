'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NICHES = [
  {
    id: 'salon',
    icon: '💇',
    label: 'Hair & Beauty',
    headline: 'Stop losing bookings to the salon that responded first.',
    body: 'Instagram DMs, missed calls, walk-ins — leads are coming from everywhere and falling through the cracks. Shoulder Monkey captures every enquiry, responds instantly, sends reminders automatically, and re-books clients before they drift to a competitor.',
    painPoints: ['Leads via Instagram going unanswered for 24hrs', 'No-shows with no automated reminder system', 'No way to follow up after a visit', 'Paying for Fresha + Square separately'],
    wins: ['Instant auto-response to every Instagram DM', 'Automated reminder sequences for every appointment', 'Post-visit re-booking prompts', 'Reputation management building Google reviews'],
    color: '#ff0199',
  },
  {
    id: 'gym',
    icon: '💪',
    label: 'Gyms & PTs',
    headline: "You're paying for leads you're not following up.",
    body: 'You run Facebook ads, get enquiries, and by the time you reply they\'ve joined somewhere else. Trial clients go quiet because there\'s no follow-up sequence. Members churn silently. Shoulder Monkey automates everything from the first message to the renewal reminder.',
    painPoints: ['Facebook leads responding hours later', 'Trial clients not converting — no follow-up', 'No-show trials with no reminders', 'Membership renewals going unmanaged'],
    wins: ['Instant automated response to every lead', 'Trial nurture sequence that converts', 'Automated reminder sequences', 'Win-back campaigns for churned members'],
    color: '#844bfe',
  },
  {
    id: 'medspa',
    icon: '✨',
    label: 'Med Spas & Clinics',
    headline: 'A $2,000 treatment enquiry deserves a same-minute response.',
    body: 'High-value clients expect a premium experience from the first contact. If you\'re not responding to enquiries within minutes, you\'re losing them to competitors who are. Shoulder Monkey handles your CRM, consent forms, review requests, and follow-up campaigns automatically.',
    painPoints: ['High-value leads going cold from slow response', 'Google reviews not being actively managed', 'Consent forms sent manually', 'No upsell system for returning clients'],
    wins: ['Same-minute automated response to every lead', 'Automated review request after every appointment', 'Consent form workflows triggered automatically', 'Return visit campaigns for complementary treatments'],
    color: '#00ebc1',
  },
  {
    id: 'broker',
    icon: '🏠',
    label: 'Mortgage Brokers',
    headline: 'Your referral partners are sending you leads. Are you losing them?',
    body: 'Referral leads go cold when you\'re busy with active deals. Your existing client base isn\'t being touched at the right moments — refinance triggers, anniversaries, rate changes. Shoulder Monkey keeps you top-of-mind with your network without adding hours to your week.',
    painPoints: ['Referral leads going cold while managing deals', 'Not contacting clients at refinance time', 'Zero system to stay top-of-mind with referrers', 'Google reviews sparse compared to aggregators'],
    wins: ['Automated nurture for every referral lead', 'Trigger-based client touchpoints', 'Referral partner value-add sequences', 'Passive Google review accumulation'],
    color: '#fec871',
  },
  {
    id: 'health',
    icon: '🏥',
    label: 'Allied Health',
    headline: 'Your competitor answers after hours. Do you?',
    body: 'New patient enquiries that come in after hours go to voicemail and get forgotten. Lapsed patients hear nothing from you. Your front desk is doing clinical admin and handling phones simultaneously. Shoulder Monkey fills all of it — automatically, professionally.',
    painPoints: ['After-hours enquiries going unanswered', 'Lapsed patients with no reactivation outreach', 'Front desk overwhelmed with admin and calls', 'No Google review generation system'],
    wins: ['Instant after-hours auto-response and booking', 'Lapsed patient reactivation campaigns', 'Front desk freed up for patient care', 'Automated review requests to every happy patient'],
    color: '#ff0199',
  },
  {
    id: 'tradies',
    icon: '🔧',
    label: 'Tradies',
    headline: "Your leads go cold while you're on the tools.",
    body: "You're on a roof or under a sink while enquiries hit your phone and go unanswered. By the time you're done, they've booked someone else. Shoulder Monkey responds instantly, qualifies them, books them in, and chases your invoices — while you keep working.",
    painPoints: ['Enquiries going cold while on a job', 'Quotes sent with no follow-up system', 'Chasing invoices manually', 'No review system despite happy customers'],
    wins: ['Instant auto-response to every enquiry', 'Automated quote follow-up sequences', 'Invoice reminders sent automatically', 'Review requests after every completed job'],
    color: '#fec871',
  },
  {
    id: 'realestate',
    icon: '🏡',
    label: 'Real Estate',
    headline: 'Buyers and sellers expect instant. Are you instant?',
    body: "Property enquiries come in at 10pm on a Sunday. If you're not responding within minutes, they've moved to the next listing. Shoulder Monkey captures every enquiry from every portal, responds instantly, and keeps your pipeline organised without the spreadsheet.",
    painPoints: ['Weekend enquiries unanswered until Monday', 'Contacts managed in spreadsheets', 'Vendor communication falling through the cracks', 'No systematic referral generation from past clients'],
    wins: ['24/7 automated response to every portal enquiry', 'Full CRM replacing your spreadsheets', 'Automated vendor communication sequences', 'Past client referral campaign workflows'],
    color: '#844bfe',
  },
  {
    id: 'accountants',
    icon: '📊',
    label: 'Accountants',
    headline: 'Tax time is chaos. The other 10 months are a missed opportunity.',
    body: "New client enquiries during the year get a slow response because you're heads-down. Existing clients hear nothing between lodgements. Referrals happen by accident. Shoulder Monkey runs your client communications, follow-up, and review generation — on autopilot.",
    painPoints: ['New enquiries slipping through during busy periods', 'No client communication between tax time', 'Referrals not being actively generated', 'Google reviews nonexistent versus competitors'],
    wins: ['Automated response to every new enquiry', 'Drip campaigns keeping clients engaged year-round', 'Referral request sequences that run themselves', 'Automated Google review generation post-lodgement'],
    color: '#00ebc1',
  },
  {
    id: 'cleaners',
    icon: '🧹',
    label: 'Cleaning',
    headline: 'Reliable clients are won in the first 60 seconds.',
    body: "Someone searching for a cleaner submits three quote requests at once. The first business to respond usually wins. You're probably not first. Shoulder Monkey responds instantly, books the quote, and follows up until they convert — automatically.",
    painPoints: ['Slow response losing quotes to faster competitors', 'No-shows on quote appointments', 'Clients going quiet with no re-engagement', 'Reviews not being collected after jobs'],
    wins: ['Instant response to every quote request', 'Automated reminders before every appointment', 'Lapsed client reactivation campaigns', 'Post-job review requests every time'],
    color: '#ff0199',
  },
  {
    id: 'coaches',
    icon: '🎯',
    label: 'Coaches',
    headline: 'Your expertise is the product. Admin is the enemy.',
    body: "Discovery call requests go back and forth for days. Prospects cool off between the call and the proposal. Clients don't re-engage after a programme ends. Shoulder Monkey automates your entire client journey from first contact to renewal.",
    painPoints: ['Discovery calls taking days to schedule', 'Prospects going cold between call and proposal', 'No re-engagement after programme completion', 'Referrals not being systematically requested'],
    wins: ['Instant booking link for every discovery call', 'Automated proposal follow-up sequences', 'Programme completion re-engagement workflows', 'Referral and testimonial request automation'],
    color: '#a673ff',
  },
  {
    id: 'petservices',
    icon: '🐾',
    label: 'Pet Services',
    headline: 'Pet owners book on impulse. Miss the window and they\'re gone.',
    body: "A grooming enquiry on a Saturday morning goes to whoever responds first. No-shows are constant because reminder systems take time or money. Shoulder Monkey handles every booking, reminder, and follow-up — and turns one-time clients into loyal regulars.",
    painPoints: ['Saturday enquiries going unanswered', 'No-shows with no automated reminder system', 'No system to re-book clients after each visit', 'Reviews not collected despite happy clients'],
    wins: ['Instant response to every booking request', 'Automated reminders before every appointment', 'Post-visit re-booking workflows', 'Review requests after every appointment'],
    color: '#00ebc1',
  },
]

export default function Niches() {
  const [activeId, setActiveId] = useState('salon')
  const active = NICHES.find((n) => n.id === activeId)!

  return (
    <section
      id="niches"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 12vw, 140px) 1.5rem',
        background: '#030108',
        overflow: 'hidden',
      }}
    >
      {/* BG glow */}
      <motion.div
        animate={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${active.color}08 0%, transparent 70%)` }}
        transition={{ duration: 0.8 }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 4.5rem)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
          >
            <div className="label-pill">Any Service Business</div>
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
              letterSpacing: '-0.03em', color: '#ffffff',
              marginBottom: '1.25rem',
            }}
          >
            If you run a service business,<br />
            <span className="text-gradient-spectrum">this was built for you.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            style={{ fontSize: '1.1rem', color: 'rgba(240,237,255,0.5)', maxWidth: '500px', margin: '0 auto' }}
          >
            Select your industry to see exactly how Shoulder Monkey works for you.
          </motion.p>
        </div>

        {/* Niche tabs */}
        <div style={{
          display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center',
          marginBottom: '3rem',
        }}>
          {NICHES.map((n) => (
            <motion.button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '0.625rem 1.375rem',
                borderRadius: '100px',
                background: activeId === n.id ? `linear-gradient(135deg, ${n.color}30, ${n.color}18)` : 'rgba(10,6,18,0.6)',
                border: `1px solid ${activeId === n.id ? n.color + '50' : 'rgba(132,75,254,0.12)'}`,
                color: activeId === n.id ? '#ffffff' : 'rgba(240,237,255,0.5)',
                fontWeight: activeId === n.id ? 700 : 500,
                fontSize: '0.875rem',
                display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Active content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `linear-gradient(135deg, ${active.color}06 0%, rgba(10,6,18,0.6) 100%)`,
              border: `1px solid ${active.color}25`,
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top line */}
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px', background: `linear-gradient(90deg, transparent, ${active.color}50, transparent)` }} />

            {/* Left: copy */}
            <div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{active.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 800, color: '#ffffff',
                lineHeight: 1.2, letterSpacing: '-0.02em',
                marginBottom: '1.25rem',
              }}>
                {active.headline}
              </h3>
              <p style={{ fontSize: '1rem', color: 'rgba(240,237,255,0.55)', lineHeight: 1.75, marginBottom: '2rem' }}>
                {active.body}
              </p>

              <a href="#trial" className="btn-primary" style={{ display: 'inline-flex' }}>
                Start Free Trial — {active.label}
              </a>
            </div>

            {/* Right: pain → win */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Pain points */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ff0199', marginBottom: '0.875rem' }}>
                  Sound familiar?
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {active.painPoints.map((p) => (
                    <div key={p} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#ff0199', fontSize: '0.875rem', lineHeight: '1.5', flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.5)', lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wins */}
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00ebc1', marginBottom: '0.875rem' }}>
                  With Shoulder Monkey
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {active.wins.map((w) => (
                    <div key={w} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#00ebc1', fontSize: '0.875rem', lineHeight: '1.5', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.7)', lineHeight: 1.5 }}>{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
