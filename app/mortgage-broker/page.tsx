'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Activity { text: string; sub: string; color: string }
interface Review { name: string; initials: string; text: string; loan: string; time: string; bg: string }

const LIVE_ACTIVITY: Activity[] = [
  { text: 'New lead → Marcus B.', sub: 'Refinance enquiry · auto-replied in 2 min · call booked', color: '#6366f1' },
  { text: 'Pre-approval issued → Sarah W.', sub: '$780K · auto-docs sent · CRM updated', color: '#10b981' },
  { text: '5-star review → James K.', sub: '"Saved us $340/month. Couldn\'t recommend more." ⭐⭐⭐⭐⭐', color: '#f59e0b' },
  { text: 'Settlement follow-up → Chen family', sub: '6-month check-in sent · refinance opportunity flagged', color: '#6366f1' },
  { text: 'Referral received → Ray White Mosman', sub: 'Agent sent 2 buyers · auto-intro sent to both', color: '#10b981' },
  { text: '$1.2M loan settled → David & Amy R.', sub: 'Commission confirmed · thank you gift dispatched', color: '#6366f1' },
  { text: 'Rate alert triggered → Tom H.', sub: 'Better rate found · refinance offer sent automatically', color: '#f59e0b' },
  { text: 'Lead nurtured → Linda S.', sub: 'In market 3 months · re-engaged via sequence · booked', color: '#10b981' },
]

const REVIEWS: Review[] = [
  { name: 'James K.', initials: 'JK', bg: '#4f46e5', loan: 'Home Purchase · $850K', time: '3 days ago', text: "We saved $340/month on our repayments and the whole process was completely seamless. Atlas kept us updated at every single step. Best decision we made." },
  { name: 'Sarah W.', initials: 'SW', bg: '#047857', loan: 'Refinance · $640K', time: '1 week ago', text: "I enquired online at 9pm on a Sunday. I had a response within 2 minutes and a call booked by the next morning. Settled within 3 weeks. Absolutely outstanding." },
  { name: 'Chen Family', initials: 'CF', bg: '#b45309', loan: 'Investment Property · $1.1M', time: '2 weeks ago', text: "Second time using Atlas for a property purchase. They remembered everything about our situation and found us a rate 0.4% lower than our bank offered. This team is exceptional." },
  { name: 'Amanda T.', initials: 'AT', bg: '#be123c', loan: 'First Home · $680K', time: '3 weeks ago', text: "As a first home buyer, I was terrified of the whole process. Atlas made it feel simple. They explained everything, chased everything, and we got the keys last week. Amazing." },
  { name: 'David & Amy R.', initials: 'DR', bg: '#0e7490', loan: 'Family Home · $1.2M', time: '1 month ago', text: "Our bank said no. Atlas found us approval within the week. The automated updates meant we always knew exactly where our application was. Truly exceptional service." },
  { name: 'Tom H.', initials: 'TH', bg: '#7c3aed', loan: 'Refinance · $520K', time: '1 month ago', text: "They actually contacted ME to tell me I could save money by refinancing. I wasn't even looking. Saved $280/month. Who does that? Atlas does. Incredible." },
]

const LEAD_JOURNEY = [
  { time: 'Sun 9:47pm', label: 'Refinance enquiry submitted', icon: '📥', message: `Hi Marcus! Thanks for reaching out to Atlas Finance 🏡\n\nRefinancing is a great idea — rates have moved a lot. I'd love to chat through your options.\n\nHere are some times for a quick call:\n\n📅 Mon 9am · Tue 11am · Wed 2pm\n\nOr pick a time that suits you: [Book now]` },
  { time: 'Sun 9:49pm', label: '2 min later (auto)', icon: '⚡', message: `Hi Marcus! Your call with Liam at Atlas Finance is confirmed:\n\n📅 Monday 21 Apr at 9:00am\n📞 Liam will call you on 0412 xxx xxx\n\nIn the meantime, here's what to have ready:\n✓ Latest payslips (2)\n✓ Current mortgage statement\n✓ Recent bank statements (3 months)` },
  { time: 'Mon 8:30am', label: 'Morning of call reminder', icon: '⏰', message: `Morning Marcus! Your call with Liam is in 30 minutes ☎️\n\nHe'll call you on your mobile at 9am sharp. Feel free to reply if anything's changed!` },
  { time: 'Mon 10:15am', label: 'Post-call follow-up', icon: '📋', message: `Hi Marcus! Great speaking with you today 👋\n\nAs discussed, I'm looking at options across 12 lenders for your situation. You'll have a comparison by EOD Wednesday.\n\nIn the meantime, here's your secure document upload link:\n→ Upload docs [secure link]` },
  { time: 'Wed 4:30pm', label: 'Loan comparison delivered', icon: '📊', message: `Marcus, your refinance comparison is ready! 🎉\n\nBest option found: 5.89% (vs your current 6.44%)\nMonthly saving: $312/month\nAnnual saving: $3,744\n\n→ View full comparison [link]\n\nReady to proceed? Reply YES and I'll start the application today.` },
  { time: '6 months later', label: 'Rate monitoring alert', icon: '🔔', message: `Hi Marcus! Liam here from Atlas 👋\n\nGood news — rates have dropped again and I've found an option that could save you an extra $180/month on top of what you're already saving.\n\nWant me to run the numbers? Just reply YES!` },
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

export default function MortgageBrokerPage() {
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
    const timers = [1300, 2700, 4100].map((ms) =>
      setTimeout(() => setReviewsVisible(v => Math.min(v + 1, REVIEWS.length)), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [reviewInView])

  return (
    <div style={{ cursor: 'auto' }} className="min-h-screen">
      <style>{`.broker * { cursor: auto !important; } .broker a, .broker button { cursor: pointer !important; }`}</style>
      <div className="broker">

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#6366f1] flex items-center justify-center">
                <span className="text-white text-xs font-bold">AF</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">Atlas Finance</div>
                <div className="text-white/40 text-xs">Mortgage Brokers · Sydney</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
              <a href="#" className="hover:text-white transition-colors">Services</a>
              <a href="#" className="hover:text-white transition-colors">Our Team</a>
              <a href="#" className="hover:text-white transition-colors">Calculators</a>
            </div>
            <button className="bg-[#6366f1] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#4f46e5] transition-colors">
              Get Started →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0f172a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b]/50 via-[#0f172a] to-[#0f172a]" />
          <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full bg-[#6366f1]/8 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#10b981]/5 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full py-20">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] animate-pulse" />
                <span className="text-[#a5b4fc] text-xs font-semibold tracking-wide">Award-winning brokers · Sydney CBD</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-syne)' }}>
                Get a better<br />
                <span className="text-[#6366f1]">mortgage</span><br />
                in days, not months.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="text-white/50 text-lg leading-relaxed mb-8 max-w-md">
                We compare 60+ lenders to find you the sharpest rate. Home loans, refinancing, and investment property — handled end to end.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-10">
                <button className="bg-[#6366f1] text-white font-semibold px-8 py-4 rounded-xl text-sm hover:bg-[#4f46e5] transition-all hover:scale-105">
                  Get a free assessment →
                </button>
                <button className="border border-white/10 text-white font-medium px-8 py-4 rounded-xl text-sm hover:bg-white/5 transition-colors">
                  See our rates
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap gap-6">
                {[
                  { icon: '⭐', stat: '4.9', label: '389 reviews' },
                  { icon: '🏦', stat: '60+', label: 'lenders compared' },
                  { icon: '💰', stat: '$2.4B+', label: 'loans settled' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-white">{item.stat}</span>
                    <span className="text-white/40 text-sm">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Savings calculator mockup */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
              <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-6">Your potential savings</div>
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Your current rate (bank)</span>
                      <span className="text-white font-semibold">6.44%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full">
                      <div className="h-full w-full bg-red-500/50 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50">Best rate we found</span>
                      <span className="text-[#10b981] font-bold">5.89%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                        className="h-full bg-[#10b981] rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-5 mb-4">
                  <div className="text-white/40 text-xs mb-1">Monthly saving</div>
                  <div className="text-3xl font-bold text-[#10b981]" style={{ fontFamily: 'var(--font-syne)' }}>$312/mo</div>
                  <div className="text-white/30 text-xs mt-1">$3,744/year · $112,320 over 30 years</div>
                </div>
                <button className="w-full bg-[#6366f1] text-white font-semibold py-3.5 rounded-xl text-sm hover:bg-[#4f46e5] transition-colors">
                  Find my rate →
                </button>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.5 }}
                className="mt-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-4 flex items-center gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="text-[#10b981] text-xs font-semibold">Sarah just received her comparison</div>
                  <div className="text-white/30 text-xs">Refinance · $640K · saving $298/month vs her bank</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Ticker */}
        <div className="overflow-hidden bg-[#6366f1] py-3">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap">
            {[1,2,3,4].map(i => (
              <span key={i} className="text-white text-sm font-semibold tracking-widest uppercase mr-8">
                $2.4B+ loans settled  ·  389 five-star reviews  ·  2-min response time  ·  60+ lenders compared  ·  avg saving $312/month  ·  0 leads left uncontacted  ·
              </span>
            ))}
          </motion.div>
        </div>

        {/* Metrics */}
        <section className="bg-[#0f172a] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">April 2025</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>Atlas Finance this month</h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Loans Settled', value: 14, prefix: '', suffix: '', change: '$18.4M total' },
                { label: 'New Enquiries', value: 84, prefix: '', suffix: '', change: '+31 vs last month' },
                { label: 'Enquiry→Settlement', value: 61, prefix: '', suffix: '%', change: 'industry avg 32%' },
                { label: 'Avg Response Time', value: 2, prefix: '', suffix: ' min', change: '24/7 automated' },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-[#1e293b] rounded-2xl p-6 border border-white/5">
                    <div className="text-white/30 text-xs font-medium uppercase tracking-wide mb-3">{s.label}</div>
                    <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                      <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                    </div>
                    <span className="text-xs font-semibold text-[#6366f1] bg-[#6366f1]/10 px-2 py-0.5 rounded-full">{s.change}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Lead Journey */}
        <section className="bg-[#0a0f1e] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Client Journey</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
                  From enquiry to settled, without the lag
                </h2>
                <p className="text-white/40 max-w-lg mx-auto">Every lead gets an instant response, every client gets proactive updates, and every settled client gets a 6-month follow-up.</p>
              </div>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-0">
                {LEAD_JOURNEY.map((step, i) => (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-lg bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center text-base shrink-0">
                          {step.icon}
                        </div>
                        {i < LEAD_JOURNEY.length - 1 && <div className="w-px flex-1 bg-[#6366f1]/15 my-1 min-h-[40px]" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white/50 text-xs font-bold">{step.time}</span>
                          <span className="bg-[#6366f1]/10 text-[#a5b4fc] text-xs px-2.5 py-0.5 rounded-full font-medium">{step.label}</span>
                        </div>
                        <div className="bg-[#1e293b] border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                          <div className="text-white/60 text-xs leading-relaxed whitespace-pre-line">{step.message}</div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <div className="lg:sticky lg:top-24 space-y-4">
                <Reveal delay={0.2}>
                  <div className="bg-[#1e293b] border border-white/5 rounded-2xl p-6">
                    <div className="text-[#6366f1] text-xs font-semibold tracking-widest uppercase mb-4">Pipeline Performance</div>
                    <div className="space-y-4">
                      {[
                        { label: 'Leads responded to within 5 min', value: '100%' },
                        { label: 'Enquiry to assessment rate', value: '78%' },
                        { label: 'Assessment to approval', value: '81%' },
                        { label: 'Approval to settlement', value: '94%' },
                        { label: 'Post-settlement referrals', value: '3.2/client' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <span className="text-white/40 text-sm">{item.label}</span>
                          <span className="text-[#6366f1] font-bold text-sm">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="bg-[#6366f1] rounded-2xl p-6 text-white">
                    <div className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">Revenue from rate monitoring alerts</div>
                    <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>$84K</div>
                    <div className="text-white/70 text-sm">in commissions from proactive refinance outreach last year</div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section ref={reviewRef} className="bg-[#0f172a] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <div className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-3">Client Reviews</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-syne)' }}>389 happy clients</h2>
                <div className="flex items-center justify-center gap-3">
                  <Stars />
                  <span className="font-bold text-white">4.9</span>
                  <span className="text-white/30 text-sm">· 389 Google reviews</span>
                </div>
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {REVIEWS.slice(0, reviewsVisible).map((r) => (
                  <motion.div key={r.name} layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-[#1e293b] rounded-2xl p-6 border border-white/5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: r.bg }}>
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">{r.name}</div>
                          <div className="text-white/30 text-xs">{r.loan}</div>
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
                    <p className="text-white/50 text-sm leading-relaxed mt-3">&ldquo;{r.text}&rdquo;</p>
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
                <div className="w-2 h-2 rounded-full bg-[#6366f1] animate-pulse" />
                <div className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase">Live Activity</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-syne)' }}>The pipeline, working itself</h2>
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#6b35f5]/8 blur-3xl" />
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#6366f1]/5 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-[#6b35f5]/10 border border-[#6b35f5]/30 rounded-full px-5 py-2 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6b35f5]" />
                <span className="text-[#a673ff] text-xs font-semibold tracking-widest uppercase">The system behind Atlas Finance</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#f0edff]/40 text-lg mb-4">Atlas doesn&apos;t let leads go cold.</p>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
                <span className="text-[#f0edff]">It runs on</span>{' '}
                <span style={{ background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 50%, #00ebc1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Shoulder Monkey.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#f0edff]/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
                Instant lead response. Automated application updates. Rate monitoring alerts. Post-settlement nurture. Every touchpoint, handled — so your brokers focus on deals, not admin.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 text-left">
                {[
                  { icon: '⚡', label: '2-min lead response', desc: 'Every enquiry acknowledged 24/7 — weekends included' },
                  { icon: '🔄', label: 'Lead nurture sequences', desc: 'Months-long nurture for leads not ready to buy yet' },
                  { icon: '🔔', label: 'Rate monitoring alerts', desc: 'Proactive refinance outreach when better rates appear' },
                  { icon: '📋', label: 'Application updates', desc: 'Clients always know where their loan is — automatically' },
                  { icon: '⭐', label: 'Review generation', desc: 'Sent after settlement, conversion rates 3× higher' },
                  { icon: '👥', label: 'Referral campaigns', desc: 'Systematic agent and client referral sequences' },
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
                  Ready to build this for your brokerage?
                </div>
                <p className="text-[#f0edff]/50 mb-8 max-w-lg mx-auto">
                  Full setup in 7 days. Works with your CRM. Every lead followed up — even the ones you forgot about.
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
