import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

const PIPELINE = [
  { label: 'New Lead',    count: 14, color: COLORS.purple },
  { label: 'Contacted',  count: 9,  color: COLORS.cyan },
  { label: 'Proposal',   count: 6,  color: COLORS.gold },
  { label: 'Won',        count: 4,  color: '#28c840' },
]

const REVIEWS = [
  { name: 'Mia A.',    stars: 5, text: 'Booked in 2 minutes. No back and forth. Incredible!', delay: 60 },
  { name: 'Jake T.',   stars: 5, text: 'Got a reminder, came in, left a review. So seamless.', delay: 130 },
  { name: 'Lisa C.',   stars: 5, text: 'The whole experience felt premium. Will be back!', delay: 200 },
]

const STATS = [
  { value: '+68%',   label: 'Lead-to-client conversion', color: COLORS.cyan },
  { value: '0',      label: 'No-shows this month',       color: COLORS.gold },
  { value: '47→91',  label: 'Google reviews',            color: COLORS.purple },
  { value: '∞',      label: 'Leads chased automatically',color: COLORS.pink },
]

export function Result() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.result.start

  const fadeOut = interpolate(frame, [SCENES.result.end - 40, SCENES.result.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(localFrame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })

  const total = PIPELINE.reduce((a, b) => a + b.count, 0)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: COLORS.void,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '48px 80px',
      opacity: fadeOut,
    }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: `radial-gradient(ellipse, rgba(0,235,193,0.07), transparent 65%)`, filter: 'blur(60px)' }} />

      <div style={{ opacity: titleOpacity, textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-block', padding: '4px 16px', borderRadius: 100,
          background: 'rgba(40,200,64,0.1)', border: `1px solid rgba(40,200,64,0.25)`,
          color: '#28c840', fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14,
        }}>Real Results</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          Open your phone on Monday.<br />
          <span style={{ background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            It all happened while you slept.
          </span>
        </div>
      </div>

      {/* Two column: pipeline + reviews */}
      <div style={{ display: 'flex', gap: 32, width: '100%', maxWidth: 1000, marginBottom: 32 }}>

        {/* Pipeline */}
        <div style={{
          flex: 1,
          opacity: interpolate(localFrame, [30, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.35)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎯 Pipeline</div>
          <div style={{ background: 'rgba(10,6,18,0.9)', border: '1px solid rgba(132,75,254,0.15)', borderRadius: 16, padding: '18px 20px' }}>
            {/* Bar */}
            <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 14, gap: 2 }}>
              {PIPELINE.map((s) => {
                const w = interpolate(localFrame, [40, 100], [0, s.count / total * 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
                return (
                  <div key={s.label} style={{ width: `${w}%`, background: s.color, transition: 'width 0.1s', borderRadius: 3 }} />
                )
              })}
            </div>
            {/* Stages */}
            {PIPELINE.map((s, i) => {
              const rowOpacity = interpolate(localFrame, [50 + i * 20, 70 + i * 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              return (
                <div key={s.label} style={{ opacity: rowOpacity, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: 13, color: 'rgba(240,237,255,0.6)' }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reviews */}
        <div style={{
          flex: 1.2,
          opacity: interpolate(localFrame, [50, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.35)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>⭐ Reviews (auto-requested)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REVIEWS.map((r) => {
              const rOpacity = interpolate(localFrame, [r.delay, r.delay + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
              const rY = interpolate(localFrame, [r.delay, r.delay + 25], [16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
              return (
                <div key={r.name} style={{
                  opacity: rOpacity, transform: `translateY(${rY}px)`,
                  background: 'rgba(10,6,18,0.9)', border: '1px solid rgba(254,200,113,0.15)',
                  borderRadius: 14, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={COLORS.gold}><path d="M6 1l1.2 3.3L11 4.6l-2.7 2.5.7 3.6L6 9.2l-3 1.5.7-3.6L1 4.6l3.8-.3L6 1z"/></svg>
                    ))}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.75)', lineHeight: 1.5, marginBottom: 6 }}>"{r.text}"</div>
                  <div style={{ fontSize: 11, color: 'rgba(240,237,255,0.3)', fontWeight: 600 }}>— {r.name}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 24, width: '100%', maxWidth: 1000,
        opacity: interpolate(localFrame, [300, 340], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {STATS.map((s, i) => {
          const sSpring = spring({ frame: localFrame - 310 - i * 20, fps, config: { damping: 14, mass: 0.7 } })
          return (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center',
              background: 'rgba(10,6,18,0.8)', border: `1px solid ${s.color}20`,
              borderRadius: 14, padding: '18px 12px',
              transform: `scale(${sSpring})`,
            }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,237,255,0.4)', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
