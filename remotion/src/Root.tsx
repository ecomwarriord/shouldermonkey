import { Composition, useCurrentFrame, interpolate } from 'remotion'
import { FPS, TOTAL_FRAMES, SCENES } from './constants'
import { Intro } from './scenes/Intro'
import { Problem } from './scenes/Problem'
import { Solution } from './scenes/Solution'
import { LeadCapture } from './scenes/LeadCapture'
import { Automation } from './scenes/Automation'
import { Result } from './scenes/Result'
import { CTA } from './scenes/CTA'

function ShoulderMonkeyDemo() {
  const frame = useCurrentFrame()

  const getScene = () => {
    if (frame < SCENES.intro.end)       return <Intro />
    if (frame < SCENES.problem.end)     return <Problem />
    if (frame < SCENES.solution.end)    return <Solution />
    if (frame < SCENES.leadCapture.end) return <LeadCapture />
    if (frame < SCENES.automation.end)  return <Automation />
    if (frame < SCENES.result.end)      return <Result />
    return <CTA />
  }

  // Scene transition crossfade
  const getTransitionOpacity = () => {
    const boundaries = Object.values(SCENES).map(s => s.end).slice(0, -1)
    for (const b of boundaries) {
      if (frame >= b - 15 && frame <= b + 15) {
        return interpolate(frame, [b - 15, b, b + 15], [1, 0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }
    }
    return 1
  }

  return (
    <div style={{
      width: 1920, height: 1080,
      overflow: 'hidden',
      opacity: getTransitionOpacity(),
    }}>
      {getScene()}
    </div>
  )
}

export function RemotionRoot() {
  return (
    <Composition
      id="ShoulderMonkeyDemo"
      component={ShoulderMonkeyDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}
