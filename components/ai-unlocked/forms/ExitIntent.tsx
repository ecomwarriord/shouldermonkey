'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ExitIntent() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const triggered = typeof window !== 'undefined' && sessionStorage.getItem('ai-exit-shown')

  useEffect(() => {
    if (triggered) return

    let lastScrollY = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    function onScroll() {
      const current = window.scrollY
      const scrollPct = current / maxScroll
      // Show if scrolled 60%+ then scrolled back up fast (exit intent)
      if (scrollPct > 0.6 && current < lastScrollY - 200) {
        setVisible(true)
        sessionStorage.setItem('ai-exit-shown', '1')
        window.removeEventListener('scroll', onScroll)
      }
      lastScrollY = current
    }

    // Also mouse-leave on desktop
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        setVisible(true)
        sessionStorage.setItem('ai-exit-shown', '1')
        document.removeEventListener('mouseleave', onMouseLeave)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [triggered])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/ai-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'unknown', source: 'exit-intent' }),
      })
    } catch {}
    setSubmitted(true)
  }

  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200]"
            style={{ background: 'rgba(3,1,8,0.7)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
          />
          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
          >
            <div className="glass-dark rounded-2xl p-8 text-center">
              <button
                className="absolute top-4 right-4 text-2xl"
                style={{ color: 'var(--ai-muted)' }}
                onClick={() => setVisible(false)}
                aria-label="Close"
              >
                ×
              </button>
              {!submitted ? (
                <>
                  <p className="label-pill mb-4 mx-auto" style={{ width: 'fit-content' }}>Before you go</p>
                  <h2 id="exit-intent-title" className="font-display font-black text-2xl text-white mb-2">
                    Get the free AI Starter Guide
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--ai-muted)' }}>
                    5 AI tools every young entrepreneur should know. No cost, no catch.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{ background: 'rgba(132,75,254,0.08)', border: '1px solid rgba(132,75,254,0.25)', color: '#f0edff' }}
                    />
                    <button type="submit" className="btn-primary w-full">
                      Send me the guide →
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-4">
                  <p className="text-2xl mb-2">✓</p>
                  <p className="font-display font-bold text-white text-xl">You're in.</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--ai-muted)' }}>Check your inbox in a few minutes.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
