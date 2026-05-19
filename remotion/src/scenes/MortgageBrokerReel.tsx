import { useCurrentFrame, interpolate, spring, AbsoluteFill, Easing } from 'remotion'

// ─── Design tokens (matches mortgage-broker page) ─────────────────────────────
const BG     = '#080d1a'
const SURFACE = '#0d1426'
const TEXT   = '#f0f4ff'
const MUTED  = 'rgba(240,244,255,0.45)'
const SUBTLE = 'rgba(240,244,255,0.22)'
const ACCENT = '#d4a04a'
const CARD   = 'rgba(212,160,74,0.06)'
const BORDER = 'rgba(212,160,74,0.2)'

function fi(frame: number, inputRange: [number, number], outputRange: [number, number], easing?: (t: number) => number) {
  return interpolate(frame, inputRange, outputRange, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing })
}
function fadeIn(frame: number, start: number, end: number) { return fi(frame, [start, end], [0, 1], Easing.out(Easing.quad)) }
function fadeOut(frame: number, start: number, end: number) { return fi(frame, [start, end], [1, 0], Easing.in(Easing.quad)) }
function winOp(frame: number, inS: number, inE: number, outS?: number, outE?: number) {
  return Math.min(fadeIn(frame, inS, inE), outS != null ? fadeOut(frame, outS, outE!) : 1)
}
function slideY(frame: number, start: number, end: number, dist = 36) {
  return fi(frame, [start, end], [dist, 0], Easing.out(Easing.cubic))
}
function slideX(frame: number, start: number, end: number, dist = 40) {
  return fi(frame, [start, end], [dist, 0], Easing.out(Easing.cubic))
}

function NotificationCard({ icon, title, sub, color, opacity, x }: {
  icon: string; title: string; sub: string; color: string; opacity: number; x: number
}) {
  return (
    <div style={{ opacity, transform: `translateX(${x}px)`, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.25)', width: 640 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 14, color: MUTED }}>{sub}</div>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
    </div>
  )
}

export function MortgageBrokerReel() {
  const frame = useCurrentFrame()
  const globalOp = fi(frame, [348, 360], [1, 0])

  const badgeOp  = winOp(frame, 5, 30, 72, 85)
  const titleOp  = winOp(frame, 8, 35, 72, 85); const titleY = slideY(frame, 8, 38)
  const subOp    = winOp(frame, 22, 48, 72, 85); const subY   = slideY(frame, 22, 48)
  const taglineOp = winOp(frame, 50, 72, 76, 87); const taglineY = slideY(frame, 50, 72)

  const labelOp = winOp(frame, 92, 108, 170, 183)
  const n1op = winOp(frame, 100, 118, 163, 178); const n1x = slideX(frame, 100, 120)
  const n2op = winOp(frame, 116, 134, 163, 178); const n2x = slideX(frame, 116, 136)
  const n3op = winOp(frame, 132, 150, 163, 178); const n3x = slideX(frame, 132, 152)
  const n4op = winOp(frame, 148, 166, 163, 178); const n4x = slideX(frame, 148, 168)

  const starsOp  = winOp(frame, 190, 208, 263, 278)
  const headOp   = winOp(frame, 202, 220, 263, 278); const headY = slideY(frame, 202, 222)
  const quoteOp  = winOp(frame, 222, 248, 263, 278); const quoteY = slideY(frame, 222, 245, 20)
  const attribOp = winOp(frame, 248, 264, 263, 278)
  const googleOp = winOp(frame, 258, 272, 263, 278)

  const ctaSpring = spring({ frame: frame - 282, fps: 30, config: { damping: 180 } })
  const ctaScale  = interpolate(ctaSpring, [0, 1], [0.88, 1])
  const ctaOp     = winOp(frame, 282, 300, 342, 354)
  const subCtaOp  = winOp(frame, 296, 312, 342, 354)
  const cardOp    = winOp(frame, 310, 328, 342, 354); const cardY = slideY(frame, 310, 330, 30)

  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${BG} 0%, ${SURFACE} 100%)`, fontFamily: 'system-ui, -apple-system, sans-serif', opacity: globalOp, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,74,0.08), transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,160,74,0.05), transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* ACT 1 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ opacity: badgeOp, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,160,74,0.08)', border: `1px solid ${BORDER}`, borderRadius: 100, padding: '8px 22px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>Sydney CBD · Est. 2011 · Accredited</span>
        </div>
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.92, color: TEXT }}>Atlas</div>
          <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: ACCENT }}>Finance</div>
        </div>
        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, marginTop: 24 }}>
          <div style={{ fontSize: 22, color: MUTED, textAlign: 'center' }}>$2.8B settled · 40+ lender panel · 24hr pre-approvals</div>
        </div>
        <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, marginTop: 20 }}>
          <div style={{ fontSize: 24, fontWeight: 500, color: ACCENT, textAlign: 'center', fontStyle: 'italic' }}>
            &ldquo;A broker who actually answers their phone.&rdquo;
          </div>
        </div>
      </AbsoluteFill>

      {/* ACT 2 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14 }}>
        <div style={{ opacity: labelOp, marginBottom: 6, alignSelf: 'flex-start', marginLeft: 320 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT }}>Pipeline · This Week</div>
        </div>
        <NotificationCard opacity={n1op} x={n1x} icon="📩" title="New enquiry → Pre-approval" sub="James & Lisa M. · $920K purchase · docs requested" color={ACCENT} />
        <NotificationCard opacity={n2op} x={n2x} icon="✅" title="Pre-approval issued" sub="Chen W. · $740K · 3 lender options sent" color="#22c55e" />
        <NotificationCard opacity={n3op} x={n3x} icon="⭐" title="5-star review received" sub="&ldquo;The most responsive broker I&apos;ve ever dealt with&rdquo;" color="#f59e0b" />
        <NotificationCard opacity={n4op} x={n4x} icon="🏠" title="Settlement confirmed" sub="Priya K. · $1.1M · congratulations sent automatically" color={ACCENT} />
      </AbsoluteFill>

      {/* ACT 3 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ opacity: starsOp, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          {[0,1,2,3,4].map(i => <svg key={i} width="28" height="28" viewBox="0 0 14 14" fill="#f59e0b"><path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z"/></svg>)}
          <span style={{ fontSize: 32, fontWeight: 800, color: TEXT, marginLeft: 8 }}>4.9</span>
        </div>
        <div style={{ opacity: headOp, transform: `translateY(${headY}px)`, textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Sydney&apos;s most responsive brokers</div>
        </div>
        <div style={{ opacity: quoteOp, transform: `translateY(${quoteY}px)`, textAlign: 'center', maxWidth: 760 }}>
          <div style={{ fontSize: 26, fontWeight: 400, color: TEXT, lineHeight: 1.6, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '32px 40px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
            &ldquo;Atlas called me back in 8 minutes. Had three lender options by end of day.
            We settled in 3 weeks. Absolutely outstanding.&rdquo;
          </div>
        </div>
        <div style={{ opacity: attribOp, marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: ACCENT }}>— Michael R.</div>
          <div style={{ fontSize: 15, color: SUBTLE, marginTop: 4 }}>$850K investment purchase · 2025</div>
        </div>
        <div style={{ opacity: googleOp, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span style={{ fontSize: 17, fontWeight: 600, color: MUTED }}>1,240 five-star Google reviews</span>
        </div>
      </AbsoluteFill>

      {/* ACT 4 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ opacity: ctaOp, transform: `scale(${ctaScale})`, textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0, color: TEXT }}>Your home</div>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0, color: ACCENT }}>starts here.</div>
        </div>
        <div style={{ opacity: subCtaOp, textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 20, color: MUTED }}>Pre-approval in 24 hours · Sydney CBD</div>
        </div>
        <div style={{ opacity: cardOp, transform: `translateY(${cardY}px)` }}>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 24, padding: '28px 36px', minWidth: 500, boxShadow: '0 12px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${ACCENT}, #b8860b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>A</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Atlas Finance</div>
                <div style={{ fontSize: 13, color: MUTED }}>Pre-approval consultation booked ✅</div>
              </div>
            </div>
            {[
              { icon: '📅', label: 'Thursday 24 Apr · 11:00am' },
              { icon: '🏦', label: 'Pre-approval · $920K purchase' },
              { icon: '📍', label: 'Level 12, 1 O\'Connell St, Sydney CBD' },
            ].map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 2 ? 10 : 24 }}>
                <span style={{ fontSize: 16 }}>{d.icon}</span>
                <span style={{ fontSize: 16, color: TEXT, fontWeight: 500 }}>{d.label}</span>
              </div>
            ))}
            <div style={{ background: ACCENT, borderRadius: 100, padding: '14px 28px', textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#fff', boxShadow: '0 8px 30px rgba(212,160,74,0.35)' }}>
              Get pre-approved →
            </div>
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  )
}
