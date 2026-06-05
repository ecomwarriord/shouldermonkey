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
import { CinematicPage } from './CinematicPage'
import { ValueStackHorizontal } from './ValueStackHorizontal'
import { AudioAmbient } from './AudioAmbient'
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

      {/* CinematicEngine — vanilla Three.js + GSAP film reel */}
      <CinematicPage
        scrollRef={scrollRef}
        onChapterChange={(ch) => {
          setChapter(ch)
          const p = scrollRef.current
          const peaks = [0, 0.22, 0.44, 0.66, 0.88]
          const FADE = 0.10
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
        }}
        onReady={onCanvasReady}
      />
      <AudioAmbient chapter={chapter} />

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
        <div ref={storyRef} data-cinematic-story style={{ height: '800vh', position: 'relative' }}>

          {/* Chapters are fixed overlays within this zone */}
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

            {/* ── CHAPTER 0: THE HOOK ── */}
            <Chapter opacity={canvasReady ? chapterOpacities[0] : 0}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p className={`mb-5 ${chapter === 0 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF3366', animationDuration: '0.5s' }}>
                  100% ONLINE · ZOOM · AUGUST 2026 · AEST
                </p>

                <div className={chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}
                  style={{ animationDuration: '0.7s', animationDelay: '0.1s', textAlign: 'center' }}>
                  <span className="font-display font-black"
                    style={{ display: 'block', fontSize: 'clamp(1.2rem, 2.5vw, 2.5rem)', letterSpacing: '0.5em', color: '#FF3366', marginBottom: '0.15em', paddingLeft: '0.5em' }}>
                    AI
                  </span>
                  <h1 className="font-display font-black"
                    style={{ fontSize: 'clamp(3.8rem, 12.5vw, 13rem)', lineHeight: 0.85, letterSpacing: '-0.04em', margin: 0 }}>
                    <span style={{ WebkitTextStroke: '3px #7B3FE4', color: 'transparent' }}>UN</span>
                    <span style={{ color: '#ffffff' }}>LOCKED</span>
                  </h1>
                </div>

                {/* Hook */}
                <p className={`mt-6 max-w-xl ${chapter === 0 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, animationDuration: '0.7s', animationDelay: '0.3s' }}>
                  The 90-minute live session teaching young Australians to build with AI<br />
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>before their schools figure out what it is.</span>
                </p>

                {/* Threat */}
                <p className={`mt-3 max-w-lg ${chapter === 0 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, animationDuration: '0.7s', animationDelay: '0.4s' }}>
                  Your classmate figures this out before you. That advantage doesn&apos;t expire.
                </p>

                {/* Reciprocity + CTA */}
                <div className={`mt-8 flex flex-col items-center gap-4 ${chapter === 0 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.6s', animationDelay: '0.5s', maxWidth: 420, width: '100%' }}>
                  <p style={{ fontSize: '0.82rem', color: '#FF3366', fontWeight: 600 }}>
                    Join today and get the AI Starter Guide in your inbox immediately.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', textAlign: 'left' }}>
                    {['First access when ticket dates drop', 'Founding cohort pricing — the lowest this event will ever be', 'Early access to what we\'re including for the founding cohort'].map((item) => (
                      <p key={item} style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#7B3FE4', flexShrink: 0 }}>✓</span>{item}
                      </p>
                    ))}
                  </div>
                  <a href="#waitlist-form" className="btn-primary w-full text-center"
                    style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)' }}
                    onClick={e => { e.preventDefault(); document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Join the Waitlist. It&apos;s Free.
                  </a>
                  <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
                    Waitlist closes when the founding cohort is full.
                  </p>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" aria-hidden="true">
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>scroll</span>
                  <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(123,63,228,0.7), transparent)' }} />
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 1: THE PROBLEM ── */}
            <Chapter opacity={chapterOpacities[1]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p className={`font-semibold mb-10 max-w-2xl ${chapter === 1 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, animationDuration: '0.6s' }}>
                  You&apos;re watching everyone else figure out AI.<br />
                  You&apos;re not sure where to start. You&apos;re not wrong to feel that way.
                </p>

                {/* Verified ACARA fact — no fabricated stat */}
                <h2 className={`font-display font-black ${chapter === 1 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', lineHeight: 1.1, letterSpacing: '-0.03em', color: '#FF3366', maxWidth: 720, animationDuration: '0.6s', animationDelay: '0.1s' }}
                  aria-label="Australia's national curriculum has no AI subject">
                  Australia&apos;s national curriculum has<br />
                  no AI subject.
                </h2>

                <p className={`mt-4 ${chapter === 1 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: '#ffffff', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: 600, lineHeight: 1.5, animationDuration: '0.6s', animationDelay: '0.2s' }}>
                  Not in Year 7. Not in Year 12. Not anywhere.
                </p>
                <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem' }}>
                  Source: Australian Curriculum V9, ACARA — verify at australiancurriculum.edu.au
                </p>

                <p className={`mt-6 font-semibold ${chapter === 1 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: '#ffffff', fontSize: 'clamp(1rem, 2vw, 1.3rem)', animationDuration: '0.6s', animationDelay: '0.3s' }}>
                  That&apos;s the gap. Tonight, you cross it.
                </p>
                <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  90 minutes to learn what your teachers haven&apos;t been taught yet.
                </p>

                <div className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl w-full ${chapter === 1 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.4s' }}>
                  <div className="rounded-2xl p-7 text-left" style={{ background: 'rgba(255,51,102,0.05)', border: '1.5px solid rgba(255,51,102,0.25)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF3366' }}>Most schools</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>Still deciding whether AI is a tool or a threat.</p>
                  </div>
                  <div className="rounded-2xl p-7 text-left" style={{ background: 'rgba(123,63,228,0.08)', border: '1.5px solid rgba(123,63,228,0.35)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7B3FE4' }}>You, one night from now</p>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.6 }}>Building with AI before most people your age know how to prompt it.</p>
                  </div>
                </div>
              </div>
            </Chapter>

            {/* ── CHAPTER 2: THE GUIDE ── */}
            <Chapter opacity={chapterOpacities[2]}>
              <div className="flex flex-col items-center justify-center h-screen px-8 md:px-16" style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

                <p className={`mb-10 text-center ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', letterSpacing: '0.01em', animationDuration: '0.5s' }}>
                  Led by two people who have already done what this event teaches.
                </p>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8 ${chapter === 2 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.6s', animationDelay: '0.1s' }}>

                  {/* Dee */}
                  <div className="rounded-2xl p-8 text-left" style={{ background: 'rgba(255,51,102,0.05)', border: '1.5px solid rgba(255,51,102,0.22)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF3366', marginBottom: 12 }}>
                      Dee · Sydney · Your instructor
                    </p>
                    <p style={{ fontSize: 'clamp(1.4rem, 2vw, 1.7rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.25, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                      ShoulderMonkey: 200+ businesses.<br />5 more products shipped in 12 months.
                    </p>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                      He has been building with technology for years. Then AI arrived and changed the pace. Qaneri, Holmes, Donna, Veridian, FORGE — all built in the last 12 months, all still live. Everything taught in this event, he built with.
                    </p>
                  </div>

                  {/* Abhinav */}
                  <div className="rounded-2xl p-8 text-left" style={{ background: 'rgba(123,63,228,0.07)', border: '1.5px solid rgba(123,63,228,0.25)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
                      Abhinav Verma · RackTheBrain
                    </p>
                    <p style={{ fontSize: 'clamp(1.4rem, 2vw, 1.7rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.25, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
                      1,000+ students taught.<br />Built RackTheBrain to fix how young people learn.
                    </p>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                      He watched the same problem repeat — young people capable of more, not reaching it. He spent years working out how they actually learn, not how adults think they learn. He knows how to make it stick.
                    </p>
                  </div>
                </div>

                {/* Parent note */}
                <div className={`w-full rounded-xl px-6 py-4 ${chapter === 2 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', animationDuration: '0.5s', animationDelay: '0.3s' }}>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                    <span style={{ color: '#7B3FE4', fontWeight: 700 }}>Parents:</span> Runs on Zoom. Supervised. Recorded for all ticket holders. No technical background needed. Your child leaves with something they built.
                  </p>
                </div>

              </div>
            </Chapter>

            {/* ── CHAPTER 3: WHAT HAPPENS IN 90 MINUTES ── */}
            <Chapter opacity={chapterOpacities[3]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <p className={`mb-2 ${chapter === 3 ? 'animate__animated animate__fadeInDown' : ''}`}
                  style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', animationDuration: '0.5s' }}>
                  Between the two of them, here&apos;s what 90 minutes produces.
                </p>

                <h2 className={`font-display font-black ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3.2rem)', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: 680, lineHeight: 1.1, animationDuration: '0.6s', animationDelay: '0.05s', marginBottom: 32 }}>
                  You walk in not knowing.<br />
                  <span style={{ color: '#FF3366' }}>You walk out building.</span>
                </h2>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left ${chapter === 3 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.2s' }}>
                  {[
                    { label: 'Live AI build', detail: 'Watch a working product built from nothing — an automation or content tool. You get the template. You run it the same night.', i: 0 },
                    { label: 'The tool stack', detail: 'ChatGPT, Claude, Canva AI, ElevenLabs. Shown live, not explained in slides. You leave knowing which one to use and when.', i: 1 },
                    { label: 'One automation', detail: 'A workflow that saves 10 hours a week. Built in front of you. You get the template. It runs that night.', i: 2 },
                    { label: 'Content in 60 minutes', detail: 'A full week of social posts created live in one hour. You watch exactly how it\'s done.', i: 3 },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-5"
                      style={{ background: item.i % 2 === 0 ? 'rgba(123,63,228,0.07)' : 'rgba(255,51,102,0.05)', border: `1.5px solid ${item.i % 2 === 0 ? 'rgba(123,63,228,0.28)' : 'rgba(255,51,102,0.22)'}` }}>
                      <p className="font-bold text-sm mb-1" style={{ color: item.i % 2 === 0 ? '#a673ff' : '#FF3366' }}>{item.label}</p>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.55 }}>{item.detail}</p>
                    </div>
                  ))}
                </div>

                <p className={`mt-6 ${chapter === 3 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', animationDuration: '0.5s', animationDelay: '0.35s' }}>
                  Founding cohort members get something at the end we&apos;re not announcing publicly.
                  Waitlist members hear what it is before anyone else.
                </p>
              </div>
            </Chapter>

            {/* ── CHAPTER 4: THE CTA ── */}
            <Chapter opacity={chapterOpacities[4]}>
              <div className="flex flex-col items-center justify-center h-screen text-center px-6">
                <h2 className={`font-display font-black mb-5 ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', letterSpacing: '-0.03em', color: '#ffffff', lineHeight: 1.05, animationDuration: '0.6s' }}>
                  Be in the room<br />
                  <span style={{ color: '#FF3366' }}>when it matters.</span>
                </h2>

                <div className={`flex flex-col gap-3 mb-8 max-w-sm w-full ${chapter === 4 ? 'animate__animated animate__fadeIn' : ''}`}
                  style={{ animationDuration: '0.5s', animationDelay: '0.15s' }}>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(123,63,228,0.08)', border: '1px solid rgba(123,63,228,0.2)', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 4 }}>Right now</p>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Join the waitlist free. You hear first. You pay nothing today.</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,51,102,0.06)', border: '1px solid rgba(255,51,102,0.2)', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FF3366', marginBottom: 4 }}>August 2026 · AEST</p>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Founding cohort members get the ticket first. $149 AUD. One night live.</p>
                  </div>
                </div>

                <a href="#waitlist-form"
                  className={`btn-primary ${chapter === 4 ? 'animate__animated animate__fadeInUp' : ''}`}
                  style={{ background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', fontSize: '1.1rem', padding: '1.1rem 2.8rem', animationDuration: '0.5s', animationDelay: '0.25s' }}
                  onClick={e => { e.preventDefault(); document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' }) }}>
                  Join the Waitlist. It&apos;s Free.
                </a>

                <p className="mt-5" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
                  August 2026, AEST · Waitlist closes when the founding cohort is full.
                </p>

                <p className="mt-4 font-semibold" style={{ color: '#ffffff', fontSize: '1rem' }}>
                  50 seats. Live. You leave with a working AI product — not a certificate, not notes.
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
                August 2026. Be first when tickets drop.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: 32 }}>
                Free to join. Founding cohort pricing locked for waitlist members.
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

          <ValueStackHorizontal />
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
