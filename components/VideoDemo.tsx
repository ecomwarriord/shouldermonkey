'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function VideoDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [playing, setPlaying] = useState(false)

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(60px, 10vw, 100px) 1.5rem',
        background: '#030108',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(132,75,254,0.1), transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}
        >
          <div className="label-pill">See It In Action</div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08 }}
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#ffffff',
            textAlign: 'center', marginBottom: '0.75rem',
          }}
        >
          See the automation<br />
          <span className="text-gradient-cyan">from lead to booked client.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.14 }}
          style={{
            fontSize: '1rem', color: 'rgba(240,237,255,0.45)',
            textAlign: 'center', marginBottom: '2.5rem',
          }}
        >
          The full workflow — lead capture to review request in 2 minutes.
        </motion.p>

        {/* Video frame */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative' }}
        >
          {/* Outer glow border */}
          <div style={{
            position: 'absolute', inset: '-2px', borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(132,75,254,0.5), rgba(0,235,193,0.2), rgba(132,75,254,0.5))',
            zIndex: 0,
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            background: '#030108',
            borderRadius: '18px',
            overflow: 'hidden',
            aspectRatio: '16/9',
            boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          }}>
            {playing ? (
              <video
                src="/videos/demo.mp4"
                autoPlay
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              /* Thumbnail / play state */
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #0a0612 0%, #1a0d3a 50%, #0a0612 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Ambient gradient */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at 30% 50%, rgba(132,75,254,0.15), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,235,193,0.08), transparent 60%)',
                }} />

                {/* Fake blurred UI preview */}
                <div style={{ position: 'absolute', inset: '8%', opacity: 0.2, filter: 'blur(2px)', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px' }}>
                  {/* Sidebar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} style={{ height: 36, borderRadius: 8, background: 'rgba(132,75,254,0.15)', border: '1px solid rgba(132,75,254,0.1)' }} />
                    ))}
                  </div>
                  {/* Main */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ height: 48, borderRadius: 8, background: 'rgba(132,75,254,0.1)' }} />
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} style={{ height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} />
                    ))}
                  </div>
                </div>

                {/* Scene labels floating */}
                {[
                  { text: 'Lead captured', x: '15%', y: '20%', color: '#844bfe' },
                  { text: 'Auto-reply fired', x: '65%', y: '35%', color: '#00ebc1' },
                  { text: 'Booking confirmed', x: '25%', y: '65%', color: '#fec871' },
                  { text: 'Review requested', x: '60%', y: '72%', color: '#ff0199' },
                ].map((label, i) => (
                  <div key={label.text} style={{
                    position: 'absolute', left: label.x, top: label.y,
                    padding: '4px 10px', borderRadius: 100,
                    background: `${label.color}15`, border: `1px solid ${label.color}30`,
                    fontSize: '11px', fontWeight: 700, color: label.color,
                    opacity: 0.7, whiteSpace: 'nowrap',
                    animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}>
                    {label.text}
                  </div>
                ))}

                {/* Play button */}
                <motion.button
                  onClick={() => setPlaying(true)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'relative', zIndex: 10,
                    width: '88px', height: '88px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #844bfe, #4623d3)',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 0 20px rgba(132,75,254,0.1), 0 0 0 40px rgba(132,75,254,0.05), 0 20px 60px rgba(132,75,254,0.6)',
                    marginBottom: '20px',
                    cursor: 'none',
                    animation: 'pulse-glow 3s ease-in-out infinite',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M11 8l14 7-14 7V8z" fill="white"/>
                  </svg>
                </motion.button>

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                    See how the automation works
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(240,237,255,0.4)' }}>
                    Lead capture → auto-reply → booking → reviews
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Below video: quick wins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem', marginTop: '2rem' }}
        >
          {[
            { icon: '⚡', text: 'Lead to auto-reply in 23 seconds' },
            { icon: '📅', text: 'Booked with zero manual input' },
            { icon: '⭐', text: 'Review request fires automatically' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(240,237,255,0.4)', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
