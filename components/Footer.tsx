'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const footerLinks = {
  Product: [
    { label: 'Features',    href: '#features' },
    { label: 'Pricing',     href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Start Trial', href: '#trial' },
  ],
  'Who It\'s For': [
    { label: 'Hair & Beauty',     href: '#niches' },
    { label: 'Gyms & Fitness',    href: '#niches' },
    { label: 'Med Spas & Clinics',href: '#niches' },
    { label: 'Tradies',           href: '#niches' },
    { label: 'Real Estate',       href: '#niches' },
    { label: 'Any Service Business', href: '#niches' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      background: '#030108',
      borderTop: '1px solid rgba(132,75,254,0.1)',
      padding: 'clamp(3rem, 8vw, 5rem) 1.5rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '200px', background: 'radial-gradient(ellipse at top, rgba(132,75,254,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ marginBottom: '1rem' }}>
              <Image
                src="/images/SM - Logo - Flat Lay White.png"
                alt="Shoulder Monkey"
                width={180}
                height={50}
                style={{ objectFit: 'contain', height: '32px', width: 'auto' }}
              />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.35)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '0.75rem' }}>
              The all-in-one platform for service businesses in AU, NZ, and worldwide. Replace 12+ tools with one. Operational from day one.
            </p>
            <a href="tel:+61256576545" style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.45)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', fontWeight: 500 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a673ff' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.45)' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 9.5c0 .3-.1.6-.2.9-.2.3-.4.5-.7.7-.5.3-1 .4-1.6.4-1.6 0-3.2-.7-4.6-2.1C3 8 2.3 6.4 2.3 4.8c0-.6.1-1.1.4-1.6.2-.3.4-.5.7-.7.3-.1.6-.2.9-.2.1 0 .2 0 .3.1.1 0 .2.1.3.2l1.5 2.1c.1.2.2.3.2.5 0 .1 0 .3-.1.4-.1.1-.2.3-.3.4-.1.1-.2.2-.2.3 0 .1 0 .2.1.3.4.8 1 1.4 1.8 1.8.1.1.2.1.3.1.1 0 .2-.1.3-.2.1-.1.3-.2.4-.3.1-.1.3-.1.4-.1.2 0 .3.1.5.2l2.1 1.5c.1.1.2.2.2.3 0 .1.1.2.1.3z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
              +61 2 5657 6545
            </a>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'AU', color: '#00ebc1' },
              ].map((badge) => (
                <div key={badge.label} style={{
                  padding: '3px 10px', borderRadius: '100px',
                  background: `${badge.color}10`,
                  border: `1px solid ${badge.color}25`,
                  fontSize: '0.7rem', fontWeight: 700,
                  color: badge.color, letterSpacing: '0.06em',
                }}>
                  🌏 AU · NZ · Global
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,237,255,0.3)', marginBottom: '1rem' }}>
                {group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{ fontSize: '0.875rem', color: 'rgba(240,237,255,0.5)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a673ff' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(240,237,255,0.5)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(132,75,254,0.08)',
          paddingTop: '1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ fontSize: '0.8125rem', color: 'rgba(240,237,255,0.2)' }}>
            © 2026 Shoulder Monkey. All rights reserved. 377 Kent St, Sydney NSW 2000, Australia. ABN 62 669 452 117
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms'].map((l) => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: '0.8125rem', color: 'rgba(240,237,255,0.2)', textDecoration: 'none' }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
