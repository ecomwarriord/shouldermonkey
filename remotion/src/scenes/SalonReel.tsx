import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'

const AMBER  = '#e8a86e'
const GOLD   = '#d4a04a'
const CREAM  = '#fdf8f0'
const BG     = '#0d0a07'
const SURF   = '#1a1410'
const MUTED  = 'rgba(253,248,240,0.45)'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fade(frame: number, inStart: number, inEnd: number, outStart?: number, outEnd?: number) {
  const inOp  = interpolate(frame, [inStart, inEnd],   [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const outOp = outStart != null ? interpolate(frame, [outStart, outEnd!], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) }) : 1
  return Math.min(inOp, outOp)
}

function slideUp(frame: number, start: number, end: number, dist = 40) {
  return interpolate(frame, [start, end], [dist, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ value, label, change, opacity, y }: {
  value: string; label: string; change: string; opacity: number; y: number
}) {
  return (
    <div style={{
      opacity, transform: `translateY(${y}px)`,
      background: 'rgba(253,248,240,0.04)',
      border: '1px solid rgba(232,168,110,0.15)',
      borderRadius: 24,
      padding: '32px 36px',
      minWidth: 220,
      backdropFilter: 'blur(20px)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 52, fontWeight: 800, color: CREAM, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>{value}</div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'rgba(74,222,128,0.1)', borderRadius: 20,
        padding: '4px 12px',
        fontSize: 13, fontWeight: 700, color: '#4ade80',
      }}>{change}</div>
    </div>
  )
}

// ─── SMS bubble ──────────────────────────────────────────────────────────────

function SMSBubble({ text, opacity, x }: { text: string; opacity: number; x: number }) {
  return (
    <div style={{
      opacity, transform: `translateX(${x}px)`,
      background: 'rgba(232,168,110,0.12)',
      border: '1px solid rgba(232,168,110,0.2)',
      borderRadius: '20px 20px 20px 4px',
      padding: '16px 20px',
      maxWidth: 360,
      fontSize: 15,
      color: CREAM,
      lineHeight: 1.6,
      whiteSpace: 'pre-line',
    }}>
      {text}
    </div>
  )
}

// ─── Main composition ─────────────────────────────────────────────────────────
// 360 frames @ 30fps = 12 seconds, designed to loop

export function SalonReel() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ── Act 1: Title (0–90) ─────────────────────────────────────────────────
  const titleOp   = fade(frame, 0, 25, 75, 90)
  const titleY    = slideUp(frame, 0, 30)
  const subOp     = fade(frame, 20, 45, 75, 90)
  const subY      = slideUp(frame, 20, 45)
  const badgeOp   = fade(frame, 40, 60, 75, 90)

  // ── Act 2: Revenue (90–185) ──────────────────────────────────────────────
  const revOp     = fade(frame, 90, 115, 170, 185)
  const revY      = slideUp(frame, 90, 115)
  const revSpring = spring({ frame: frame - 100, fps, config: { damping: 180, mass: 1.2 }, durationInFrames: 70 })
  const revValue  = Math.floor(interpolate(revSpring, [0, 1], [0, 47230]))

  // ── Act 3: Stats grid (185–285) ──────────────────────────────────────────
  const s1op = fade(frame, 185, 210, 270, 285)
  const s1y  = slideUp(frame, 185, 210, 30)
  const s2op = fade(frame, 200, 225, 270, 285)
  const s2y  = slideUp(frame, 200, 225, 30)
  const s3op = fade(frame, 215, 240, 270, 285)
  const s3y  = slideUp(frame, 215, 240, 30)

  // ── Act 4: SMS notification (285–350) ──────────────────────────────────
  const smsLabelOp  = fade(frame, 285, 305, 340, 355)
  const sms1op      = fade(frame, 295, 315, 340, 355)
  const sms1x       = interpolate(frame, [295, 315], [-30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const sms2op      = fade(frame, 318, 338, 340, 355)
  const sms2x       = interpolate(frame, [318, 338], [-30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  // ── Overall fade to black for loop (348–360) ─────────────────────────
  const globalFade  = interpolate(frame, [348, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: BG,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      overflow: 'hidden',
      opacity: globalFade,
      position: 'relative',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 400,
        background: 'radial-gradient(ellipse, rgba(232,168,110,0.07), transparent 65%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 400, height: 300,
        background: 'radial-gradient(ellipse, rgba(212,160,74,0.05), transparent 65%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      {/* ── Act 1: Title ── */}
      <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)`, textAlign: 'center', position: 'absolute' }}>
        {/* Open label */}
        <div style={{
          opacity: badgeOp,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(232,168,110,0.08)', border: '1px solid rgba(232,168,110,0.2)',
          borderRadius: 40, padding: '6px 18px',
          fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: AMBER, marginBottom: 24,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: AMBER }} />
          Double Bay, Sydney · Est. 2018
        </div>

        <div style={{ opacity: titleOp }}>
          <div style={{
            fontSize: 96, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.95,
            color: CREAM, marginBottom: 8,
          }}>The Loft</div>
          <div style={{
            fontSize: 80, fontWeight: 800, letterSpacing: '-0.04em',
            background: `linear-gradient(135deg, ${AMBER} 0%, ${GOLD} 60%, #c8823a 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Salon & Spa</div>
        </div>

        <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, marginTop: 20 }}>
          <div style={{ fontSize: 22, color: MUTED, fontWeight: 400 }}>
            What running a fully automated salon looks like.
          </div>
        </div>
      </div>

      {/* ── Act 2: Revenue ── */}
      <div style={{ opacity: revOp, transform: `translateY(${revY}px)`, textAlign: 'center', position: 'absolute' }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: AMBER, marginBottom: 16 }}>
          April 2025 · Monthly Revenue
        </div>
        <div style={{
          fontSize: 120, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1,
          color: CREAM,
        }}>
          ${revValue.toLocaleString()}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20,
          background: 'rgba(74,222,128,0.1)', borderRadius: 24,
          padding: '8px 20px', fontSize: 18, fontWeight: 700, color: '#4ade80',
        }}>
          ↑ 18% vs last month
        </div>
      </div>

      {/* ── Act 3: Stats ── */}
      <div style={{
        position: 'absolute',
        display: 'flex', gap: 24, alignItems: 'flex-start',
      }}>
        <StatCard value="127"  label="New Clients"     change="+23% this month"   opacity={s1op} y={s1y} />
        <StatCard value="94%"  label="Rebooking Rate"  change="+6pts vs 6mo ago"  opacity={s2op} y={s2y} />
        <StatCard value="$178" label="Avg Ticket"      change="+$24 this quarter"  opacity={s3op} y={s3y} />
      </div>

      {/* ── Act 4: SMS ── */}
      <div style={{
        position: 'absolute',
        display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480,
      }}>
        <div style={{ opacity: smsLabelOp }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: AMBER, marginBottom: 12 }}>
            Running automatically · right now
          </div>
          {/* Sender */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `rgba(232,168,110,0.2)`, border: `1px solid rgba(232,168,110,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: AMBER,
            }}>TL</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: CREAM }}>The Loft Salon</div>
              <div style={{ fontSize: 12, color: MUTED }}>Automated · just now</div>
            </div>
          </div>
        </div>

        <SMSBubble
          opacity={sms1op} x={sms1x}
          text={`✅ Confirmed! The Loft Salon & Spa\n\n📅 Wed 23 Apr · 2:00pm\n✂️ Balayage + Blow Dry with Emma\n📍 Knox St, Double Bay 💛`}
        />
        <SMSBubble
          opacity={sms2op} x={sms2x}
          text={`⭐ Hi Sarah! Hope you loved today ✨\n\nIf you have 30 seconds, a Google review would mean the world 🙏 → [link]`}
        />
      </div>
    </div>
  )
}
