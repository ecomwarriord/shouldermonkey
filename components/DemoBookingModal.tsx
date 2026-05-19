'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface DemoBookingModalProps {
  open: boolean
  onClose: () => void
}

export function DemoBookingModal({ open, onClose }: DemoBookingModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const scrollToEnquiry = () => {
    onClose()
    setTimeout(() => {
      const el = document.getElementById('enquiry')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', zIndex: 9999, cursor: 'pointer' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              background: '#fff', borderRadius: 24, padding: 'clamp(2rem, 5vw, 3rem)',
              maxWidth: 460, width: 'calc(100vw - 3rem)',
              zIndex: 10000, boxShadow: '0 24px 80px rgba(0,0,0,0.18)', textAlign: 'center',
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(107,53,245,0.08)', border: '1px solid rgba(107,53,245,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 22, color: '#6b35f5', fontWeight: 700,
            }}>
              ✦
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f1829', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
              This is a demo booking flow
            </h3>
            <p style={{ fontSize: 15, color: 'rgba(15,24,41,0.52)', lineHeight: 1.65, margin: '0 0 28px' }}>
              Want a real booking system like this for your business?<br />
              We&apos;ll build your version and have it live in 7 days.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={scrollToEnquiry}
                style={{
                  background: '#6b35f5', color: '#fff', border: 'none',
                  borderRadius: 100, padding: '14px 28px', fontSize: 15, fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 8px 30px rgba(107,53,245,0.25)',
                }}
              >
                Get yours &rarr;
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent', color: 'rgba(15,24,41,0.4)', border: 'none',
                  borderRadius: 100, padding: '12px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}
              >
                No thanks, keep browsing
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
