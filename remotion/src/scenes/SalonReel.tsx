import { useCurrentFrame, interpolate, spring, AbsoluteFill, Easing } from 'remotion'

// ─── Design tokens (matches salon page) ──────────────────────────────────────
const BG      = '#faf8f4'
const SURFACE = '#f4f0ea'
const TEXT    = '#1c1510'
const MUTED   = 'rgba(28,21,16,0.48)'
const SUBTLE  = 'rgba(28,21,16,0.22)'
const ACCENT  = '#b8956a'
const GOLD    = '#d4a04a'
const CARD    = 'rgba(255,255,255,0.9)'
const BORDER  = 'rgba(184,149,106,0.25)'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fi(frame: number, inputRange: [number, number], outputRange: [number, number], easing?: (t: number) => number) {
  return interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  })
}

function fadeIn(frame: number, start: number, end: number) {
  return fi(frame, [start, end], [0, 1], Easing.out(Easing.quad))
}

function fadeOut(frame: number, start: number, end: number) {
  return fi(frame, [start, end], [1, 0], Easing.in(Easing.quad))
}

function winOp(frame: number, inS: number, inE: number, outS?: number, outE?: number) {
  const inOp = fadeIn(frame, inS, inE)
  const outOp = outS != null ? fadeOut(frame, outS, outE!) : 1
  return Math.min(inOp, outOp)
}

function slideY(frame: number, start: number, end: number, dist = 36) {
  return fi(frame, [start, end], [dist, 0], Easing.out(Easing.cubic))
}

function slideX(frame: number, start: number, end: number, dist = 40) {
  return fi(frame, [start, end], [dist, 0], Easing.out(Easing.cubic))
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({
  icon, name, desc, price, accentColor, opacity, x,
}: {
  icon: string; name: string; desc: string; price: string
  accentColor: string; opacity: number; x: number
}) {
  return (
    <div style={{
      opacity, transform: `translateX(${x}px)`,
      display: 'flex', alignItems: 'center', gap: 20,
      background: CARD, border: `1px solid ${BORDER}`,
      borderRadius: 18, padding: '22px 28px',
      boxShadow: '0 4px 24px rgba(28,21,16,0.07)',
      width: 640,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${accentColor}18`,
        border: `1px solid ${accentColor}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 15, color: MUTED }}>{desc}</div>
      </div>
      <div style={{
        fontSize: 16, fontWeight: 700, color: accentColor,
        background: `${accentColor}10`, border: `1px solid ${accentColor}30`,
        borderRadius: 100, padding: '6px 16px', flexShrink: 0,
      }}>
        from {price}
      </div>
    </div>
  )
}

// ─── Star row ─────────────────────────────────────────────────────────────────

function StarRow({ opacity }: { opacity: number }) {
  return (
    <div style={{ opacity, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="28" height="28" viewBox="0 0 14 14" fill={GOLD}>
          <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5z"/>
        </svg>
      ))}
      <span style={{ fontSize: 32, fontWeight: 800, color: TEXT, marginLeft: 8 }}>4.9</span>
    </div>
  )
}

// ─── Main composition — 360 frames @ 30fps = 12 seconds ──────────────────────

export function SalonReel() {
  const frame = useCurrentFrame()

  // Global fade to white at end
  const globalOp = fi(frame, [348, 360], [1, 0])

  // ── ACT 1: Brand intro (f0–85) ───────────────────────────────────────────
  const badgeOp  = winOp(frame, 5, 30, 72, 85)
  const titleOp  = winOp(frame, 8, 35, 72, 85)
  const titleY   = slideY(frame, 8, 38)
  const subOp    = winOp(frame, 22, 48, 72, 85)
  const subY     = slideY(frame, 22, 48)
  const taglineOp = winOp(frame, 50, 72, 76, 87)
  const taglineY  = slideY(frame, 50, 72)

  // ── ACT 2: Services (f90–185) ────────────────────────────────────────────
  const labelOp = winOp(frame, 92, 108, 170, 183)
  const c1op    = winOp(frame, 100, 118, 163, 178)
  const c1x     = slideX(frame, 100, 120)
  const c2op    = winOp(frame, 116, 134, 163, 178)
  const c2x     = slideX(frame, 116, 136)
  const c3op    = winOp(frame, 132, 150, 163, 178)
  const c3x     = slideX(frame, 132, 152)
  const c4op    = winOp(frame, 148, 166, 163, 178)
  const c4x     = slideX(frame, 148, 168)

  // ── ACT 3: Social proof (f188–278) ───────────────────────────────────────
  const starsOp   = winOp(frame, 190, 208, 263, 278)
  const headOp    = winOp(frame, 202, 220, 263, 278)
  const headY     = slideY(frame, 202, 222)
  const quoteOp   = winOp(frame, 222, 248, 263, 278)
  const quoteY    = slideY(frame, 222, 245, 20)
  const attribOp  = winOp(frame, 248, 264, 263, 278)
  const googleOp  = winOp(frame, 258, 272, 263, 278)

  // ── ACT 4: Book CTA (f282–352) ───────────────────────────────────────────
  const ctaSpring = spring({ frame: frame - 282, fps: 30, config: { damping: 180 } })
  const ctaScale  = interpolate(ctaSpring, [0, 1], [0.88, 1])
  const ctaOp     = winOp(frame, 282, 300, 342, 354)
  const subCtaOp  = winOp(frame, 296, 312, 342, 354)
  const cardOp    = winOp(frame, 310, 328, 342, 354)
  const cardY     = slideY(frame, 310, 330, 30)

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${BG} 0%, ${SURFACE} 100%)`,
      fontFamily: 'system-ui, -apple-system, Georgia, serif',
      opacity: globalOp,
      overflow: 'hidden',
    }}>

      {/* ── Decorative glows ── */}
      <div style={{ position: 'absolute', top: '-5%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(184,149,106,0.12), transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, rgba(212,160,74,0.08), transparent 60%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACT 1: Brand */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

        {/* Location badge */}
        <div style={{ opacity: badgeOp, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 8, background: `rgba(184,149,106,0.1)`, border: `1px solid ${BORDER}`, borderRadius: 100, padding: '8px 22px' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
          <span style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT }}>
            Knox St · Double Bay · Est. 2018
          </span>
        </div>

        {/* Title */}
        <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
          <div style={{ fontSize: 120, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.92, color: TEXT }}>
            The Loft
          </div>
          <div style={{
            fontSize: 100, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1,
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 55%, #9e7a50 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Salon & Spa
          </div>
        </div>

        {/* Tagline */}
        <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, marginTop: 28 }}>
          <div style={{ fontSize: 26, fontWeight: 400, color: MUTED, letterSpacing: '0.02em', textAlign: 'center', fontStyle: 'italic' }}>
            &ldquo;Where you leave feeling like yourself.&rdquo;
          </div>
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACT 2: Services */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>

        {/* Section label */}
        <div style={{ opacity: labelOp, marginBottom: 8, alignSelf: 'flex-start', marginLeft: 320 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT }}>
            Our Services
          </div>
        </div>

        <ServiceCard
          opacity={c1op} x={c1x}
          icon="🎨" name="Colour"
          desc="Balayage, highlights, full colour, toning & colour correction"
          price="$180" accentColor={GOLD}
        />
        <ServiceCard
          opacity={c2op} x={c2x}
          icon="✂️" name="Cut & Style"
          desc="Women's cuts, blowouts, express styling & fringe trims"
          price="$95" accentColor={ACCENT}
        />
        <ServiceCard
          opacity={c3op} x={c3x}
          icon="✨" name="Treatments"
          desc="Olaplex, keratin smoothing, deep conditioning & scalp care"
          price="$120" accentColor="#9e7a50"
        />
        <ServiceCard
          opacity={c4op} x={c4x}
          icon="💍" name="Bridal"
          desc="Trials, day-of styling & complete bridal party packages"
          price="consultation" accentColor="#c8a882"
        />
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACT 3: Social proof */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

        <StarRow opacity={starsOp} />

        <div style={{ opacity: headOp, transform: `translateY(${headY}px)`, textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: TEXT, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Double Bay&apos;s most loved salon
          </div>
        </div>

        {/* Quote */}
        <div style={{ opacity: quoteOp, transform: `translateY(${quoteY}px)`, textAlign: 'center', maxWidth: 760 }}>
          <div style={{
            fontSize: 26, fontWeight: 400, color: TEXT, lineHeight: 1.6, fontStyle: 'italic',
            background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 24, padding: '32px 40px',
            boxShadow: '0 8px 40px rgba(28,21,16,0.08)',
          }}>
            &ldquo;Emma is an absolute artist. My balayage has never looked so natural.
            I get stopped in the street and asked who does my hair.&rdquo;
          </div>
        </div>

        {/* Attribution */}
        <div style={{ opacity: attribOp, marginTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: ACCENT }}>— Rachel M.</div>
          <div style={{ fontSize: 15, color: SUBTLE, marginTop: 4 }}>Loyal client since 2020</div>
        </div>

        {/* Review count */}
        <div style={{ opacity: googleOp, marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: 17, fontWeight: 600, color: MUTED }}>847 five-star Google reviews</span>
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACT 4: Book CTA */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

        {/* Headline */}
        <div style={{ opacity: ctaOp, transform: `scale(${ctaScale})`, textAlign: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0, color: TEXT }}>
            Ready for your
          </div>
          <div style={{
            fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.0,
            background: `linear-gradient(135deg, ${ACCENT} 0%, ${GOLD} 60%, #9e7a50 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            transformation?
          </div>
        </div>

        {/* Sub */}
        <div style={{ opacity: subCtaOp, textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 20, color: MUTED, fontWeight: 400 }}>Book online · Knox St, Double Bay · Open 7 days</div>
        </div>

        {/* Booking card */}
        <div style={{ opacity: cardOp, transform: `translateY(${cardY}px)` }}>
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 24, padding: '28px 36px', minWidth: 500, textAlign: 'left',
            boxShadow: `0 12px 50px rgba(28,21,16,0.1), 0 0 0 1px rgba(184,149,106,0.12)`,
          }}>
            {/* Confirmed header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>TL</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>The Loft Salon & Spa</div>
                <div style={{ fontSize: 13, color: MUTED }}>Booking confirmed ✅</div>
              </div>
            </div>
            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '📅', label: 'Wednesday 23 Apr · 2:00pm' },
                { icon: '✂️', label: 'Balayage + Blow Dry with Emma' },
                { icon: '📍', label: 'Knox St, Double Bay NSW 2028' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16 }}>{d.icon}</span>
                  <span style={{ fontSize: 16, color: TEXT, fontWeight: 500 }}>{d.label}</span>
                </div>
              ))}
            </div>
            {/* CTA */}
            <div style={{
              background: ACCENT, borderRadius: 100, padding: '14px 28px', textAlign: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff',
              boxShadow: `0 8px 30px rgba(184,149,106,0.35)`,
            }}>
              Book your appointment →
            </div>
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  )
}
