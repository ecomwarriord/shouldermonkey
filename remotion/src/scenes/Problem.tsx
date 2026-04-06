import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

const TOOLS = [
  { name: 'Booking App',        icon: '📅', cost: '$29/mo',  color: '#ff0199' },
  { name: 'Email Marketing',    icon: '📧', cost: '$99/mo',  color: '#ff0199' },
  { name: 'CRM / Spreadsheet',  icon: '📊', cost: '$99/mo',  color: '#ff0199' },
  { name: 'SMS Platform',       icon: '📱', cost: '$99/mo',  color: '#ff0199' },
  { name: 'Review Software',    icon: '⭐', cost: '$299/mo', color: '#ff0199' },
  { name: 'Sales Funnels',      icon: '🔧', cost: '$297/mo', color: '#ff0199' },
  { name: 'Analytics Tool',     icon: '📈', cost: '$49/mo',  color: '#ff0199' },
]

export function Problem() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.problem.start

  const titleOpacity = interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })
  const titleY = interpolate(localFrame, [0, 30], [30, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  const fadeOut = interpolate(frame, [SCENES.problem.end - 40, SCENES.problem.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(to bottom, ${COLORS.void}, #0d0520)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '60px 80px',
      opacity: fadeOut,
    }}>
      {/* Pink glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(255,1,153,0.1), transparent 70%)',
        filter: 'blur(50px)',
      }} />

      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 16px', borderRadius: 100,
          background: 'rgba(255,1,153,0.1)', border: '1px solid rgba(255,1,153,0.25)',
          color: COLORS.pink, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
        }}>The Problem</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          You're paying for{' '}
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.purple})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>12 broken tools.</span>
        </div>
        <div style={{ fontSize: 18, color: 'rgba(240,237,255,0.45)', marginTop: 12 }}>
          None of them talk to each other. Every gap is a lead you just lost.
        </div>
      </div>

      {/* Tool cards flying in */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', maxWidth: 900 }}>
        {TOOLS.map((tool, i) => {
          const delay = 40 + i * 22
          const cardSpring = spring({ frame: localFrame - delay, fps, config: { damping: 16, mass: 0.7 } })
          const cardOpacity = interpolate(localFrame, [delay, delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

          // Red X pulse at the end
          const xPulse = interpolate(localFrame, [260, 280, 300], [0, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

          return (
            <div
              key={tool.name}
              style={{
                opacity: cardOpacity,
                transform: `scale(${cardSpring}) translateY(${interpolate(cardSpring, [0, 1], [20, 0])}px)`,
                background: 'rgba(10,6,18,0.8)',
                border: '1px solid rgba(255,1,153,0.15)',
                borderRadius: 14,
                padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 12,
                minWidth: 200,
                boxShadow: `0 0 0 ${xPulse * 2}px rgba(255,1,153,0.3)`,
              }}
            >
              <span style={{ fontSize: 26 }}>{tool.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.white }}>{tool.name}</div>
                <div style={{ fontSize: 12, color: COLORS.pink, fontWeight: 600 }}>{tool.cost}</div>
              </div>
              {/* Red dot */}
              {localFrame > delay + 30 && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: COLORS.pink,
                  boxShadow: `0 0 8px ${COLORS.pink}`,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Total cost */}
      {localFrame > 280 && (
        <div style={{
          marginTop: 36,
          opacity: interpolate(localFrame, [280, 310], [0, 1], { extrapolateRight: 'clamp' }),
          background: 'rgba(255,1,153,0.06)',
          border: '1px solid rgba(255,1,153,0.2)',
          borderRadius: 16, padding: '20px 40px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, color: 'rgba(240,237,255,0.5)', marginBottom: 8 }}>If you bought them all separately:</div>
          <div style={{ fontSize: 48, fontWeight: 900, background: `linear-gradient(135deg, ${COLORS.pink}, #ff6ac2)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            US$1,412/mo
          </div>
          <div style={{ fontSize: 14, color: 'rgba(240,237,255,0.35)', marginTop: 6 }}>for tools that don't integrate, automate, or fix your follow-up problem</div>
        </div>
      )}
    </div>
  )
}
