'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const navLinks = [
  { label: 'Features',     href: '#features' },
  { label: 'Who It\'s For', href: '#niches' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'FAQ',          href: '#faq' },
]

export default function Nav() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    if (href === '#hero') { window.scrollTo({ top: 0, behavior: 'smooth' }); return }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(3,1,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(132,75,254,0.1)' : '1px solid transparent',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 2rem', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="#hero" onClick={scrollTo('#hero')} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/SM - Logo - Flat Lay White.png"
            alt="Shoulder Monkey"
            width={180}
            height={50}
            style={{ objectFit: 'contain', height: '36px', width: 'auto' }}
            priority
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: '2.25rem' }}>
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={scrollTo(l.href)}
              style={{
                color: 'rgba(240,237,255,0.55)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#ffffff' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.55)' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://app.shouldermonkey.co"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem', fontWeight: 500,
              color: 'rgba(240,237,255,0.35)',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.7)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.35)' }}
          >
            Log in
          </a>
          <a href="#pricing" onClick={scrollTo('#pricing')} className="btn-primary" style={{ padding: '0.6rem 1.375rem', fontSize: '0.875rem' }}>
            Start Free Trial
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ background: 'none', border: 'none', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              style={{ display: 'block', width: 22, height: 2, background: '#844bfe', borderRadius: 2 }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', background: 'rgba(3,1,8,0.98)', borderTop: '1px solid rgba(132,75,254,0.1)' }}
          >
            <div style={{ padding: '1.5rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {navLinks.map((l) => (
                <a key={l.href} href={l.href} onClick={scrollTo(l.href)}
                  style={{ color: 'rgba(240,237,255,0.8)', textDecoration: 'none', fontSize: '1.0625rem', fontWeight: 500 }}>
                  {l.label}
                </a>
              ))}
              <a href="#pricing" onClick={scrollTo('#pricing')} className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center', textAlign: 'center' }}>
                Start Free Trial
              </a>
              <a href="https://app.shouldermonkey.co" target="_blank" rel="noopener noreferrer"
                style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(240,237,255,0.35)', textDecoration: 'none' }}>
                Already a customer? Log in
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
