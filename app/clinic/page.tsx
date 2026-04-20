'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Activity { text: string; sub: string; color: string }
interface Review { name: string; initials: string; text: string; treatment: string; time: string; bg: string }

const LIVE_ACTIVITY: Activity[] = [
  { text: 'Appointment confirmed → Sarah L.', sub: 'Initial consult · Thu 24 Apr at 9am · SMS sent', color: '#0ea5e9' },
  { text: 'Recall sent → James T.', sub: 'Due for 6-month check-up · appointment booked', color: '#10b981' },
  { text: '5-star review → Michelle K.', sub: '"Finally a clinic that actually follows up" ⭐⭐⭐⭐⭐', color: '#f59e0b' },
  { text: 'New patient → David R.', sub: 'Google search → form → consult booked in 6 minutes', color: '#0ea5e9' },
  { text: 'Referral received → Physio Network', sub: 'Dr Chen referred 2 new patients this week', color: '#10b981' },
  { text: '$580 collected → Aisha M.', sub: 'Treatment package · card on file · receipt sent', color: '#0ea5e9' },
  { text: 'No-show recovered → Ben S.', sub: 'Missed appointment → rebooked via SMS', color: '#f59e0b' },
  { text: 'Recall booked → Linda W.', sub: 'Overdue 3 months → automated sequence → booked', color: '#10b981' },
]

const REVIEWS: Review[] = [
  { name: 'Sarah L.', initials: 'SL', bg: '#0369a1', treatment: 'Initial Consultation', time: '2 days ago', text: "Finally a clinic that doesn't make you feel like a number. The reminders, the follow-up call, the check-in text after my first visit — it's the little things that make all the difference." },
  { name: 'James T.', initials: 'JT', bg: '#047857', treatment: 'Ongoing Treatment', time: '4 days ago', text: "I'd been putting off my check-up for months. They sent me a recall message at exactly the right time, made it easy to book, and I was seen within a week. Wish I'd gone sooner." },
  { name: 'Michelle K.', initials: 'MK', bg: '#7c3aed', treatment: 'Treatment Package', time: '1 week ago', text: "The care here is genuinely exceptional. What sets them apart is how organised everything is — I never have to chase them, they always follow up. That's rare in healthcare." },
  { name: 'David R.', initials: 'DR', bg: '#b45309', treatment: 'New Patient', time: '2 weeks ago', text: "Found them on Google at 10pm, filled in the form, got a text by 10:03pm. Booked in for the next morning. I've never had that experience at any healthcare clinic before." },
  { name: 'Aisha M.', initials: 'AM', bg: '#be123c', treatment: 'Treatment Package', time: '2 weeks ago', text: "I'm a busy mum and I forget everything. The automated reminders have literally saved me missing appointments three times now. And the results speak for themselves." },
  { name: 'Linda W.', initials: 'LW', bg: '#0e7490', treatment: 'Recall Visit', time: '3 weeks ago', text: "They reached out to let me know I was overdue for my annual check-up. I didn't even realise. Booked straight away. The fact that they track that and proactively reach out is outstanding." },
]

const PATIENT_JOURNEY = [
  { time: 'Sun 10:03pm', label: 'Online enquiry (after hours)', icon: '🌙', message: `Hi David! Thanks for reaching out to Pinnacle Health Clinic 🏥\n\nWe'd love to get you booked in. Here are our next available appointments:\n\n📅 Mon 21 Apr at 9:30am\n📅 Tue 22 Apr at 2:00pm\n📅 Wed 23 Apr at 11am\n\nReply with your preferred time and we'll confirm straight away!` },
  { time: 'Mon 9:30am', label: 'Booking confirmed', icon: '✅', message: `Hi David! Your appointment at Pinnacle Health is confirmed:\n\n📅 Wed 23 Apr at 11:00am\n👨‍⚕️ Dr Emma Chen — Initial Consultation\n📍 Level 2, 45 Miller St, North Sydney\n\nPlease bring any referrals or previous scans 📋` },
  { time: 'Tue 11:00am', label: '24h reminder', icon: '⏰', message: `Hi David! Reminder for tomorrow 👋\n\nYou have an appointment with Dr Chen at Pinnacle Health at 11am.\n\nNeed to reschedule? Reply CHANGE or call (02) 9xxx xxxx` },
  { time: 'Wed 12:30pm', label: '90 min after appointment', icon: '💬', message: `Hi David! Thanks for coming in today 🙏\n\nDr Chen has sent your treatment notes to your email.\n\nWhen you have a moment, a Google review would mean a lot to our small team:\n→ Leave a review [link]` },
  { time: 'Wed 6:00pm', label: '6h after — care plan', icon: '📋', message: `Hi David! Quick follow-up from today's consult 👋\n\nDr Chen has recommended a follow-up in 4 weeks. Ready to book?\n\n→ Book your next appointment [link]\n\nAny questions about your treatment plan? Just reply here.` },
  { time: 'Apr 2026 · 9am', label: '12 months — annual recall', icon: '🔔', message: `Hi David! It's been about a year since your last visit to Pinnacle Health 🏥\n\nDr Chen recommends an annual check-up. We have spots available next week:\n\n→ Book your recall [link]\n\nStay on top of your health — it only takes 20 minutes!` },
]

function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, to, { duration: 2.4, ease: 'easeOut', onUpdate: v => setVal(Math.floor(v)) })
    return ctrl.stop
  }, [inView, to])
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#f59e0b">
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function ClinicPage() {
  const [liveItems, setLiveItems] = useState<Activity[]>(LIVE_ACTIVITY.slice(0, 3))
  const [reviewsVisible, setReviewsVisible] = useState(3)
  const liveRef = useRef(null)
  const reviewRef = useRef(null)
  const liveInView = useInView(liveRef, { once: true })
  const reviewInView = useInView(reviewRef, { once: true })
  const liveIndex = useRef(3)

  useEffect(() => {
    if (!liveInView) return
    const interval = setInterval(() => {
      setLiveItems(prev => [LIVE_ACTIVITY[liveIndex.current % LIVE_ACTIVITY.length], ...prev].slice(0, 6))
      liveIndex.current++
    }, 2200)
    return () => clearInterval(interval)
  }, [liveInView])

  useEffect(() => {
    if (!reviewInView) return
    const timers = [1200, 2600, 4000].map((ms) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ cursor: 'auto' }} className="min-h-screen bg-white">
      <style>{`.clinic * { cursor: auto !important; } .clinic a, .clinic button { cursor: pointer !important; }`}</style>
      <div className="clinic">

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
                <span className="text-white text-xs font-bold">PH</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Pinnacle Health Clinic</div>
                <div className="text-gray-400 text-xs">North Sydney · Allied Health</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Services</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Our Team</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Referrals</a>
            </div>
            <button className="bg-[#0ea5e9] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#0284c7] transition-colors">
              Book Appointment
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-white to-[#f0fdf4]">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#0ea5e9]/8 blur-3xl" />
          <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-[#10b981]/8 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full py-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />
                <span className="text-[#0ea5e9] text-xs font-semibold tracking-wide">Accepting new patients · North Sydney</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-syne)' }}>
                Pinnacle<br />
                <span className="text-[#0ea5e9]">Health</span> Clinic
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Comprehensive allied health care in North Sydney. Physio, chiro, remedial massage, and clinical pilates — all under one roof.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10">
                <button className="bg-[#0ea5e9] text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-[#0284c7] transition-all hover:scale-105">
                  Book an Appointment
                </button>
                <button className="border border-gray-200 text-gray-600 font-medium px-8 py-4 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  View Services
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap gap-6">
                {[
                  { icon: '⭐', stat: '4.9', label: '431 Google reviews' },
                  { icon: '🏥', stat: '6', label: 'allied health disciplines' },
                  { icon: '👥', stat: '280+', label: 'active patients' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-gray-900">{item.stat}</span>
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Booking widget */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="bg-white rounded-2xl shadow-xl shadow-[#0ea5e9]/10 p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-bold text-gray-900">Book Online</div>
                    <div className="text-gray-400 text-sm">Instant confirmation, no waiting</div>
                  </div>
                  <div className="bg-[#10b981]/10 text-[#10b981] text-xs font-semibold px-3 py-1 rounded-full">Next avail: Today</div>
                </div>
                <div className="space-y-2 mb-6">
                  {[
                    { service: 'Initial Consultation', provider: 'Dr Emma Chen', time: 'Today · 2:30pm', avail: true },
                    { service: 'Physiotherapy', provider: 'Jake Morrison', time: 'Tomorrow · 9:00am', avail: true },
                    { service: 'Remedial Massage', provider: 'Lily Park', time: 'Tomorrow · 11:30am', avail: true },
                    { service: 'Clinical Pilates', provider: 'Group session', time: 'Wed · 6:00pm', avail: false },
                  ].map((slot, i) => (
                    <div key={i} className={`p-4 rounded-xl border transition-all cursor-pointer ${slot.avail ? 'border-gray-100 hover:border-[#0ea5e9] hover:bg-[#f0f9ff]' : 'border-gray-50 opacity-40'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{slot.service}</div>
                          <div className="text-xs text-gray-400">{slot.provider} · {slot.time}</div>
                        </div>
                        {slot.avail ? <div className="w-4 h-4 rounded-full border-2 border-[#0ea5e9]/30 mt-0.5" /> : <div className="text-xs text-gray-300">Full</div>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-[#0ea5e9] text-white font-semibold py-3.5 rounded-xl text-sm hover:bg-[#0284c7] transition-colors">
                  Confirm Booking
                </button>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.3 }}
                className="mt-3 bg-gray-900 rounded-xl p-4 flex items-start gap-3 shadow-lg">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="text-white text-xs font-semibold mb-0.5">Confirmation sent instantly</div>
                  <div className="text-gray-400 text-xs">David R. just booked and got his SMS confirmation in under 10 seconds</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden bg-[#0ea5e9] py-3">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-white text-sm font-semibold tracking-widest uppercase mr-8">
                280+ active patients  ·  4.9 Google rating  ·  $52,400 monthly revenue  ·  92% rebooking rate  ·  0 uncontacted leads  ·  12-month recall rate 78%  ·
              </span>
            ))}
          </motion.div>
        </div>

        {/* Metrics */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#0ea5e9] text-sm font-semibold tracking-widest uppercase mb-3">April 2025</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>Pinnacle Health this month</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Monthly Revenue', value: 52400, prefix: '$', change: '+19%' },
                { label: 'Active Patients', value: 280, prefix: '', suffix: '', change: '+34 this month' },
                { label: 'Rebooking Rate', value: 92, prefix: '', suffix: '%', change: 'industry avg 58%' },
                { label: '12-Month Recall Rate', value: 78, prefix: '', suffix: '%', change: '+31pts vs before' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100">
                    <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">{s.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                      <Counter to={s.value} prefix={s.prefix} suffix={s.suffix || ''} />
                    </div>
                    <span className="text-xs font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full">{s.change}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Patient Journey */}
        <section className="bg-[#f8fafc] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#0ea5e9] text-sm font-semibold tracking-widest uppercase mb-3">Patient Journey</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                  Every patient, never lost
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto">From first enquiry to annual recall — every touchpoint handled automatically so no patient falls through the cracks.</p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-0">
                {PATIENT_JOURNEY.map((step, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 flex items-center justify-center text-base shrink-0">
                          {step.icon}
                        </div>
                        {i < PATIENT_JOURNEY.length - 1 && <div className="w-px flex-1 bg-[#0ea5e9]/15 my-1 min-h-[40px]" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-500 text-xs font-bold">{step.time}</span>
                          <span className="bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs px-2.5 py-0.5 rounded-full font-medium">{step.label}</span>
                        </div>
                        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
                          <div className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{step.message}</div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="lg:sticky lg:top-24 space-y-4">
                <Reveal delay={0.2}>
                  <div className="bg-gray-900 rounded-2xl p-6 text-white">
                    <div className="text-[#0ea5e9] text-xs font-semibold tracking-widest uppercase mb-4">Revenue recovered via recalls</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Patients recalled this month', value: '47' },
                        { label: 'Recall conversion rate', value: '78%' },
                        { label: 'Revenue from recalls', value: '$9,800' },
                        { label: 'No-show rate (with reminders)', value: '4.2%' },
                        { label: 'Staff time on admin', value: '↓ 18hrs/wk' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                          <span className="text-gray-400 text-sm">{item.label}</span>
                          <span className="text-[#0ea5e9] font-bold text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="bg-[#0ea5e9] rounded-2xl p-6 text-white">
                    <div className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">Annual revenue from recalls alone</div>
                    <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>$117,600</div>
                    <div className="text-white/70 text-sm">patients who would have been lost without automated recall</div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section ref={reviewRef} className="bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#0ea5e9] text-sm font-semibold tracking-widest uppercase mb-3">Patient Reviews</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>431 patients can't be wrong</h2>
                <div className="flex items-center justify-center gap-3">
                  <Stars />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-400 text-sm">· 431 Google reviews</span>
                </div>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {REVIEWS.slice(0, reviewsVisible).map((r) => (
                  <motion.div key={r.name} layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: r.bg }}>
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                          <div className="text-gray-400 text-xs">{r.treatment}</div>
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <Stars />
                    <p className="text-gray-600 text-sm leading-relaxed mt-3">&ldquo;{r.text}&rdquo;</p>
                    <div className="text-gray-300 text-xs mt-3">{r.time}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Live feed */}
        <section ref={liveRef} className="bg-[#030108] py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
                <div className="text-[#0ea5e9] text-sm font-semibold tracking-widest uppercase">Live right now</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-syne)' }}>The clinic running itself</h2>
            </Reveal>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {liveItems.map((item, i) => (
                  <motion.div key={`${item.text}-${i}`} layout
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0f0a1e] border border-[#0ea5e9]/20 rounded-xl px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                      <div>
                        <div className="text-white text-sm font-medium">{item.text}</div>
                        <div className="text-white/30 text-xs mt-0.5">{item.sub}</div>
                      </div>
                    </div>
                    <div className="text-white/20 text-xs ml-4 whitespace-nowrap">just now</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* SM Reveal */}
        <section className="bg-[#030108] py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#6b35f5]/8 blur-3xl" />
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#0ea5e9]/5 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#6b35f5]/10 border border-[#6b35f5]/30 rounded-full px-5 py-2 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6b35f5]" />
                <span className="text-[#a673ff] text-xs font-semibold tracking-widest uppercase">The system behind Pinnacle Health</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#f0edff]/40 text-lg mb-4">Pinnacle Health doesn&apos;t chase patients.</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
                <span className="text-[#f0edff]">It runs on</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 50%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Shoulder Monkey.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#f0edff]/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
                Every patient recalled. Every appointment confirmed. Every review requested. Every no-show followed up. Done automatically — so your practitioners focus on patients, not paperwork.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 text-left">
                {[
                  { icon: '🔔', label: 'Automated patient recalls', desc: '3, 6, and 12-month recall campaigns that actually convert' },
                  { icon: '📱', label: 'After-hours enquiries', desc: 'Every lead replied to within 90 seconds, 24/7' },
                  { icon: '📋', label: 'Appointment reminders', desc: 'Reduce no-shows by 67% with automated SMS sequences' },
                  { icon: '⭐', label: 'Review on autopilot', desc: 'Sent at the perfect moment — not too soon, not too late' },
                  { icon: '💰', label: 'Billing & invoicing', desc: 'Cards on file, Medicare integration, zero manual work' },
                  { icon: '📊', label: 'Patient health dashboard', desc: 'See at-risk patients before they churn' },
                ].map((f, i) => (
                  <div key={i} className="bg-[#0f0a1e] border border-[#6b35f5]/20 rounded-2xl p-5 hover:border-[#6b35f5]/50 transition-colors">
                    <div className="text-2xl mb-3">{f.icon}</div>
                    <div className="text-[#f0edff] text-sm font-semibold mb-1">{f.label}</div>
                    <div className="text-[#f0edff]/40 text-xs leading-relaxed">{f.desc}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="bg-gradient-to-br from-[#1a0a3e] to-[#0a0612] border border-[#6b35f5]/30 rounded-3xl p-10">
                <div className="text-[#f0edff] text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
                  Ready to build this for your clinic?
                </div>
                <p className="text-[#f0edff]/50 mb-8 max-w-lg mx-auto">
                  Full setup in 7 days. HIPAA-aligned, Australian Privacy Act compliant. Your practitioners stay focused on patients.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center gap-2 bg-[#6b35f5] hover:bg-[#844bfe] text-white font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#6b35f5]/30">
                    Book a free strategy call →
                  </a>
                  <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center border border-[#6b35f5]/40 text-[#a673ff] font-medium px-8 py-4 rounded-full hover:bg-[#6b35f5]/10 transition-colors">
                    See pricing
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  )
}
