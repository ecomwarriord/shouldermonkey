import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

const WORKFLOW_STEPS = [
  { icon: '📅', label: 'Appointment completed',      color: COLORS.purple,  delay: 20  },
  { icon: '⭐', label: 'Review request SMS sent',     color: COLORS.gold,    delay: 80  },
  { icon: '📊', label: 'Contact moved: Active Client',color: COLORS.cyan,    delay: 140 },
  { icon: '📅', label: 'Rebooking reminder: 6 weeks', color: COLORS.purple,  delay: 200 },
  { icon: '💬', label: 'Google review received ⭐⭐⭐⭐⭐', color: COLORS.gold, delay: 280 },
  { icon: '🔔', label: 'Owner notified: New 5★ review',color: COLORS.cyan,   delay: 330 },
]

const NO_SHOW_STEPS = [
  { icon: '❌', label: 'No-show detected',                color: COLORS.pink,    delay: 60  },
  { icon: '📱', label: 'SMS sent: "Did you forget…"',    color: COLORS.purple,  delay: 110 },
  { icon: '📅', label: 'New booking link included',       color: COLORS.cyan,    delay: 160 },
  { icon: '✅', label: 'Client rebooked via SMS link',    color: COLORS.cyan,    delay: 330 },
  { icon: '💰', label: 'Revenue recovered: $185',        color: COLORS.gold,    delay: 390 },
]

export function Automation() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.automation.start

  const fadeOut = interpolate(frame, [SCENES.automation.end - 40, SCENES.automation.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const titleOpacity = interpolate(localFrame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })

  // Switch between the two workflow demos at frame 360
  const showNoShow = localFrame >= 380
  const sectionFade = interpolate(localFrame, [360, 390], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const sectionFade2 = interpolate(localFrame, [380, 410], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

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
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: `radial-gradient(ellipse, rgba(132,75,254,0.1), transparent 65%)`, filter: 'blur(60px)' }} />

      <div style={{ opacity: titleOpacity, textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-block', padding: '4px 16px', borderRadius: 100,
          background: 'rgba(0,235,193,0.08)', border: `1px solid rgba(0,235,193,0.2)`,
          color: COLORS.cyan, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14,
        }}>Automated Workflows</div>
        <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          {!showNoShow ? (
            <>After every appointment —<br /><span style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>reviews build themselves.</span></>
          ) : (
            <>No-show at 2pm —<br /><span style={{ background: `linear-gradient(135deg, ${COLORS.pink}, ${COLORS.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>revenue recovered by 2:05pm.</span></>
          )}
        </div>
      </div>

      {/* Workflow 1: Review automation */}
      {!showNoShow && (
        <div style={{ opacity: sectionFade, width: '100%', maxWidth: 720 }}>
          <WorkflowTimeline steps={WORKFLOW_STEPS} localFrame={localFrame} fps={fps} />
        </div>
      )}

      {/* Workflow 2: No-show recovery */}
      {showNoShow && (
        <div style={{ opacity: sectionFade2, width: '100%', maxWidth: 720 }}>
          <WorkflowTimeline steps={NO_SHOW_STEPS} localFrame={localFrame - 380} fps={fps} />
        </div>
      )}

      {/* Bottom stat */}
      {localFrame > 600 && (
        <div style={{
          marginTop: 32,
          opacity: interpolate(localFrame, [600, 630], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'flex', gap: 40,
        }}>
          {[
            { value: '0', label: 'Manual follow-ups needed' },
            { value: '24/7', label: 'Automations running' },
            { value: '100%', label: 'Done-for-you' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, background: `linear-gradient(135deg, ${COLORS.purpleLight}, ${COLORS.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(240,237,255,0.4)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WorkflowTimeline({ steps, localFrame, fps }: { steps: typeof WORKFLOW_STEPS; localFrame: number; fps: number }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Vertical line */}
      <div style={{
        position: 'absolute', left: 20, top: 24, bottom: 0, width: 2,
        background: 'rgba(132,75,254,0.1)',
      }}>
        <div style={{
          width: '100%',
          height: `${Math.min(100, interpolate(localFrame, [0, steps[steps.length - 1].delay + 60], [0, 100], { extrapolateRight: 'clamp' }))}%`,
          background: `linear-gradient(to bottom, ${COLORS.purple}, ${COLORS.cyan})`,
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {steps.map((step) => {
          const stepOpacity = interpolate(localFrame, [step.delay, step.delay + 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          const stepX = interpolate(localFrame, [step.delay, step.delay + 25], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

          return (
            <div key={step.label} style={{
              opacity: stepOpacity,
              transform: `translateX(${stepX}px)`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              {/* Node */}
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: `${step.color}15`, border: `2px solid ${step.color}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, boxShadow: `0 0 16px ${step.color}30`,
              }}>
                {step.icon}
              </div>
              {/* Label */}
              <div style={{
                background: 'rgba(10,6,18,0.8)',
                border: `1px solid ${step.color}20`,
                borderRadius: 12, padding: '10px 16px', flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.white }}>{step.label}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: step.color,
                  padding: '2px 8px', borderRadius: 100,
                  background: `${step.color}15`,
                }}>AUTO</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
