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
          if (p < 0.18) setChapter(0)
          else if (p < 0.38) setChapter(1)
          else if (p < 0.58) setChapter(2)
          else if (p < 0.78) setChapter(3)
          else setChapter(4)
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

        {/* ── CINEMATIC ZONE: 600vh ────────────────────────────────────── */}
        <div ref={storyRef} style={{ height: '600vh', position: 'relative' }}>

          {/* Chapters are fixed overlays within this zone */}
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

            {/* ── CHAPTER 0: HERO'S DESIRE ── */}
            <Chapter show={chapter === 0 && canvasReady}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                {/* Co-brand pill */}
                <div
                  className={`label-pill mb-8 ${chapter === 0 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ color: '#FF3366', borderColor: 'rgba(255,51,102,0.3)', background: 'rgba(255,51,102,0.08)', animationDuration: '0.6s' }}
                >
                  RackTheBrain × ShoulderMonkey · Sydney, Australia
                </div>

                {/* Two-tier typography: tiny "AI" label + dominant "UNLOCKED" statement */}
                <div
                  className={chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}
                  style={{ animationDuration: '0.7s', animationDelay: '0.1s', textAlign: 'center' }}
                >
                  {/* "AI" — small label, sets the category */}
                  <span
                    className="font-display font-black"
                    style={{
                      display: 'block',
                      fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)',
                      letterSpacing: '0.5em',
                      color: '#FF3366',
                      marginBottom: '0.15em',
                      paddingLeft: '0.5em', // optical compensation for letter-spacing
                    }}
                  >
                    AI
                  </span>
                  {/* "UNLOCKED" — the commanding statement */}
                  <h1
                    className="font-display font-black"
                    style={{
                      fontSize: 'clamp(3.8rem, 12.5vw, 13rem)',
                      lineHeight: 0.85,
                      letterSpacing: '-0.04em',
                      margin: 0,
                    }}
                  >
                    <span style={{ WebkitTextStroke: '3px #7B3FE4', color: 'transparent' }}>UN</span>
                    <span style={{ color: '#ffffff' }}>LOCKED</span>
                  </h1>
                </div>

                {/* Sub — speaks to the desire, not the product */}
                <p
                  className={`mt-8 font-semibold max-w-lg ${chapter === 0 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.4,
                    animationDuration: '0.8s',
                    animationDelay: '0.35s',
                  }}
                >
                  Stop watching other people build with AI.<br />
                  <span style={{ color: '#ffffff' }}>Start being the one who does.</span>
                </p>

                {/* Direct CTA — one action, clear outcome */}
                <div
                  className={`mt-10 flex flex-col items-center gap-3 ${chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.6s', animationDelay: '0.5s' }}
                >
                  <a
                    href="#waitlist"
                    className="btn-primary"
                    style={{
                      fontSize: '1.15rem',
                      padding: '1.1rem 2.8rem',
                      background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)',
                      letterSpacing: '0.01em',
                    }}
                    onClick={e => { e.preventDefault(); document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' }) }}
                  >
                    Join the Waitlist — It's Free
                  </a>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', textShadow: '0 1px 10px rgba(0,0,0,0.9)', letterSpacing: '0.04em' }}>
                    13 and up · Founding Cohort · 50 seats only
                  </p>
                </div>

                {/* Scroll prompt */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>scroll</span>
                  <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(123,63,228,0.7), transparent)' }} />
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 1: THE VILLAIN (internal emotion first, then proof) ── */}
            <Chapter show={chapter === 1}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                {/* Internal problem — the FOMO they already feel */}
                <p
                  className={`font-display font-semibold mb-6 max-w-2xl ${chapter === 1 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em', animationDuration: '0.6s' }}
                >
                  Right now, someone your age is building an AI product<br />
                  that thousands of people will use.
                </p>

                {/* The external proof — big number creates contrast */}
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

                {/* Philosophical injustice */}
                <p
                  className={`mt-10 ${chapter === 1 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, fontSize: '1.05rem', lineHeight: 1.5, animationDuration: '0.6s', animationDelay: '0.3s' }}
                >
                  It&apos;s not right that the most important skill of your generation<br />
                  isn&apos;t being taught anywhere.
                </p>

                {/* Contrast: what they lose vs what they gain */}
                <div
                  className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl w-full ${chapter === 1 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.4s' }}
                >
                  <div className="rounded-2xl p-7 text-left" style={{ background: 'rgba(255,51,102,0.05)', border: '1.5px solid rgba(255,51,102,0.25)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF3366' }}>Without this</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>Watching others build things you could&apos;ve built — while you figure out where to start.</p>
                  </div>
                  <div className="rounded-2xl p-7 text-left" style={{ background: 'rgba(123,63,228,0.08)', border: '1.5px solid rgba(123,63,228,0.35)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7B3FE4' }}>After 12 weeks</p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>Building with AI before most people your age know how to prompt it.</p>
                  </div>
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 2: THE GUIDE (empathy first, then authority) ── */}
            <Chapter show={chapter === 2}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                {/* Empathy — guide understands the problem */}
                <p
                  className={`max-w-xl mb-8 ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1.05rem', lineHeight: 1.6, animationDuration: '0.6s' }}
                >
                  We know what it&apos;s like to watch AI change everything around you<br />
                  with no clear path in.
                </p>

                {/* Authority — specific and concrete, not boastful */}
                <h2
                  className={`font-display font-black ${chapter === 2 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: 700, lineHeight: 1.05, animationDuration: '0.6s', animationDelay: '0.1s' }}
                >
                  6 products built with AI.<br />
                  <span style={{ color: '#FF3366' }}>Every one still live.</span>
                </h2>

                <p
                  className={`mt-4 ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', animationDuration: '0.6s', animationDelay: '0.2s' }}
                >
                  By Dee, 29, Sydney — your instructor. Not a theory. A track record.
                </p>

                {/* Projects as proof points */}
                <div
                  className={`mt-8 grid grid-cols-3 gap-2 max-w-lg w-full mx-auto ${chapter === 2 ? 'animate__animated animate__fadeInUp' : ''}`}
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

                {/* Second guide — Abhinav's empathy + authority */}
                <p
                  className={`mt-8 ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', animationDuration: '0.6s', animationDelay: '0.35s' }}
                >
                  + Abhinav Verma (RackTheBrain) · 1,000+ students taught · Podcaster · Sydney educator
                </p>
              </div>
            </Chapter>

            {/* ── CHAPTER 3: SUCCESS PICTURE (vivid, specific, aspirational) ── */}
            <Chapter show={chapter === 3}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                {/* Week 6 — the first milestone they can feel */}
                <p
                  className={`label-pill mb-6 ${chapter === 3 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ color: '#FF3366', background: 'rgba(255,51,102,0.08)', borderColor: 'rgba(255,51,102,0.25)', animationDuration: '0.5s' }}
                >
                  By Week 6
                </p>

                <h2
                  className={`font-display font-black ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: 700, lineHeight: 1.1, animationDuration: '0.6s' }}
                >
                  You show your mates something<br />
                  they can&apos;t{' '}
                  <span style={{ color: '#FF3366' }}>build.</span>
                </h2>

                <p
                  className={`mt-6 ${chapter === 3 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.2rem', maxWidth: 520, lineHeight: 1.6, animationDuration: '0.6s', animationDelay: '0.15s' }}
                >
                  A working AI product. Not a school project.<br />
                  Something that <span style={{ color: '#ffffff', fontWeight: 700 }}>actually runs.</span>
                </p>

                {/* Week 12 — the bigger promise */}
                <div
                  className={`mt-12 rounded-2xl p-8 max-w-xl w-full text-left ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ background: 'rgba(123,63,228,0.07)', border: '1px solid rgba(123,63,228,0.2)', animationDuration: '0.5s', animationDelay: '0.25s' }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7B3FE4' }}>By Week 12</p>
                  <p className="font-display font-black" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                    A live AI business. A launch strategy.<br />
                    A path to your first <span style={{ color: '#FF3366' }}>$1,000 online.</span>
                  </p>
                  <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    A real product people pay for. Not dropshipping. Not MLM.<br />
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>Results depend on effort. This is a target, not a guarantee.</span>
                  </p>
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 4: THE CALL TO ACTION ── */}
            <Chapter show={chapter === 4}>
              <div id="waitlist" className="flex flex-col items-center justify-center h-screen text-center px-6">
                {/* Stakes + scarcity — the cost of not acting */}
                <p
                  className={`mb-3 ${chapter === 4 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', letterSpacing: '0.05em', animationDuration: '0.5s' }}
                >
                  Founding Cohort · 50 seats · Most will be gone before tickets launch
                </p>

                {/* Headline — join the movement */}
                <h2
                  className={`font-display font-black mb-8 ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.0, animationDuration: '0.6s', animationDelay: '0.1s' }}
                >
                  50 young Australians<br />
                  are about to build the future.<br />
                  <span style={{ color: '#FF3366' }}>Are you in?</span>
                </h2>

                {/* Form */}
                <div
                  className={`w-full max-w-md rounded-2xl p-8 ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(123,63,228,0.25)', animationDuration: '0.5s', animationDelay: '0.2s' }}
                >
                  {waitlistStep === 'form' && (
                    <WaitlistForm
                      onSuccess={(role) => {
                        setWaitlistRole(role)
                        setWaitlistStep('segment')
                      }}
                    />
                  )}
                  {waitlistStep === 'segment' && (
                    <SegmentationQuestion
                      email={submittedEmail}
                      onComplete={(r) => { setWaitlistRole(r); setWaitlistStep('done') }}
                    />
                  )}
                  {waitlistStep === 'done' && (
                    <ParentHandoff role={waitlistRole} />
                  )}
                </div>

                {/* Transitional CTA for the not-yet-ready */}
                <p className="mt-5 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Free to join · Webinar tickets from $149 AUD · 14-day course guarantee
                </p>
              </div>
            </Chapter>

          </div>
        </div>

        {/* ── AFTER CINEMATIC: Detail sections (normal scroll) ─────────── */}
        {/* Semi-transparent so the fixed 3D canvas shows through */}
        <div style={{ position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.82)' }}>
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

// ── Chapter overlay helper ────────────────────────────────────────────────────
function Chapter({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: show ? 'auto' : 'none',
        zIndex: 10,
      }}
      aria-hidden={!show}
    >
      {children}
    </div>
  )
}
