import { useCurrentFrame, interpolate, spring, useVideoConfig, Easing } from 'remotion'
import { COLORS, SCENES } from '../constants'

const MESSAGES = [
  { from: 'Mia Anderson', channel: 'Instagram DM', text: "Hey! How much is a balayage? Do you have anything this week? 😊", time: '6:42 PM', avatar: 'MA' },
]

const AUTO_REPLY = {
  text: "Hi Mia! 👋 We'd love to help. Here's our balayage pricing and availability — click below to book your spot before it fills up!",
  sub: '+ Booking link sent automatically',
  time: '6:42 PM (23 seconds later)',
}

const BOOKING_CONFIRM = {
  text: 'Mia Anderson has booked: Balayage — Saturday 10:00am',
  sub: 'Deposit collected · Confirmation sent · Reminder scheduled',
}

export function LeadCapture() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame - SCENES.leadCapture.start

  const fadeOut = interpolate(frame, [SCENES.leadCapture.end - 40, SCENES.leadCapture.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  // Title
  const titleOpacity = interpolate(localFrame, [0, 25], [0, 1], { extrapolateRight: 'clamp' })

  // Phone notification slides in
  const notifSpring = spring({ frame: localFrame - 30, fps, config: { damping: 14, mass: 0.7 } })
  const notifX = interpolate(notifSpring, [0, 1], [-60, 0])

  // Dashboard panel slides in from right
  const dashSpring = spring({ frame: localFrame - 60, fps, config: { damping: 14, mass: 0.7 } })
  const dashX = interpolate(dashSpring, [0, 1], [60, 0])

  // Auto-reply appears
  const replyOpacity = interpolate(localFrame, [120, 145], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const replyY = interpolate(localFrame, [120, 145], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })

  // Timer countdown 0→23s
  const timerSeconds = Math.min(23, Math.floor(interpolate(localFrame, [80, 135], [0, 23], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))

  // Booking confirmed
  const bookingOpacity = interpolate(localFrame, [220, 250], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

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
      {/* Glow */}
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: 500, height: 400, background: `radial-gradient(ellipse, rgba(132,75,254,0.1), transparent 65%)`, filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', top: '40%', right: '20%', width: 400, height: 300, background: `radial-gradient(ellipse, rgba(0,235,193,0.08), transparent 65%)`, filter: 'blur(50px)' }} />

      {/* Title */}
      <div style={{ opacity: titleOpacity, textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-block', padding: '4px 16px', borderRadius: 100,
          background: 'rgba(132,75,254,0.1)', border: `1px solid rgba(132,75,254,0.25)`,
          color: COLORS.purpleLight, fontSize: 12, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14,
        }}>Lead Capture + Auto-Reply</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.white, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
          A lead arrives at 6:42pm.<br />
          <span style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Shoulder Monkey handles it in 23 seconds.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', width: '100%', maxWidth: 1000 }}>

        {/* Left: "Phone" Instagram DM */}
        <div style={{
          flex: 1,
          opacity: interpolate(localFrame, [20, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateX(${notifX}px)`,
        }}>
          <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.35)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            📱 Incoming — Instagram DM
          </div>
          <div style={{
            background: 'rgba(15,10,30,0.95)',
            border: '1px solid rgba(132,75,254,0.15)',
            borderRadius: 16, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `linear-gradient(135deg, ${COLORS.pink}40, ${COLORS.purple}40)`,
                border: `1px solid ${COLORS.pink}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: COLORS.pink,
              }}>MA</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.white }}>Mia Anderson</div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,255,0.35)' }}>via Instagram DM · {MESSAGES[0].time}</div>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              padding: '12px 14px', fontSize: 14, color: 'rgba(240,237,255,0.8)', lineHeight: 1.6,
            }}>
              {MESSAGES[0].text}
            </div>
          </div>

          {/* Timer */}
          {localFrame > 75 && (
            <div style={{
              marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
              opacity: interpolate(localFrame, [75, 95], [0, 1], { extrapolateRight: 'clamp' }),
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.cyan, boxShadow: `0 0 8px ${COLORS.cyan}` }} />
              <span style={{ fontSize: 13, color: COLORS.cyan, fontWeight: 600 }}>
                Shoulder Monkey responding... {timerSeconds}s
              </span>
            </div>
          )}

          {/* Auto reply */}
          {localFrame > 118 && (
            <div style={{
              opacity: replyOpacity,
              transform: `translateY(${replyY}px)`,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.35)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ✅ Auto-reply sent
              </div>
              <div style={{
                background: 'rgba(0,235,193,0.06)',
                border: '1px solid rgba(0,235,193,0.2)',
                borderRadius: 16, padding: 20,
              }}>
                <div style={{ fontSize: 14, color: 'rgba(240,237,255,0.8)', lineHeight: 1.6, marginBottom: 8 }}>
                  {AUTO_REPLY.text}
                </div>
                <div style={{ fontSize: 12, color: COLORS.cyan, fontWeight: 600 }}>{AUTO_REPLY.sub}</div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,255,0.25)', marginTop: 6 }}>{AUTO_REPLY.time}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Dashboard CRM entry */}
        <div style={{
          flex: 1,
          opacity: interpolate(localFrame, [55, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `translateX(${dashX}px)`,
        }}>
          <div style={{ fontSize: 13, color: 'rgba(240,237,255,0.35)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🎯 Shoulder Monkey CRM
          </div>
          <div style={{
            background: 'rgba(10,6,18,0.95)',
            border: '1px solid rgba(132,75,254,0.2)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.white }}>New Lead Created</div>
              <div style={{
                padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                background: 'rgba(132,75,254,0.15)', color: COLORS.purpleLight,
              }}>Auto-captured</div>
            </div>
            {/* Fields */}
            <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Name',    value: 'Mia Anderson' },
                { label: 'Source',  value: 'Instagram DM' },
                { label: 'Status',  value: 'New Lead → Contacted' },
                { label: 'Stage',   value: 'Awaiting booking' },
              ].map((f, i) => (
                <div key={f.label} style={{
                  opacity: interpolate(localFrame, [70 + i * 15, 90 + i * 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 11, color: 'rgba(240,237,255,0.3)', fontWeight: 600, minWidth: 70 }}>{f.label}</span>
                  <span style={{ fontSize: 12, color: COLORS.white, fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
            {/* Automation triggered */}
            {localFrame > 130 && (
              <div style={{
                margin: '0 14px 14px',
                opacity: interpolate(localFrame, [130, 150], [0, 1], { extrapolateRight: 'clamp' }),
                background: 'rgba(0,235,193,0.06)', border: '1px solid rgba(0,235,193,0.15)',
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.cyan, marginBottom: 4 }}>⚡ Automation triggered</div>
                <div style={{ fontSize: 11, color: 'rgba(240,237,255,0.5)', lineHeight: 1.5 }}>
                  • Auto-reply sent (Instagram)<br />
                  • Booking link delivered<br />
                  • Follow-up scheduled in 2 hours (if no booking)
                </div>
              </div>
            )}
          </div>

          {/* Booking confirmed */}
          {localFrame > 218 && (
            <div style={{
              marginTop: 16,
              opacity: bookingOpacity,
              background: 'rgba(132,75,254,0.08)', border: '1px solid rgba(132,75,254,0.25)',
              borderRadius: 14, padding: '14px 18px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white, marginBottom: 6 }}>📅 {BOOKING_CONFIRM.text}</div>
              <div style={{ fontSize: 11, color: COLORS.cyan, fontWeight: 600 }}>{BOOKING_CONFIRM.sub}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
