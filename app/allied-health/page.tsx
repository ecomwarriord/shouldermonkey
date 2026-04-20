'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Activity { text: string; sub: string; color: string }
interface Review { name: string; initials: string; text: string; service: string; time: string; bg: string }

const LIVE_ACTIVITY: Activity[] = [
  { text: 'New referral → Dr Nguyen', sub: 'Knee rehab · 8-session program · auto-intake sent', color: '#f97316' },
  { text: 'Progress report sent → Michael T.', sub: 'Week 4 update · shared with GP automatically', color: '#10b981' },
  { text: '5-star review → Karen L.', sub: '"Back to running in 6 weeks. Incredible." ⭐⭐⭐⭐⭐', color: '#f59e0b' },
  { text: 'Recall booked → Sandra M.', sub: 'Post-treatment check-in · 3 months overdue · booked', color: '#f97316' },
  { text: '$420 collected → James B.', sub: 'Private health processed · gap payment auto-collected', color: '#10b981' },
  { text: 'Lapsed patient re-engaged → Chris W.', sub: 'No visit in 8 weeks · win-back offer sent · booked', color: '#f97316' },
  { text: 'New patient onboarded → Aisha K.', sub: 'Intake form + health history collected before arrival', color: '#10b981' },
  { text: 'Review received → Peter S.', sub: '"Finally fixed my shoulder after 2 years." ⭐⭐⭐⭐⭐', color: '#f59e0b' },
]

const REVIEWS: Review[] = [
  { name: 'Karen L.', initials: 'KL', bg: '#ea580c', service: 'Sports Physiotherapy', time: '2 days ago', text: "I was told I'd be out of running for 6 months. Restore had me back in 6 weeks. The progress updates they send each week kept me motivated and my GP in the loop." },
  { name: 'Michael T.', initials: 'MT', bg: '#047857', service: 'Post-Surgery Rehab', time: '5 days ago', text: "Best healthcare experience I've ever had. They followed up after every single session, my exercises were sent to my phone, and the communication was just flawless." },
  { name: 'Sandra M.', initials: 'SM', bg: '#7c3aed', service: 'Pilates + Osteo', time: '1 week ago', text: "They reached out 3 months after finishing my program just to check in. I didn't even know I needed another session until they mentioned it. Exactly what healthcare should be." },
  { name: 'James B.', initials: 'JB', bg: '#b45309', service: 'Remedial Massage', time: '2 weeks ago', text: "The private health claiming is seamless — I don't have to do anything. Book, show up, get treated, they handle the rest. I've referred my entire family here." },
  { name: 'Aisha K.', initials: 'AK', bg: '#0e7490', service: 'Exercise Physiology', time: '3 weeks ago', text: "First appointment and they already had my full history from the intake form. My therapist walked in knowing exactly what I needed. That level of preparation is rare." },
  { name: 'Peter S.', initials: 'PS', bg: '#be123c', service: 'Shoulder Rehab', time: '1 month ago', text: "I'd been to 3 different physios for my shoulder in 2 years. None of them followed up. Restore sent me exercises, checked in weekly, and fixed a problem I'd given up on." },
]

const PATIENT_JOURNEY = [
  { time: 'Mon 2:14pm', label: 'GP referral received', icon: '📋', message: `Hi Michael! Restore Allied Health here 👋\n\nDr Chen has referred you for post-surgery knee rehabilitation. We're ready to get you started.\n\nHere are our next available times:\n📅 Tue 22 Apr at 10am with Jake\n📅 Wed 23 Apr at 2pm with Lily\n\nReply with your preference or book here: [link]` },
  { time: 'Mon 2:16pm', label: 'Booking confirmed + intake sent', icon: '✅', message: `Hi Michael! Your initial assessment is confirmed:\n\n📅 Wed 23 Apr at 2:00pm with Jake Morrison\n📍 Suite 3, 88 Pacific Hwy, Crows Nest\n\nPlease complete your health history form before arriving — it only takes 5 minutes and means Jake can start treatment straight away:\n→ Complete intake form [link]` },
  { time: 'Wed 1:00pm', label: '1h before appointment', icon: '📍', message: `Hi Michael! See you in 1 hour 🙌\n\n📍 Suite 3, 88 Pacific Hwy, Crows Nest\n🅿️ Free 2-hour parking on Hume St\n\nRemember to bring: referral letter + any scans if you have them.\n\nJake is looking forward to meeting you!` },
  { time: 'Wed 5:00pm', label: 'Post-session summary', icon: '📊', message: `Hi Michael! Great first session with Jake today 💪\n\nYour personalised exercise program is now in your app:\n→ View exercises [link]\n\nJake has recommended 8 sessions over 6 weeks. Your next appointment is Mon 28 Apr at 2pm.\n\nAny questions? Just reply here!` },
  { time: 'Weekly · Mon 8am', label: 'Weekly progress check-in', icon: '📈', message: `Hi Michael! Week 3 check-in from Jake 👋\n\nHow's the knee tracking this week? Rate your pain (1-10) and reply and we'll adjust your program if needed.\n\nYour GP progress report will be sent automatically at the end of Week 4.` },
  { time: '3 months later', label: 'Post-discharge recall', icon: '🔔', message: `Hi Michael! It's been 3 months since you completed your knee rehab with Jake 🎉\n\nHow's everything feeling? We'd love to do a quick follow-up assessment — it's complimentary and only 20 minutes.\n\n→ Book your check-up [link]` },
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

export default function AlliedHealthPage() {
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
    }, 2100)
    return () => clearInterval(interval)
  }, [liveInView])

  useEffect(() => {
    if (!reviewInView) return
    const timers = [1200, 2500, 3800].map((ms) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ cursor: 'auto' }} className="min-h-screen">
      <style>{`.allied * { cursor: auto !important; } .allied a, .allied button { cursor: pointer !important; }`}</style>
      <div className="allied">

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-50 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f97316] flex items-center justify-center">
                <span className="text-white text-xs font-bold">RA</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">Restore Allied Health</div>
                <div className="text-gray-400 text-xs">Crows Nest, Sydney · Physio & Rehab</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-900 transition-colors">Services</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Our Team</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Referrals</a>
            </div>
            <button className="bg-[#f97316] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#ea580c] transition-colors">
              Book Now
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-[#fff7ed] via-white to-[#f0fdf4]">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-[#f97316]/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#10b981]/8 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full py-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                <span className="text-[#f97316] text-xs font-semibold tracking-wide">Accepting referrals · Crows Nest, Sydney</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-syne)' }}>
                Restore<br />
                <span className="text-[#f97316]">Allied Health</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
                Physiotherapy, osteopathy, remedial massage, and exercise physiology in Crows Nest. Where recovery happens, and doesn&apos;t stop between sessions.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10">
                <button className="bg-[#f97316] text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-[#ea580c] transition-all hover:scale-105">
                  Book an appointment
                </button>
                <button className="border border-gray-200 text-gray-600 font-medium px-8 py-4 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Send a referral
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap gap-6">
                {[
                  { icon: '⭐', stat: '4.9', label: '504 Google reviews' },
                  { icon: '🏥', stat: '5', label: 'allied health services' },
                  { icon: '💪', stat: '320+', label: 'active patients' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-gray-900">{item.stat}</span>
                    <span className="text-gray-400 text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Progress tracker mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="bg-white rounded-2xl shadow-xl shadow-[#f97316]/10 p-8 border border-orange-50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-bold text-gray-900">Michael T. — Recovery Progress</div>
                    <div className="text-gray-400 text-sm">Post-surgery knee rehab · Week 4 of 8</div>
                  </div>
                  <div className="bg-[#10b981]/10 text-[#10b981] text-xs font-semibold px-3 py-1 rounded-full">On track ✓</div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Recovery progress</span>
                    <span className="text-[#f97316] font-bold">52%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '52%' }}
                      transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #f97316, #10b981)' }}
                    />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Pain level', before: '8/10', now: '3/10', trend: '↓ 63%' },
                    { label: 'Range of motion', before: '45°', now: '112°', trend: '↑ 149%' },
                    { label: 'Sessions completed', before: '0', now: '4', trend: '50% done' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <span className="text-gray-500 text-sm">{m.label}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-400">{m.before}</span>
                        <span className="text-gray-300">→</span>
                        <span className="font-bold text-gray-900">{m.now}</span>
                        <span className="text-[#10b981] font-semibold bg-[#10b981]/10 px-2 py-0.5 rounded-full">{m.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#f97316]/5 border border-[#f97316]/10 rounded-xl p-4 text-sm text-gray-600">
                  <span className="font-semibold text-[#f97316]">Jake says: </span>
                  Excellent progress this week Michael. Add 2 sets of the terminal knee extension today. See you Monday! 💪
                </div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.5 }}
                className="mt-3 bg-gray-900 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">📋</div>
                <div>
                  <div className="text-white text-xs font-semibold mb-0.5">Progress report sent to GP</div>
                  <div className="text-gray-400 text-xs">Week 4 update automatically shared with Dr Chen — no admin required</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden bg-[#f97316] py-3">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-white text-sm font-semibold tracking-widest uppercase mr-8">
                320+ active patients  ·  4.9 stars · 504 reviews  ·  $44,800 monthly revenue  ·  89% patient retention  ·  0 referrals missed  ·  weekly GP reports auto-sent  ·
              </span>
            ))}
          </motion.div>
        </div>

        {/* Metrics */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#f97316] text-sm font-semibold tracking-widest uppercase mb-3">April 2025</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne)' }}>Restore Allied Health this month</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Monthly Revenue', value: 44800, prefix: '$', change: '+17% vs last month' },
                { label: 'Active Patients', value: 320, prefix: '', suffix: '', change: '+28 this month' },
                { label: 'Patient Retention', value: 89, prefix: '', suffix: '%', change: 'industry avg 54%' },
                { label: 'GP Referrals', value: 34, prefix: '', suffix: '', change: 'this month' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#fff7ed] rounded-2xl p-6 border border-orange-100">
                    <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-3">{s.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                      <Counter to={s.value} prefix={s.prefix} suffix={s.suffix || ''} />
                    </div>
                    <span className="text-xs font-semibold text-[#f97316] bg-[#f97316]/10 px-2 py-0.5 rounded-full">{s.change}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Patient Journey */}
        <section className="bg-[#fafafa] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#f97316] text-sm font-semibold tracking-widest uppercase mb-3">Patient Journey</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                  Recovery that doesn&apos;t stop between sessions
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto">From GP referral to post-discharge recall — every patient gets the follow-up they deserve, automatically.</p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                {PATIENT_JOURNEY.map((step, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center text-base shrink-0">
                          {step.icon}
                        </div>
                        {i < PATIENT_JOURNEY.length - 1 && <div className="w-px flex-1 bg-[#f97316]/15 my-1 min-h-[40px]" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-gray-500 text-xs font-bold">{step.time}</span>
                          <span className="bg-[#f97316]/10 text-[#f97316] text-xs px-2.5 py-0.5 rounded-full font-medium">{step.label}</span>
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
                    <div className="text-[#f97316] text-xs font-semibold tracking-widest uppercase mb-4">Program Outcomes</div>
                    <div className="space-y-3">
                      {[
                        { label: 'Avg program completion rate', value: '91%' },
                        { label: 'No-show rate (with reminders)', value: '3.8%' },
                        { label: 'GP referrals from existing patients', value: '18%' },
                        { label: 'Post-discharge recall conversion', value: '62%' },
                        { label: 'Hours saved on admin/week', value: '21hrs' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between border-b border-white/10 pb-2.5 last:border-0 last:pb-0">
                          <span className="text-gray-400 text-sm">{item.label}</span>
                          <span className="text-[#f97316] font-bold text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="bg-[#f97316] rounded-2xl p-6 text-white">
                    <div className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">Revenue from recall campaigns</div>
                    <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>$96K</div>
                    <div className="text-white/70 text-sm">in 12 months from patients who otherwise would have been lost</div>
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
                <div className="text-[#f97316] text-sm font-semibold tracking-widest uppercase mb-3">Patient Reviews</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-syne)' }}>504 recoveries, 504 stories</h2>
                <div className="flex items-center justify-center gap-3">
                  <Stars />
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-400 text-sm">· 504 Google reviews</span>
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
                          <div className="text-gray-400 text-xs">{r.service}</div>
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
                <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
                <div className="text-[#f97316] text-sm font-semibold tracking-widest uppercase">Live right now</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-syne)' }}>The practice, running between sessions</h2>
            </Reveal>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {liveItems.map((item, i) => (
                  <motion.div key={`${item.text}-${i}`} layout
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0f0a1e] border border-[#f97316]/15 rounded-xl px-5 py-4 flex items-center justify-between">
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
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#f97316]/5 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#6b35f5]/10 border border-[#6b35f5]/30 rounded-full px-5 py-2 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6b35f5]" />
                <span className="text-[#a673ff] text-xs font-semibold tracking-widest uppercase">The system behind Restore Allied Health</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#f0edff]/40 text-lg mb-4">Restore doesn&apos;t just treat patients.</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
                <span className="text-[#f0edff]">It runs on</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 50%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Shoulder Monkey.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#f0edff]/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
                Every referral captured. Every patient kept on track. Every GP report sent automatically. Every lapsed patient re-engaged. The whole practice, running between sessions.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 text-left">
                {[
                  { icon: '📋', label: 'Referral management', desc: 'GP referrals captured, acknowledged, and booked automatically' },
                  { icon: '📱', label: 'Patient progress tracking', desc: 'Weekly check-ins and exercise delivery via SMS' },
                  { icon: '📊', label: 'Automated GP reports', desc: 'Progress reports sent to referring doctors at key milestones' },
                  { icon: '🔔', label: 'Discharge recalls', desc: '3, 6, and 12-month post-discharge check-in campaigns' },
                  { icon: '💰', label: 'Private health billing', desc: 'Gap payments auto-collected, Medicare processed seamlessly' },
                  { icon: '⭐', label: 'Review generation', desc: 'Sent after milestones — not just at discharge' },
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
                  Ready to build this for your practice?
                </div>
                <p className="text-[#f0edff]/50 mb-8 max-w-lg mx-auto">
                  Full setup in 7 days. Australian Privacy Act compliant. Your practitioners stay clinical — we handle everything else.
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
