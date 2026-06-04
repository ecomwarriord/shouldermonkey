'use client'

/**
 * AI Unlocked — Cinematic scroll experience.
 *
 * Architecture:
 *   - NeuralWorldCanvas: fixed fullscreen Three.js scene
 *   - 600vh scroll container creates scroll space
 *   - GSAP ScrollTrigger maps scroll progress → chapter overlays
 *   - Five chapters appear/disappear as overlays over the 3D world
 *   - Tuesday CSS (tdDropInLeft, tdPlop, tdStamp) for text entrances
 *   - After the cinematic: normal page sections for detail/conversion
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { NeuralWorldCanvas } from './NeuralWorldCanvas'
import { WaitlistForm } from './forms/WaitlistForm'
import { SegmentationQuestion } from './forms/SegmentationQuestion'
import { ParentHandoff } from './forms/ParentHandoff'
import { AINav } from './AINav'
import { SkipNav } from './SkipNav'
// ExitIntent removed — not needed

// Post-cinematic detail sections (normal scroll)
import { FAQSection } from './sections/13-FAQSection'
import { AffiliateSection } from './sections/12-AffiliateSection'

type WaitlistStep = 'form' | 'segment' | 'done'

export function AIUnlockedPage() {
  const scrollRef = useRef(0)
  const storyRef = useRef<HTMLDivElement>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const [chapter, setChapter] = useState(0)
  const [chapterOpacities, setChapterOpacities] = useState<number[]>([1, 0, 0, 0, 0])
  const [waitlistStep, setWaitlistStep] = useState<WaitlistStep>('form')
  const [submittedEmail] = useState('')
  const [waitlistRole, setWaitlistRole] = useState('unknown')

  const onCanvasReady = useCallback(() => setCanvasReady(true), [])

  // GSAP: map scroll progress to scroll ref + chapter index
  useEffect(() => {
    if (!storyRef.current) return
    let gsap: any, ScrollTrigger: any

    async function setup() {
      const g = await import('gsap')
      const st = await import('gsap/ScrollTrigger')
      gsap = g.gsap
      ScrollTrigger = st.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      ScrollTrigger.create({
        trigger: storyRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate(self: any) {
          scrollRef.current = self.progress
          const p = self.progress

          // Smooth per-chapter opacity — each chapter has a fade-in zone,
          // a full-on zone, and a fade-out zone. No hard threshold snapping.
          // Layout: [0-0.22] Ch0, [0.12-0.44] Ch1, [0.34-0.66] Ch2, [0.56-0.88] Ch3, [0.78-1.0] Ch4
          const FADE = 0.10 // 10% of scroll = fade duration
          const peaks = [0, 0.22, 0.44, 0.66, 0.88]
          const opacities = peaks.map((peak, i) => {
            const fadeIn = peak - FADE
            const peakEnd = i === 4 ? 1.0 : peaks[i + 1] - FADE
            const fadeOut = i === 4 ? 1.0 : peaks[i + 1]
            if (i === 0 && p < peakEnd) return 1
            if (p < fadeIn) return 0
            if (p < peak) return (p - fadeIn) / FADE
            if (p < peakEnd) return 1
            if (p < fadeOut) return 1 - (p - peakEnd) / FADE
            return 0
          })
          setChapterOpacities(opacities)
          // Active chapter = highest opacity
          const max = Math.max(...opacities)
          setChapter(opacities.indexOf(max))
        },
      })
    }

    setup()
    return () => { ScrollTrigger?.getAll().forEach((t: any) => t.kill()) }
  }, [])

  // GA4 + body data-page attribute (enables cursor fix CSS) + hide GHL chat widget
  useEffect(() => {
    if ((window as any).gtag) (window as any).gtag('event', 'ai_unlocked_page_view')

    // Put data-page on body so CSS cursor rule can match it
    document.body.setAttribute('data-page', 'ai-unlocked')

    // Hide GHL chat widget — poll because it injects dynamically
    const hide = () => {
      document.querySelectorAll<HTMLElement>(
        '[data-widget-id], iframe[src*="leadconnector"], #chat-widget-container, .lc-chat-widget'
      ).forEach(el => { el.style.setProperty('display', 'none', 'important') })
    }
    hide()
    const iv = setInterval(hide, 800)
    setTimeout(() => clearInterval(iv), 12000)

    return () => {
      document.body.removeAttribute('data-page')
      clearInterval(iv)
    }
  }, [])

  return (
    <div data-page="ai-unlocked" style={{ background: '#000' }}>
      <SkipNav />

      {/* Fixed 3D canvas — always behind everything */}
      <NeuralWorldCanvas scrollRef={scrollRef} onReady={onCanvasReady} />

      {/* Radial vignette — text area darkened so headline reads cleanly over network */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 65% 55% at 50% 45%, rgba(0,0,0,0.6) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Fixed nav */}
      <AINav />

      <main id="main-content">

        {/* ── CINEMATIC ZONE: 800vh — more dwell time per chapter ───────── */}
        <div ref={storyRef} style={{ height: '800vh', position: 'relative' }}>

          {/* Chapters are fixed overlays within this zone */}
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

            {/* ── CHAPTER 0: THE EVENT ── */}
            <Chapter opacity={canvasReady ? chapterOpacities[0] : 0}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p
                  className={`mb-5 ${chapter === 0 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
                    textTransform: 'uppercase', color: '#FF3366', animationDuration: '0.5s',
                  }}
                >
                  One night · Live · Online · Sydney, Australia
                </p>

                <div
                  className={chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}
                  style={{ animationDuration: '0.7s', animationDelay: '0.1s', textAlign: 'center' }}
                >
                  <span
                    className="font-display font-black"
                    style={{
                      display: 'block', fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)',
                      letterSpacing: '0.5em', color: '#FF3366', marginBottom: '0.15em',
                      paddingLeft: '0.5em',
                    }}
                  >
                    AI
                  </span>
                  <h1
                    className="font-display font-black"
                    style={{ fontSize: 'clamp(3.8rem, 12.5vw, 13rem)', lineHeight: 0.85, letterSpacing: '-0.04em', margin: 0 }}
                  >
                    <span style={{ WebkitTextStroke: '3px #7B3FE4', color: 'transparent' }}>UN</span>
                    <span style={{ color: '#ffffff' }}>LOCKED</span>
                  </h1>
                </div>

                <p
                  className={`mt-8 font-semibold max-w-lg ${chapter === 0 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.4rem)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, animationDuration: '0.8s', animationDelay: '0.35s' }}
                >
                  A 90-minute live event where you learn to use AI<br />
                  to <span style={{ color: '#ffffff' }}>build real things.</span> Why that matters right now.
                </p>

                <div
                  className={`mt-10 flex flex-col items-center gap-3 ${chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.6s', animationDelay: '0.5s' }}
                >
                  <a
                    href="#waitlist"
                    className="btn-primary"
                    style={{ fontSize: '1.15rem', padding: '1.1rem 2.8rem', background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', letterSpacing: '0.01em' }}
                    onClick={e => { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}
                  >
                    Join the Waitlist. It's Free.
                  </a>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', textShadow: '0 1px 10px rgba(0,0,0,0.9)', letterSpacing: '0.04em' }}>
                    Waitlist is free · Tickets from $149 AUD when they drop · 13 and up
                  </p>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>scroll</span>
                  <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(123,63,228,0.7), transparent)' }} />
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 1: THE PROBLEM + THE WINDOW ── */}
            <Chapter opacity={chapterOpacities[1]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p
                  className={`font-semibold mb-6 max-w-2xl ${chapter === 1 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.4)', animationDuration: '0.6s' }}
                >
                  Right now, someone your age is building an AI product<br />
                  that thousands of people will use.
                </p>

                <div
                  className={`font-display font-black ${chapter === 1 ? 'animate__animated animate__zoomIn' : ''}`}
                  style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', lineHeight: 0.82, letterSpacing: '-0.05em', color: '#FF3366', animationDuration: '0.5s', animationDelay: '0.1s' }}
                  aria-label="95 percent"
                >
                  95<span style={{ fontSize: '0.3em', verticalAlign: 'super', color: 'rgba(255,51,102,0.6)' }}>%</span>
                </div>

                <p
                  className={`mt-4 font-semibold ${chapter === 1 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#ffffff', maxWidth: 600, animationDuration: '0.6s', animationDelay: '0.2s' }}
                >
                  of Australian schools have no AI curriculum
                </p>
                <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>Deloitte AI Education in Australia Report, 2025</p>

                <p
                  className={`mt-10 ${chapter === 1 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 540, fontSize: '1.1rem', lineHeight: 1.6, animationDuration: '0.6s', animationDelay: '0.3s' }}
                >
                  The window to get ahead is open right now.<br />
                  <span style={{ color: '#ffffff' }}>In 90 minutes, you could be on the right side of that gap.</span>
                </p>
              </div>
            </Chapter>

            {/* ── CHAPTER 2: WHAT HAPPENS IN 90 MINUTES (the value stack) ── */}
            <Chapter opacity={chapterOpacities[2]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p
                  className={`mb-3 ${chapter === 2 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', animationDuration: '0.5s' }}
                >
                  What you get from 90 minutes live
                </p>

                <h2
                  className={`font-display font-black ${chapter === 2 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: 680, lineHeight: 1.1, animationDuration: '0.6s', animationDelay: '0.05s' }}
                >
                  You walk in not knowing.<br />
                  <span style={{ color: '#FF3366' }}>You walk out building.</span>
                </h2>

                <div
                  className={`mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left ${chapter === 2 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}
                >
                  {[
                    { label: 'Live AI build', detail: 'Watch a real product get built in front of you. Then do it yourself.' },
                    { label: 'The tool stack', detail: 'ChatGPT, Claude, Canva AI, ElevenLabs. Used live, not explained in slides.' },
                    { label: 'One automation', detail: 'A workflow you leave with that saves 10+ hours a week, built live' },
                    { label: 'Content in 60 minutes', detail: 'A full week of social content created in under an hour' },
                  ].map((item, i) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-5"
                      style={{ background: i % 2 === 0 ? 'rgba(123,63,228,0.07)' : 'rgba(255,51,102,0.05)', border: `1.5px solid ${i % 2 === 0 ? 'rgba(123,63,228,0.28)' : 'rgba(255,51,102,0.22)'}` }}
                    >
                      <p className="font-bold text-sm mb-1" style={{ color: i % 2 === 0 ? '#a673ff' : '#FF3366' }}>{item.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>

                <p
                  className={`mt-8 ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', fontStyle: 'italic', animationDuration: '0.5s', animationDelay: '0.35s' }}
                >
                  And at the end: a special offer for those who want to go further.
                </p>
              </div>
            </Chapter>

            {/* ── CHAPTER 3: THE GUIDE ── */}
            <Chapter opacity={chapterOpacities[3]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p
                  className={`mb-6 max-w-xl ${chapter === 3 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', lineHeight: 1.6, animationDuration: '0.6s' }}
                >
                  Led by someone who doesn&apos;t just teach AI. He builds with it.
                </p>

                <h2
                  className={`font-display font-black ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: 700, lineHeight: 1.05, animationDuration: '0.6s', animationDelay: '0.1s' }}
                >
                  6 live AI products.<br />
                  <span style={{ color: '#FF3366' }}>Every one still running.</span>
                </h2>

                <p
                  className={`mt-3 ${chapter === 3 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', animationDuration: '0.6s', animationDelay: '0.2s' }}
                >
                  Dee · 29 · Sydney · Your instructor for the night
                </p>

                <div
                  className={`mt-8 grid grid-cols-3 gap-2 max-w-lg w-full mx-auto ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.25s' }}
                >
                  {[
                    { name: 'ShoulderMonkey', detail: '200+ users', accent: false },
                    { name: 'Qaneri', detail: 'Live', accent: true },
                    { name: 'Holmes', detail: 'Voice AI', accent: false },
                    { name: 'Donna', detail: 'PWA', accent: false },
                    { name: 'Veridian', detail: 'EdTech', accent: true },
                    { name: 'FORGE', detail: 'Fitness', accent: false },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="rounded-xl px-4 py-4 text-left"
                      style={{
                        background: p.accent ? 'rgba(255,51,102,0.06)' : 'rgba(123,63,228,0.07)',
                        border: `1.5px solid ${p.accent ? 'rgba(255,51,102,0.3)' : 'rgba(123,63,228,0.28)'}`,
                      }}
                    >
                      <p className="font-bold text-sm" style={{ color: '#ffffff' }}>{p.name}</p>
                      <p className="text-xs mt-1" style={{ color: p.accent ? 'rgba(255,51,102,0.7)' : 'rgba(123,63,228,0.8)' }}>{p.detail}</p>
                    </div>
                  ))}
                </div>

                <p
                  className={`mt-6 ${chapter === 3 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', animationDuration: '0.6s', animationDelay: '0.35s' }}
                >
                  + Abhinav Verma (RackTheBrain) · 1,000+ students · Sydney educator
                </p>
              </div>
            </Chapter>

            {/* ── CHAPTER 4: THE INVITE ── (form is below the cinematic zone) */}
            <Chapter opacity={chapterOpacities[4]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p
                  className={`mb-3 ${chapter === 4 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', letterSpacing: '0.05em', animationDuration: '0.5s' }}
                >
                  Waitlist is free · Tickets from $149 AUD · Limited seats · Sydney, online
                </p>

                <h2
                  className={`font-display font-black mb-8 ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.05, animationDuration: '0.6s', animationDelay: '0.1s' }}
                >
                  Join the waitlist.<br />
                  Be first when<br />
                  <span style={{ color: '#FF3366' }}>tickets drop.</span>
                </h2>

                {/* Scroll down to the form — it lives below the cinematic zone */}
                <a
                  className={`btn-primary mt-2 ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  href="#waitlist-form"
                  style={{ background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', fontSize: '1.1rem', padding: '1.1rem 2.8rem', animationDuration: '0.5s', animationDelay: '0.2s' }}
                  onClick={e => { e.preventDefault(); document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  Join the Waitlist. It's Free. →
                </a>
                <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Waitlist is free · Tickets from $149 AUD when they drop
                </p>
              </div>
            </Chapter>

          </div>
        </div>

        {/* ── AFTER CINEMATIC: Detail sections (normal scroll) ─────────── */}
        {/* Semi-transparent so the fixed 3D canvas shows through */}
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.82)' }}>

          {/* ── WAITLIST FORM — real anchor, not inside sticky overlay ── */}
          <section
            id="waitlist-form"
            style={{ padding: '80px 24px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 16 }}>
                Waitlist
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', margin: '0 0 8px',
              }}>
                Be first when tickets drop.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: 32 }}>
                Free to join. Founding pricing locked for waitlist members.
              </p>
              <div
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(123,63,228,0.25)', borderRadius: 20, padding: '32px 28px' }}
              >
                {waitlistStep === 'form' && (
                  <WaitlistForm onSuccess={(role) => { setWaitlistRole(role); setWaitlistStep('segment') }} />
                )}
                {waitlistStep === 'segment' && (
                  <SegmentationQuestion email={submittedEmail} onComplete={(r) => { setWaitlistRole(r); setWaitlistStep('done') }} />
                )}
                {waitlistStep === 'done' && (
                  <ParentHandoff role={waitlistRole} />
                )}
              </div>
            </div>
          </section>

          <AffiliateSection />
          <FAQSection />

          {/* Footer CTA */}
          <section style={{ background: 'transparent', padding: '60px 24px 80px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--font-display, var(--font-syne), sans-serif)',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 28px',
            }}>
              Still here?{' '}
              <span style={{ color: '#FF3366' }}>Join the waitlist.</span>
            </h2>
            <a
              href="#waitlist"
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', fontSize: '1.1rem', padding: '1.1rem 2.8rem', display: 'inline-flex' }}
              onClick={e => { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              Claim Your Spot →
            </a>
          </section>

          {/* Footer */}
          <footer style={{ padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.5)' }}>
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="font-display font-black text-white text-lg tracking-tight">
                  <span style={{ color: '#7B3FE4' }}>AI</span> UNLOCKED
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  RackTheBrain × ShoulderMonkey · Sydney, Australia
                </p>
              </div>
              <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                <a href="https://rackthebrain.com.au" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RackTheBrain</a>
                <a href="https://shouldermonkey.co" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ShoulderMonkey</a>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                © 2026 AI Unlocked. All rights reserved.
              </p>
            </div>
          </footer>
        </div>

      </main>

{/* ExitIntent removed */}
    </div>
  )
}

// ── Chapter overlay helper — smooth opacity, no CSS transition needed ─────────
function Chapter({ opacity, children }: { opacity: number; children: React.ReactNode }) {
  const o = Math.max(0, Math.min(1, opacity))
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: o,
        transform: `translateY(${(1 - o) * 16}px)`,
        transition: 'none',
        pointerEvents: o > 0.3 ? 'auto' : 'none',
        zIndex: o > 0.5 ? 11 : 10,
      }}
      aria-hidden={o < 0.1}
    >
      {children}
    </div>
  )
}
