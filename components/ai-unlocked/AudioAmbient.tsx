'use client'

import { useEffect, useRef } from 'react'

const CHAPTER_FREQUENCIES = [55, 73, 98, 130, 87]

interface Props {
  chapter: number
}

export function AudioAmbient({ chapter }: Props) {
  const ctxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    function init() {
      if (startedRef.current) return
      startedRef.current = true
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = CHAPTER_FREQUENCIES[0]
      gain.gain.value = 0.025
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      ctxRef.current = ctx
      oscRef.current = osc
      gainRef.current = gain
    }

    window.addEventListener('click', init, { once: true })
    window.addEventListener('touchstart', init, { once: true })

    return () => {
      window.removeEventListener('click', init)
      window.removeEventListener('touchstart', init)
      if (oscRef.current) { try { oscRef.current.stop() } catch {} }
      if (ctxRef.current) { ctxRef.current.close() }
      oscRef.current = null
      ctxRef.current = null
      gainRef.current = null
      startedRef.current = false
    }
  }, [])

  useEffect(() => {
    const osc = oscRef.current
    const ctx = ctxRef.current
    if (!osc || !ctx) return
    osc.frequency.setTargetAtTime(CHAPTER_FREQUENCIES[Math.min(chapter, 4)], ctx.currentTime, 2.0)
  }, [chapter])

  return null
}
