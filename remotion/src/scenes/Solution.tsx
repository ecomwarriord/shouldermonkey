import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

const FEATURES = [
  { icon: '🎯', label: 'CRM & Pipelines',      color: COLORS.purple },
  { icon: '📅', label: 'Bookings & Calendar',   color: COLORS.cyan },
  { icon: '⚡', label: 'Automation',            color: COLORS.pink },
  { icon: '⭐', label: 'Reputation',            color: COLORS.gold },
  { icon: '📱', label: '2-Way SMS',             color: COLORS.cyan },
  { icon: '📧', label: 'Email Marketing',       color: COLORS.purple },
  { icon: '🌐', label: 'Website Builder',       color: COLORS.pink },
  { icon: '📊', label: 'Analytics',             color: COLORS.gold },
  { icon: '📞', label: 'Call Tracking',         color: COLORS.cyan },
  { icon: '📋', label: 'Invoices',              color: COLORS.purple },
  { icon: '📲', label: 'Social Planner',        color: COLORS.pink },
  { icon: '🔧', label: 'Sales Funnels',         color: COLORS.gold },
]

export function Solution() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.solution.start

  const fadeOut = interpolate(frame, [SCENES.solution.end - 40, SCENES.solution.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const titleOpacity = interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = interpolate(localFrame, [0, 30], [30, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  // Central hub pulse
  const hubPulse = Math.sin(localFrame * 0.12) * 0.08 + 1

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(135deg, ${COLORS.void}, #0d0520 50%, ${COLORS.void})`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '50px 80px',
      opacity: fadeOut,
    }}>
      {/* Purple glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 500,
        background: `radial-gradient(ellipse, rgba(132,75,254,0.15), transparent 65%)`,
        filter: 'blur(60px)',
      }} />

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px', borderRadius: 100,
          background: 'rgba(132,75,254,0.1)', border: `1px solid rgba(132,75,254,0.25)`,
          color: COLORS.purpleLight, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
        }}>The Solution</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          Replace all of them with{' '}
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.purpleLight}, ${COLORS.purple})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Shoulder Monkey.</span>
        </div>
      </div>

      {/* Hub + feature orbit layout */}
      <div style={{ position: 'relative', width: 700, height: 340 }}>
        {/* Central hub */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%,-50%) scale(${hubPulse})`,
          width: 100, height: 100, borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40,
          boxShadow: `0 0 0 16px rgba(132,75,254,0.08), 0 0 60px rgba(132,75,254,0.4)`,
          zIndex: 10,
        }}>🐒</div>

        {/* Feature cards around the hub */}
        {FEATURES.map((feat, i) => {
          const angle = (i / FEATURES.length) * 2 * Math.PI - Math.PI / 2
          const radius = 290
          const x = Math.cos(angle) * radius + 350
          const y = Math.sin(angle) * radius + 170

          const delay = 30 + i * 18
          const cardSpring = spring({ frame: localFrame - delay, fps, config: { damping: 16, mass: 0.6 } })
          const cardOpacity = interpolate(localFrame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

          // Line from hub to card
          const lineProgress = interpolate(localFrame, [delay, delay + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

          const cx = 350, cy = 170
          const dx = x - cx, dy = y - cy
          const lineLen = Math.sqrt(dx * dx + dy * dy)

          return (
            <svg key={feat.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
              <line
                x1={cx} y1={cy}
                x2={cx + dx * lineProgress}
                y2={cy + dy * lineProgress}
                stroke={feat.color}
                strokeWidth={1}
                strokeOpacity={0.25}
                strokeDasharray="4 4"
              />
              <foreignObject
                x={x - 52} y={y - 22}
                width={104} height={44}
                style={{ opacity: cardOpacity, transform: `scale(${cardSpring})`, transformOrigin: `${x}px ${y}px` }}
              >
                <div style={{
                  background: 'rgba(10,6,18,0.9)',
                  border: `1px solid ${feat.color}30`,
                  borderRadius: 10,
                  padding: '5px 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ fontSize: 14 }}>{feat.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: feat.color }}>{feat.label}</span>
                </div>
              </foreignObject>
            </svg>
          )
        })}
      </div>

      {/* Price comparison */}
      {localFrame > 260 && (
        <div style={{
          opacity: interpolate(localFrame, [260, 290], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'flex', alignItems: 'center', gap: 32, marginTop: 24,
          background: 'rgba(0,235,193,0.05)', border: '1px solid rgba(0,235,193,0.15)',
          borderRadius: 14, padding: '16px 32px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.4)', marginBottom: 4 }}>12 tools separately</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.pink, textDecoration: 'line-through', opacity: 0.7 }}>US$1,412/mo</div>
          </div>
          <div style={{ fontSize: 28, color: 'rgba(240,237,255,0.2)' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.4)', marginBottom: 4 }}>Shoulder Monkey Platinum</div>
            <div style={{ fontSize: 32, fontWeight: 900, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>A$478/mo</div>
          </div>
        </div>
      )}
    </div>
  )
}
