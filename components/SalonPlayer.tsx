'use client'

import { Player } from '@remotion/player'
import { SalonReel } from '../remotion/src/scenes/SalonReel'

export function SalonPlayer() {
  return (
    <Player
      component={SalonReel}
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
