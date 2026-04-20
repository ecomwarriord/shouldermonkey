'use client'

import { motion, useInView, animate, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// ─── Types ──────────────────────────────────────────────────────────────────

interface SMS { time: string; label: string; message: string; icon: string }
interface Review { name: string; initials: string; text: string; service: string; time: string; bg: string }
interface Activity { text: string; sub: string; color: string }

// ─── Data ───────────────────────────────────────────────────────────────────

const SMS_SEQUENCE: SMS[] = [
  {
    time: 'Mon 3:47pm', label: 'Instantly on booking', icon: '✅',
    message: `Hi Sarah! 🎉 Your appointment is confirmed:\n\n📅 Wed 23 Apr at 2:00pm\n✂️ Balayage + Blow Dry with Emma\n📍 Shop 4, Knox St, Double Bay\n\nNeed to reschedule? Reply CHANGE 💛`,
  },
  {
    time: 'Tue 2:00pm', label: '24 hours before', icon: '⏰',
    message: `Hey Sarah! Just a reminder 👋\n\nYou have an appointment tomorrow at 2pm with Emma at The Loft.\n\nNeed to move it? Reply CHANGE or call us on (02) 9xxx xxxx`,
  },
  {
    time: 'Wed 12:00pm', label: '2 hours before', icon: '📍',
    message: `See you in 2 hours, Sarah! 🎨\n\n📍 Shop 4, Knox St, Double Bay\n🚗 Free parking on Guilfoyle Ave\n\nWe can't wait to see you!`,
  },
  {
    time: 'Wed 6:30pm', label: '2 hours after visit', icon: '⭐',
    message: `Hi Sarah! Hope you're loving your new look ✨\n\nIf you have 30 seconds, a Google review would mean the world to us 🙏\n\n→ Leave a review [link]`,
  },
  {
    time: 'Sat 9:00am', label: '3 days later', icon: '💕',
    message: `Hey Sarah! It was so lovely having you in 💕\n\nWhen you're ready for your next visit, we recommend a toner refresh in about 6 weeks.\n\n→ Book now [link]`,
  },
  {
    time: '4 Jun · 9am', label: '6 weeks later', icon: '🔮',
    message: `Sarah, your hair is probably craving some love by now 😄\n\nWe have spots this Tuesday & Thursday. Ready to lock it in?\n\n→ Book now [link]`,
  },
]

const REVIEWS: Review[] = [
  { name: 'Rachel M.', initials: 'RM', bg: '#c9917a', service: 'Balayage + Blow Dry', time: '2 hours ago', text: "Emma is an absolute artist. My balayage has never looked so natural. And the reminder texts are such a lovely touch — I never forget my appointments anymore!" },
  { name: 'Priya K.', initials: 'PK', bg: '#d4a04a', service: 'Colour + Cut', time: 'Yesterday', text: "Walked in stressed, walked out feeling like a completely different person. The team at The Loft are genuinely magic. Already booked my next one." },
  { name: 'Sophie T.', initials: 'ST', bg: '#9a7a6e', service: 'Keratin Treatment', time: '3 days ago', text: "I've been coming here 3 years and they just keep getting better. I never even have to remember to rebook — they send me a text at exactly the right time." },
  { name: 'Jess O.', initials: 'JO', bg: '#b8896a', service: 'Full Highlights', time: '1 week ago', text: "Best salon in Double Bay, hands down. Tash always knows what I need before I even explain it. And the post-visit follow-up message made me feel so looked after." },
  { name: 'Mia R.', initials: 'MR', bg: '#c4956a', service: 'Brazilian Blowout', time: '2 weeks ago', text: "The whole experience — from booking online to the little check-in message after — is just flawless. I recommend The Loft to every single person I know." },
  { name: 'Lauren B.', initials: 'LB', bg: '#a07860', service: 'Toner Refresh', time: '2 weeks ago', text: "My hair has genuinely never been healthier. And the messages they send make me feel like a VIP client every single time. This is what a salon should be." },
]

const LIVE_ACTIVITY: Activity[] = [
  { text: 'Reminder sent → Sarah M.', sub: 'Wed 2pm appointment confirmed', color: '#c9917a' },
  { text: 'Review received → Rachel M.', sub: '5 stars · "Never looked so natural" ⭐⭐⭐⭐⭐', color: '#d4a04a' },
  { text: 'Rebooking booked → Priya K.', sub: 'Locked in for Thursday 15 May at 11am', color: '#00ebc1' },
  { text: '$340 collected → Chloe B.', sub: 'Balayage package · card on file', color: '#6b35f5' },
  { text: 'New lead replied → Jamie (Instagram)', sub: 'Automated response sent · appointment booked', color: '#00ebc1' },
  { text: 'Win-back sent → Marcus T.', sub: 'Hadn\'t visited in 9 weeks · offer sent', color: '#c9917a' },
  { text: 'Review received → Sophie T.', sub: '5 stars · "Just keeps getting better" ⭐⭐⭐⭐⭐', color: '#d4a04a' },
  { text: '$178 collected → Lauren B.', sub: 'Toner refresh · auto-receipt sent', color: '#6b35f5' },
]

// ─── Micro components ────────────────────────────────────────────────────────

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
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#d4a04a">
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

function SMStars() {
  return (
    <div className="flex gap-0.5">
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#00ebc1">
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function SalonNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf7f2]/90 backdrop-blur-sm border-b border-[#c9917a]/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#c9917a] flex items-center justify-center">
            <span className="text-white text-xs font-bold">TL</span>
          </div>
          <div>
            <div className="font-semibold text-[#2d1b14] text-sm leading-tight tracking-wide">The Loft</div>
            <div className="text-[#9a7a6e] text-xs">Salon & Spa</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#6b4d40]">
          <a href="#" className="hover:text-[#c9917a] transition-colors">Services</a>
          <a href="#" className="hover:text-[#c9917a] transition-colors">Our Team</a>
          <a href="#" className="hover:text-[#c9917a] transition-colors">Gallery</a>
          <a href="#" className="hover:text-[#c9917a] transition-colors">Contact</a>
        </div>
        <button className="bg-[#2d1b14] text-[#faf7f2] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#c9917a] transition-colors">
          Book Now
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#faf7f2] pt-16">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#c9917a]/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-[#d4a04a]/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#c9917a]/5 blur-2xl" />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-[#c9917a]/15 border border-[#c9917a]/30 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9917a] animate-pulse" />
            <span className="text-[#c9917a] text-xs font-medium tracking-wide">Open today · 9am – 7pm · Double Bay, Sydney</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-7xl font-bold text-[#2d1b14] leading-[1.05] tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            The Loft<br />
            <span className="text-[#c9917a]">Salon</span> &amp; Spa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#6b4d40] text-lg leading-relaxed mb-8 max-w-md"
          >
            Where every visit feels like your first. Premium hair, skin, and nail services in the heart of Double Bay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button className="bg-[#2d1b14] text-[#faf7f2] font-semibold px-8 py-4 rounded-full text-sm hover:bg-[#c9917a] transition-all duration-300 hover:scale-105">
              Book an Appointment
            </button>
            <button className="border border-[#c9917a]/40 text-[#2d1b14] font-medium px-8 py-4 rounded-full text-sm hover:bg-[#c9917a]/10 transition-colors">
              View Services
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: '⭐', stat: '4.9', label: '847 Google reviews' },
              { icon: '👥', stat: '500+', label: 'regular clients' },
              { icon: '✂️', stat: '6', label: 'master stylists' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <span className="font-bold text-[#2d1b14]">{item.stat}</span>
                  <span className="text-[#9a7a6e] text-sm ml-1">{item.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — booking card mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Main booking widget */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-[#c9917a]/15 p-8 border border-[#c9917a]/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-semibold text-[#2d1b14]">Book Your Visit</div>
                <div className="text-[#9a7a6e] text-sm">Available this week</div>
              </div>
              <div className="bg-[#c9917a]/10 text-[#c9917a] text-xs font-medium px-3 py-1 rounded-full">3 spots left</div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { day: 'Tuesday 22 Apr', time: '11:00am', stylist: 'Emma', avail: true },
                { day: 'Wednesday 23 Apr', time: '2:00pm', stylist: 'Tash', avail: true },
                { day: 'Thursday 24 Apr', time: '9:30am', stylist: 'Emma', avail: true },
                { day: 'Friday 25 Apr', time: '4:00pm', stylist: 'Jade', avail: false },
              ].map((slot, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${slot.avail ? 'border-[#c9917a]/20 hover:border-[#c9917a] hover:bg-[#c9917a]/5' : 'border-gray-100 opacity-40'}`}>
                  <div>
                    <div className="text-sm font-medium text-[#2d1b14]">{slot.day}</div>
                    <div className="text-xs text-[#9a7a6e]">{slot.time} · with {slot.stylist}</div>
                  </div>
                  {slot.avail
                    ? <div className="w-5 h-5 rounded-full border-2 border-[#c9917a]/40" />
                    : <div className="text-xs text-gray-400">Taken</div>
                  }
                </div>
              ))}
            </div>
            <button className="w-full bg-[#2d1b14] text-[#faf7f2] font-semibold py-3.5 rounded-xl text-sm hover:bg-[#c9917a] transition-colors">
              Confirm Appointment
            </button>
          </div>

          {/* Floating notification */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute -bottom-4 -left-6 bg-[#2d1b14] rounded-2xl p-4 shadow-xl max-w-[220px]"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">📱</div>
              <div>
                <div className="text-[#faf7f2] text-xs font-semibold mb-0.5">Confirmation sent!</div>
                <div className="text-[#9a7a6e] text-xs leading-relaxed">Sarah M. just booked and got her confirmation SMS in 3 seconds</div>
              </div>
            </div>
          </motion.div>

          {/* Reviews badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl border border-[#c9917a]/10"
          >
            <div className="flex items-center gap-2">
              <Stars />
              <span className="text-[#2d1b14] text-sm font-bold">4.9</span>
            </div>
            <div className="text-[#9a7a6e] text-xs mt-0.5">847 reviews</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Ticker() {
  const items = '47 appointments this week  ·  3 new 5-star reviews today  ·  $8,400 collected  ·  94% rebooking rate  ·  12 automated messages sent  ·  0 missed follow-ups  ·  '
  return (
    <div className="overflow-hidden bg-[#2d1b14] py-3 relative">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[1, 2, 3, 4].map(i => (
          <span key={i} className="text-[#c9917a] text-sm font-medium tracking-widest uppercase mr-8">
            {items}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function Metrics() {
  const stats = [
    { label: 'Monthly Revenue', value: 47230, prefix: '$', suffix: '', change: '+18%', note: 'vs last month' },
    { label: 'New Clients', value: 127, prefix: '', suffix: '', change: '+23%', note: 'this month' },
    { label: 'Rebooking Rate', value: 94, prefix: '', suffix: '%', change: '+6pts', note: 'vs 6 months ago' },
    { label: 'Average Ticket', value: 178, prefix: '$', suffix: '', change: '+$24', note: 'vs last quarter' },
  ]

  return (
    <section className="bg-[#faf7f2] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="text-[#c9917a] text-sm font-semibold tracking-widest uppercase mb-3">April 2025</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d1b14]" style={{ fontFamily: 'var(--font-syne)' }}>
              The Loft this month
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-6 border border-[#c9917a]/10 shadow-sm">
                <div className="text-[#9a7a6e] text-xs font-medium uppercase tracking-wide mb-3">{s.label}</div>
                <div className="text-3xl font-bold text-[#2d1b14] mb-2" style={{ fontFamily: 'var(--font-syne)' }}>
                  <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
                  <span className="text-xs text-[#9a7a6e]">{s.note}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AutomationFlow() {
  return (
    <section className="bg-[#f5f0ea] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-4">
            <div className="text-[#c9917a] text-sm font-semibold tracking-widest uppercase mb-3">Client Journey</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d1b14] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              Every client, perfectly looked after
            </h2>
            <p className="text-[#6b4d40] max-w-lg mx-auto">
              From the moment someone books, to six weeks later when it&apos;s time to come back — everything runs automatically.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-start">
          {/* Timeline */}
          <div className="space-y-0">
            {SMS_SEQUENCE.map((sms, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-[#2d1b14] flex items-center justify-center text-base shrink-0 shadow-md">
                      {sms.icon}
                    </div>
                    {i < SMS_SEQUENCE.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-[#c9917a]/40 to-[#c9917a]/10 my-1 min-h-[40px]" />
                    )}
                  </div>
                  {/* Message */}
                  <div className="pb-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#2d1b14] text-xs font-bold tracking-wide">{sms.time}</span>
                      <span className="bg-[#c9917a]/15 text-[#c9917a] text-xs px-2.5 py-0.5 rounded-full font-medium">{sms.label}</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-[#c9917a]/10 max-w-xs">
                      <div className="text-xs text-[#6b4d40] leading-relaxed whitespace-pre-line">{sms.message}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Stats sidebar */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <Reveal delay={0.2}>
              <div className="bg-[#2d1b14] rounded-2xl p-6 text-[#faf7f2]">
                <div className="text-[#c9917a] text-xs font-semibold tracking-widest uppercase mb-4">This Sequence</div>
                <div className="space-y-4">
                  {[
                    { label: 'Messages sent automatically', value: '6 per client' },
                    { label: 'No-shows reduced by', value: '67%' },
                    { label: 'Review generation rate', value: '38%' },
                    { label: 'Rebooking conversion', value: '52%' },
                    { label: 'Revenue recovered (lapsed clients)', value: '$3,200/mo' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#c9917a]/10 pb-3 last:border-0 last:pb-0">
                      <span className="text-[#9a7a6e] text-sm">{item.label}</span>
                      <span className="text-[#c9917a] font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="bg-white rounded-2xl p-6 border border-[#c9917a]/10 shadow-sm">
                <div className="text-[#9a7a6e] text-xs font-semibold tracking-widest uppercase mb-3">Staff time saved</div>
                <div className="text-4xl font-bold text-[#2d1b14] mb-1" style={{ fontFamily: 'var(--font-syne)' }}>
                  <Counter to={23} suffix="h" />
                </div>
                <div className="text-[#9a7a6e] text-sm">per week, on follow-ups alone</div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-[#c9917a] rounded-2xl p-6 text-white">
                <div className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-3">Clients never lost</div>
                <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-syne)' }}>
                  <Counter to={94} suffix="%" />
                </div>
                <div className="text-white/80 text-sm">return within 3 months</div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const [visible, setVisible] = useState(3)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const timers = REVIEWS.slice(3).map((_, i) =>
      setTimeout(() => setVisible(v => v + 1), (i + 1) * 1200)
    )
    return () => timers.forEach(clearTimeout)
  }, [inView])

  return (
    <section className="bg-[#faf7f2] py-20 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="text-[#c9917a] text-sm font-semibold tracking-widest uppercase mb-3">Reputation</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d1b14] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              Reviews that write themselves
            </h2>
            <div className="flex items-center justify-center gap-3">
              <Stars />
              <span className="font-bold text-[#2d1b14]">4.9</span>
              <span className="text-[#9a7a6e] text-sm">·  847 Google reviews  ·  new ones arriving daily</span>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {REVIEWS.slice(0, visible).map((r, i) => (
              <motion.div
                key={r.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl p-6 border border-[#c9917a]/10 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: r.bg }}
                    >
                      {r.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-[#2d1b14] text-sm">{r.name}</div>
                      <div className="text-[#9a7a6e] text-xs">{r.service}</div>
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
                <p className="text-[#4a3428] text-sm leading-relaxed mt-3">&ldquo;{r.text}&rdquo;</p>
                <div className="text-[#b0907a] text-xs mt-3">{r.time}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Calendar() {
  const days = ['Mon 21', 'Tue 22', 'Wed 23', 'Thu 24', 'Fri 25', 'Sat 26']
  const stylists = ['Emma', 'Tash', 'Jade', 'Marcus', 'Lily', 'Chloe']
  const slots = [
    [true, true, true, true, false, true],
    [true, false, true, true, true, true],
    [true, true, true, false, true, true],
    [false, true, true, true, true, true],
    [true, true, false, true, true, false],
    [true, true, true, true, true, true],
  ]

  return (
    <section className="bg-[#f0ebe3] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <div className="text-[#c9917a] text-sm font-semibold tracking-widest uppercase mb-3">This Week</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d1b14] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
              Every chair, filled
            </h2>
            <p className="text-[#6b4d40] max-w-lg mx-auto">
              6 stylists. 6 days. Fully booked. All managed automatically — no phone tag, no double bookings.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#c9917a]/10 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                <div />
                {days.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#9a7a6e] uppercase tracking-wide">{d}</div>
                ))}
              </div>
              {/* Rows */}
              {stylists.map((stylist, si) => (
                <div key={stylist} className="grid grid-cols-7 gap-2 mb-2">
                  <div className="flex items-center text-sm font-medium text-[#2d1b14]">{stylist}</div>
                  {slots[si].map((booked, di) => (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (si * 6 + di) * 0.02, duration: 0.3 }}
                      className={`h-10 rounded-lg flex items-center justify-center text-xs font-medium ${booked
                        ? 'bg-[#2d1b14] text-[#c9917a]'
                        : 'bg-[#c9917a]/10 text-[#c9917a]/40 border border-[#c9917a]/10'}`}
                    >
                      {booked ? '●' : '○'}
                    </motion.div>
                  ))}
                </div>
              ))}
              <div className="mt-4 flex items-center gap-6 text-xs text-[#9a7a6e]">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[#2d1b14]" /> Booked</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border border-[#c9917a]/30" /> Available</div>
                <div className="ml-auto font-medium text-[#2d1b14]">35/36 slots filled this week · 97% capacity</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function LiveFeed() {
  const [items, setItems] = useState<Activity[]>(LIVE_ACTIVITY.slice(0, 3))
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const indexRef = useRef(3)

  useEffect(() => {
    if (!inView) return
    const interval = setInterval(() => {
      const next = LIVE_ACTIVITY[indexRef.current % LIVE_ACTIVITY.length]
      setItems(prev => [next, ...prev].slice(0, 6))
      indexRef.current++
    }, 2200)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <section ref={ref} className="bg-[#0f0a1e] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00ebc1] animate-pulse" />
            <div className="text-[#00ebc1] text-sm font-semibold tracking-widest uppercase">Live Activity</div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#f0edff] mb-4" style={{ fontFamily: 'var(--font-syne)' }}>
            The system, right now
          </h2>
          <p className="text-[#f0edff]/50 mb-10">While the team focuses on clients, the backend runs itself.</p>
        </Reveal>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={`${item.text}-${i}`}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-[#1a1030]/80 border border-[#6b35f5]/20 rounded-2xl px-5 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <div>
                    <div className="text-[#f0edff] text-sm font-medium">{item.text}</div>
                    <div className="text-[#f0edff]/40 text-xs mt-0.5">{item.sub}</div>
                  </div>
                </div>
                <div className="text-[#f0edff]/30 text-xs whitespace-nowrap ml-4">just now</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Reveal2() {
  return (
    <section className="bg-[#030108] py-24 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#6b35f5]/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-[#00ebc1]/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-[#6b35f5]/10 border border-[#6b35f5]/30 rounded-full px-5 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6b35f5]" />
            <span className="text-[#a673ff] text-xs font-semibold tracking-widest uppercase">The system behind The Loft</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[#f0edff]/40 text-lg mb-4">The Loft doesn&apos;t run on hustle.</p>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-syne)' }}>
            <span className="text-[#f0edff]">It runs on</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a673ff 0%, #844bfe 50%, #00ebc1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Shoulder Monkey.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-[#f0edff]/60 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
            Everything you just saw — the automated SMS sequences, the review generation, the full calendar, the live dashboard — is Shoulder Monkey, running silently in the background.
          </p>
        </Reveal>

        {/* Feature grid */}
        <Reveal delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14 text-left">
            {[
              { icon: '📱', label: 'Automated SMS sequences', desc: 'Confirmation → reminder → review → rebook' },
              { icon: '📅', label: 'Online booking system', desc: '24/7 bookings, zero phone calls needed' },
              { icon: '⭐', label: 'Review on autopilot', desc: 'Requests sent at the perfect moment, every time' },
              { icon: '💰', label: 'Payments & invoicing', desc: 'Cards on file, auto-receipts, no chasing' },
              { icon: '🔄', label: 'Rebooking campaigns', desc: 'Win back lapsed clients automatically' },
              { icon: '📊', label: 'Revenue dashboard', desc: 'Every metric, in real time, on your phone' },
            ].map((f, i) => (
              <div key={i} className="bg-[#0f0a1e] border border-[#6b35f5]/20 rounded-2xl p-5 hover:border-[#6b35f5]/50 transition-colors">
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="text-[#f0edff] text-sm font-semibold mb-1">{f.label}</div>
                <div className="text-[#f0edff]/40 text-xs leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.4}>
          <div className="bg-gradient-to-br from-[#1a0a3e] to-[#0a0612] border border-[#6b35f5]/30 rounded-3xl p-10">
            <div className="text-[#f0edff] text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-syne)' }}>
              Ready to build this for your salon?
            </div>
            <p className="text-[#f0edff]/50 mb-8 max-w-lg mx-auto">
              We set everything up for you in 7 days. You focus on your clients. We handle the rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center gap-2 bg-[#6b35f5] hover:bg-[#844bfe] text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#6b35f5]/30">
                Book a free strategy call
                <span>→</span>
              </a>
              <a href="https://www.shouldermonkey.co" className="inline-flex items-center justify-center gap-2 border border-[#6b35f5]/40 text-[#a673ff] font-medium px-8 py-4 rounded-full hover:bg-[#6b35f5]/10 transition-colors">
                See pricing
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <SMStars />
                <span className="text-[#f0edff]/50 text-xs">Trusted by 200+ AU service businesses</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SalonPage() {
  return (
    <div style={{ cursor: 'auto' }} className="min-h-screen">
      <style>{`
        .salon-page * { cursor: auto !important; }
        .salon-page a, .salon-page button { cursor: pointer !important; }
      `}</style>
      <div className="salon-page">
        <SalonNav />
        <Hero />
        <Ticker />
        <Metrics />
        <AutomationFlow />
        <Reviews />
        <Calendar />
        <LiveFeed />
        <Reveal2 />
      </div>
    </div>
  )
}
