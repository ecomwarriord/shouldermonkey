import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion'
import { COLORS } from '../constants'

export function Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({ frame, fps, config: { damping: 14, mass: 0.8 }, delay: 0 })
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })

  const tagOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const tagY = interpolate(frame, [35, 55], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  const subOpacity = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  const fadeOut = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.void,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      opacity: fadeOut,
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(132,75,254,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(132,75,254,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Purple glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400,
        background: 'radial-gradient(ellipse, rgba(132,75,254,0.18), transparent 65%)',
        filter: 'blur(60px)',
      }} />

      {/* Logo wordmark */}
      <div style={{
        transform: `scale(${logoScale})`,
        opacity: logoOpacity,
        display: 'flex', alignItems: 'center', gap: 16,
        marginBottom: 32, position: 'relative',
      }}>
        {/* Monkey icon */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36,
          boxShadow: `0 16px 48px rgba(132,75,254,0.5)`,
        }}>🐒</div>
        <div>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: COLORS.white, lineHeight: 1 }}>
            <span style={{ color: COLORS.white }}>SHOULDER</span>
            <span style={{ color: 'rgba(240,237,255,0.4)', fontWeight: 400, marginLeft: 12 }}>MONKEY</span>
          </div>
        </div>
      </div>

      {/* Hook line */}
      <div style={{
        opacity: tagOpacity,
        transform: `translateY(${tagY}px)`,
        fontSize: 28, fontWeight: 700,
        color: COLORS.white,
        textAlign: 'center', maxWidth: 700,
        lineHeight: 1.3, marginBottom: 20,
      }}>
        Stop losing leads.<br />
        <span style={{
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Start winning clients.
        </span>
      </div>

      {/* Sub */}
      <div style={{
        opacity: subOpacity,
        fontSize: 18, color: 'rgba(240,237,255,0.45)',
        textAlign: 'center',
      }}>
        Here's exactly how Shoulder Monkey works in 2 minutes.
      </div>
    </div>
  )
}
