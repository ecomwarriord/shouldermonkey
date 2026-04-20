'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Activity { text: string; sub: string; color: string }
interface Review { name: string; initials: string; text: string; plan: string; time: string; bg: string }

const LIVE_ACTIVITY: Activity[] = [
  { text: 'Trial booked → Jess W.', sub: 'Instagram DM → auto-replied → booked in 4 min', color: '#22c55e' },
  { text: 'Membership renewed → Tom H.', sub: '$89/mo · card on file · auto-receipt sent', color: '#3b82f6' },
  { text: 'No-show follow-up → Ryan K.', sub: '"We missed you — rebook your session" sent', color: '#f59e0b' },
  { text: 'New lead → Marcus B.', sub: 'Google search → form → SMS reply in 90 seconds', color: '#22c55e' },
  { text: '5-star review → Priya M.', sub: '"The progress tracking is next level" ⭐⭐⭐⭐⭐', color: '#f59e0b' },
  { text: 'Lapsed member re-engaged → Sam T.', sub: 'Hadn\'t visited in 3 weeks · win-back offer accepted', color: '#3b82f6' },
  { text: '$189 collected → Chloe R.', sub: '3-month program · payment plan · auto-scheduled', color: '#22c55e' },
  { text: 'PT session booked → Daniel L.', sub: 'Automated availability check → confirmed instantly', color: '#3b82f6' },
]

const REVIEWS: Review[] = [
  { name: 'Tom H.', initials: 'TH', bg: '#1d4ed8', plan: 'Elite Membership', time: '1 day ago', text: "I've tried 4 gyms in Bondi. Apex is the only one where I actually feel like they know who I am. The check-ins and progress updates are a game changer." },
  { name: 'Priya M.', initials: 'PM', bg: '#059669', plan: 'PT + Membership', time: '3 days ago', text: "My PT sessions are tracked, my meals are logged, my progress is monitored — and I get a weekly summary SMS. No other gym does this. It's like having a coach 24/7." },
  { name: 'Sam T.', initials: 'ST', bg: '#7c3aed', plan: 'Foundation Plan', time: '1 week ago', text: "Missed a week due to work and they texted me to check in. Not in a pushy sales way — genuinely checking in. That kind of care is rare. I'm a member for life." },
  { name: 'Jess W.', initials: 'JW', bg: '#b45309', plan: 'Elite Membership', time: '2 weeks ago', text: "From my first DM to walking through the door took less than 10 minutes. Everything was instant. This is what fitness should feel like in 2025." },
  { name: 'Ryan K.', initials: 'RK', bg: '#0e7490', plan: 'Group Classes', time: '2 weeks ago', text: "The app sends me class reminders, my trainer sends me check-ins, and I get a motivation message every Monday morning. I haven't missed a session in 6 weeks." },
  { name: 'Chloe R.', initials: 'CR', bg: '#be123c', plan: '3-Month Program', time: '3 weeks ago', text: "Signed up for the 3-month transformation and the automated progress tracking alone is worth the price. I can see exactly where I'm heading. Down 8kg in 10 weeks." },
]

const SEQUENCE = [
  { time: 'Mon 6:32pm', label: 'Lead submits form', icon: '📥', message: `Hi Jess! 👋 Thanks for your interest in Apex Performance.\n\nWe'd love to show you around. When works best for a free tour?\n\n→ Book your visit [link]\n\nOr reply with a time and we'll lock it in!` },
  { time: 'Mon 6:33pm', label: '90 seconds later (auto)', icon: '⚡', message: `Hey Jess! Quick one — your free tour at Apex is confirmed:\n\n📅 Tomorrow, Tue 22 Apr at 10am\n📍 Shop 2, Hall St, Bondi Beach\n\nBring your gym gear — we'll get you started on the gym floor 💪` },
  { time: 'Tue 8:00am', label: 'Morning of tour', icon: '🗺️', message: `Morning Jess! See you at 10am today 🙌\n\n📍 Shop 2, Hall St, Bondi Beach\n🚗 Parking on Campbell Pde\n\nAsk for Jake at reception — he'll take great care of you!` },
  { time: 'Tue 1:30pm', label: '3 hours after tour', icon: '💬', message: `Hi Jess! So great meeting you today 💪\n\nIf you're ready to get started, here's your sign-up link — 7 day free trial, no lock-in:\n\n→ Start your trial [link]\n\nAny questions? Just reply here!` },
  { time: 'Wed 9:00am', label: 'If no signup yet', icon: '🔁', message: `Hey Jess! Jake here from Apex 👋\n\nJust wanted to check in — did you get a chance to look at the trial?\n\nWe're running a special this week: first month half price if you start before Friday.\n\n→ Claim offer [link]` },
  { time: 'Fri 10:00am', label: 'Last chance offer', icon: '⏰', message: `Hi Jess — last reminder about the half-price first month at Apex 🏋️\n\nOffer closes tonight at midnight.\n\n→ Grab it now [link]\n\nEither way, it was great meeting you. Hope to see you on the floor!` },
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

function Stars({ color = '#f59e0b' }: { color?: string }) {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={color}>
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function GymPage() {
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
    }, 2000)
    return () => clearInterval(interval)
  }, [liveInView])

  useEffect(() => {
    if (!reviewInView) return
    const timers = [1400, 2800, 4200].map((ms, i) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ cursor: 'auto' }} className="min-h-screen bg-[#0a0a0a]">
      <style>{`.gym * { cursor: auto !important; } .gym a, .gym button { cursor: pointer !important; }`}</style>
      <div className="gym">

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#22c55e] flex items-center justify-center">
                <span className="text-black text-xs font-black">AP</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm tracking-wider">APEX</div>
                <div className="text-white/40 text-xs">Performance Gym · Bondi</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Training</a>
              <a href="#" className="hover:text-white transition-colors">Coaches</a>
              <a href="#" className="hover:text-white transition-colors">Memberships</a>
            </div>
            <button className="bg-[#22c55e] text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#16a34a] transition-colors">
              Free Trial →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0a0a0a] to-[#0a0a12]" />
          <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#22c55e]/5 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full py-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[#22c55e] text-xs font-semibold tracking-wide">Now accepting members · Bondi Beach, Sydney</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="text-6xl md:text-7xl font-black text-white leading-[1.0] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-syne)' }}>
                APEX<br />
                <span className="text-[#22c55e]">Performance</span><br />
                Gym
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-white/50 text-lg leading-relaxed mb-8 max-w-md">
                Bondi&apos;s most results-driven gym. Personal training, group classes, and a system that actually keeps you accountable.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10">
                <button className="bg-[#22c55e] text-black font-black px-8 py-4 rounded-lg text-sm hover:bg-[#16a34a] transition-all duration-300 hover:scale-105">
                  Start Free Trial
                </button>
                <button className="border border-white/10 text-white font-medium px-8 py-4 rounded-lg text-sm hover:bg-white/5 transition-colors">
                  View Memberships
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap gap-6">
                {[
                  { icon: '⭐', stat: '4.9', label: '612 Google reviews' },
                  { icon: '💪', stat: '340+', label: 'active members' },
                  { icon: '🏆', stat: '8', label: 'certified coaches' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-white">{item.stat}</span>
                    <span className="text-white/40 text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Stats card */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
                <div className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-4">Member Dashboard · Live</div>
                {[
                  { label: 'Sessions this week', value: '847', unit: 'total across all members', bar: 85 },
                  { label: 'New member trials', value: '24', unit: 'this month · 71% converted', bar: 71 },
                  { label: 'Avg member retention', value: '11.4', unit: 'months', bar: 95 },
                  { label: 'Revenue this month', value: '$31,200', unit: 'recurring memberships', bar: 78 },
                ].map((stat, i) => (
                  <div key={i} className="mb-5 last:mb-0">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-white/50 text-xs">{stat.label}</span>
                      <span className="text-[#22c55e] font-bold text-sm">{stat.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.bar}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                        className="h-full bg-[#22c55e] rounded-full"
                      />
                    </div>
                    <div className="text-white/25 text-xs mt-1">{stat.unit}</div>
                  </div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.4 }}
                className="mt-3 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-[#22c55e] text-xs font-semibold">New lead just replied</div>
                  <div className="text-white/40 text-xs">Marcus B. — auto-replied in 90 seconds, tour booked</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden bg-[#22c55e] py-3">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-black text-sm font-black tracking-widest uppercase mr-8">
                340+ active members  ·  71% trial-to-member rate  ·  $31,200 MRR  ·  11.4mo avg retention  ·  0 leads left uncontacted  ·
              </span>
            ))}
          </motion.div>
        </div>

        {/* Metrics */}
        <section className="bg-[#0f0f0f] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#22c55e] text-sm font-semibold tracking-widest uppercase mb-3">April 2025</div>
                <h2 className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: 'var(--font-syne)' }}>Apex this month</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Monthly Revenue', value: 31200, prefix: '$', change: '+22%' },
                { label: 'Active Members', value: 340, prefix: '', suffix: '', change: '+41 this month' },
                { label: 'Trial Conversion', value: 71, prefix: '', suffix: '%', change: 'industry avg 45%' },
                { label: 'Avg Retention', value: 11, prefix: '', suffix: '.4mo', change: 'industry avg 4.2mo' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
                    <div className="text-white/30 text-xs font-medium uppercase tracking-wide mb-3">{s.label}</div>
                    <div className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                      <Counter to={s.value} prefix={s.prefix} suffix={s.suffix || ''} />
                    </div>
                    <span className="text-xs font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full">{s.change}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Lead sequence */}
        <section className="bg-[#0a0a0a] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#22c55e] text-sm font-semibold tracking-widest uppercase mb-3">Lead Conversion</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                  From enquiry to member, automatically
                </h2>
                <p className="text-white/40 max-w-lg mx-auto">Every lead gets a personal response in under 2 minutes — no matter when they enquire.</p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-0">
                {SEQUENCE.map((step, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-base shrink-0">
                          {step.icon}
                        </div>
                        {i < SEQUENCE.length - 1 && <div className="w-px flex-1 bg-[#22c55e]/15 my-1 min-h-[40px]" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white/60 text-xs font-bold">{step.time}</span>
                          <span className="bg-[#22c55e]/10 text-[#22c55e] text-xs px-2.5 py-0.5 rounded-full font-medium">{step.label}</span>
                        </div>
                        <div className="bg-[#111] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                          <div className="text-white/60 text-xs leading-relaxed whitespace-pre-line">{step.message}</div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="lg:sticky lg:top-24 space-y-4">
                <Reveal delay={0.2}>
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                    <div className="text-[#22c55e] text-xs font-semibold tracking-widest uppercase mb-4">Conversion Results</div>
                    <div className="space-y-4">
                      {[
                        { label: 'Avg response time', value: '90 sec' },
                        { label: 'Trial bookings from leads', value: '68%' },
                        { label: 'Trial-to-member rate', value: '71%' },
                        { label: 'Revenue per lead', value: '$214' },
                        { label: 'Staff time on follow-up', value: '0 hours' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <span className="text-white/40 text-sm">{item.label}</span>
                          <span className="text-[#22c55e] font-bold text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="bg-[#22c55e] rounded-2xl p-6 text-black">
                    <div className="text-black/60 text-xs font-bold tracking-widest uppercase mb-2">Members added this month</div>
                    <div className="text-5xl font-black mb-1" style={{ fontFamily: 'var(--font-syne)' }}><Counter to={41} /></div>
                    <div className="text-black/70 text-sm">from automated lead sequences alone</div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section ref={reviewRef} className="bg-[#0f0f0f] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#22c55e] text-sm font-semibold tracking-widest uppercase mb-3">Social Proof</div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>612 reasons to join</h2>
                <div className="flex items-center justify-center gap-3">
                  <Stars />
                  <span className="font-bold text-white">4.9</span>
                  <span className="text-white/30 text-sm">· 612 Google reviews · growing daily</span>
                </div>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {REVIEWS.slice(0, reviewsVisible).map((r) => (
                  <motion.div key={r.name} layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#111] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: r.bg }}>
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{r.name}</div>
                          <div className="text-white/30 text-xs">{r.plan}</div>
                        </div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <Stars />
                    <p className="text-white/60 text-sm leading-relaxed mt-3">&ldquo;{r.text}&rdquo;</p>
                    <div className="text-white/20 text-xs mt-3">{r.time}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Live feed */}
        <section ref={liveRef} className="bg-[#0a0a0a] py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <div className="text-[#22c55e] text-sm font-semibold tracking-widest uppercase">Live Activity</div>
              </div>
              <h2 className="text-2xl font-black text-white mb-8" style={{ fontFamily: 'var(--font-syne)' }}>Running in the background, right now</h2>
            </Reveal>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {liveItems.map((item, i) => (
                  <motion.div key={`${item.text}-${i}`} layout
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#111] border border-white/5 rounded-xl px-5 py-4 flex items-center justify-between">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#6b35f5]/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#22c55e]/5 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#6b35f5]/10 border border-[#6b35f5]/30 rounded-full px-5 py-2 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6b35f5]" />
                <span className="text-[#a673ff] text-xs font-semibold tracking-widest uppercase">The system behind Apex</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#f0edff]/40 text-lg mb-4">Apex doesn&apos;t run on hustle.</p>
              <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
                <span className="text-[#f0edff]">It runs on</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 50%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Shoulder Monkey.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#f0edff]/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
                Every lead followed up. Every member retained. Every review generated. Every payment collected. All automatic — so your team focuses on coaching, not admin.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 text-left">
                {[
                  { icon: '⚡', label: '90-second lead response', desc: 'Every enquiry answered instantly, day or night' },
                  { icon: '🔄', label: 'Trial-to-member sequences', desc: 'Automated nurture from first visit to signed member' },
                  { icon: '💰', label: 'Recurring billing', desc: 'Cards on file, auto-retry, zero chasing payments' },
                  { icon: '⭐', label: 'Review generation', desc: 'Sent at the perfect moment after every session' },
                  { icon: '📊', label: 'Member health tracking', desc: 'Attendance, churn risk, revenue — all in real time' },
                  { icon: '🔁', label: 'Win-back campaigns', desc: 'Lapsed members re-engaged automatically' },
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
                  Ready to build this for your gym?
                </div>
                <p className="text-[#f0edff]/50 mb-8 max-w-lg mx-auto">
                  We handle the entire setup in 7 days. You keep focusing on your members.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center gap-2 bg-[#6b35f5] hover:bg-[#844bfe] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6b35f5]/30">
                    Book a free strategy call →
                  </a>
                  <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center gap-2 border border-[#6b35f5]/40 text-[#a673ff] font-medium px-8 py-4 rounded-full hover:bg-[#6b35f5]/10 transition-colors">
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
