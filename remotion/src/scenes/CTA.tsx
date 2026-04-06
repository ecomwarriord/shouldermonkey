import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

export function CTA() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.cta.start

  const fadeIn = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  const logoSpring = spring({ frame: localFrame - 10, fps, config: { damping: 14, mass: 0.8 } })
  const headlineOpacity = interpolate(localFrame, [30, 55], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(localFrame, [30, 55], [24, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const subOpacity = interpolate(localFrame, [55, 75], [0, 1], { extrapolateRight: 'clamp' })
  const btnOpacity = interpolate(localFrame, [75, 100], [0, 1], { extrapolateRight: 'clamp' })
  const btnScale = spring({ frame: localFrame - 75, fps, config: { damping: 14, mass: 0.6 } })

  // Animated "typing" trust line
  const trustItems = ['14-day free trial', 'No lock-in contracts', 'Live same day', 'Cancel anytime']
  const trustOpacity = interpolate(localFrame, [110, 135], [0, 1], { extrapolateRight: 'clamp' })

  // Pulsing glow on the button
  const glowPulse = Math.sin(localFrame * 0.15) * 0.4 + 0.6

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.void,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      opacity: fadeIn,
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(132,75,254,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(132,75,254,0.035) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Big glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 900, height: 600,
        background: `radial-gradient(ellipse, rgba(132,75,254,0.2), rgba(0,235,193,0.06) 40%, transparent 70%)`,
        filter: 'blur(80px)',
      }} />

      {/* Logo */}
      <div style={{ transform: `scale(${logoSpring})`, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
          boxShadow: `0 12px 40px rgba(132,75,254,0.5)`,
        }}>🐒</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: COLORS.white, letterSpacing: '-0.03em' }}>
          SHOULDER <span style={{ color: 'rgba(240,237,255,0.4)', fontWeight: 400 }}>MONKEY</span>
        </div>
      </div>

      {/* Headline */}
      <div style={{ opacity: headlineOpacity, transform: `translateY(${headlineY}px)`, textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 56, fontWeight: 900, color: COLORS.white, lineHeight: 1.05, letterSpacing: '-0.04em' }}>
          Stop losing leads.<br />
          <span style={{
            background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan}, ${COLORS.pink})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Start winning clients.
          </span>
        </div>
      </div>

      {/* Sub */}
      <div style={{ opacity: subOpacity, fontSize: 22, color: 'rgba(240,237,255,0.5)', textAlign: 'center', maxWidth: 640, lineHeight: 1.5, marginBottom: 40 }}>
        One platform. 12+ tools replaced. Pre-configured for your business.<br />
        Operational the same day you sign up.
      </div>

      {/* CTA Button */}
      <div style={{
        opacity: btnOpacity,
        transform: `scale(${btnScale})`,
        marginBottom: 32,
      }}>
        <div style={{
          padding: '20px 56px',
          borderRadius: 100,
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDeep})`,
          fontSize: 22, fontWeight: 800, color: COLORS.white,
          letterSpacing: '-0.01em',
          boxShadow: `0 0 0 ${glowPulse * 12}px rgba(132,75,254,0.12), 0 20px 60px rgba(132,75,254,0.55)`,
        }}>
          Start Your 14-Day Free Trial →
        </div>
      </div>

      {/* URL */}
      {btnOpacity > 0.5 && (
        <div style={{
          opacity: interpolate(localFrame, [105, 125], [0, 1], { extrapolateRight: 'clamp' }),
          fontSize: 18, fontWeight: 700, color: COLORS.purpleLight, marginBottom: 28,
          letterSpacing: '0.02em',
        }}>
          shouldermonkey.co
        </div>
      )}

      {/* Trust row */}
      <div style={{
        opacity: trustOpacity,
        display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {trustItems.map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.cyan }} />
            <span style={{ fontSize: 14, color: 'rgba(240,237,255,0.4)', fontWeight: 500 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
