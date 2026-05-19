'use client'

import { Player } from '@remotion/player'
import { GymReel } from '../remotion/src/scenes/GymReel'

export function GymPlayer() {
  return (
    <Player
      component={GymReel}
      durationInFrames={360}
      compositionWidth={1280}
      compositionHeight={720}
      fps={30}
      style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
      autoPlay
      loop
      controls={false}
      clickToPlay={false}
      showVolumeControls={false}
    />
  )
}
