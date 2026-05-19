'use client'

import { Player } from '@remotion/player'
import { MortgageBrokerReel } from '../remotion/src/scenes/MortgageBrokerReel'

export function MortgageBrokerPlayer() {
  return (
    <Player
      component={MortgageBrokerReel}
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
