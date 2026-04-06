'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.5 })

  const dotX = useSpring(mouseX, { stiffness: 400, damping: 28 })
  const dotY = useSpring(mouseY, { stiffness: 400, damping: 28 })

  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const onDown = () => setClicking(true)
    const onUp   = () => setClicking(false)

    const onEnter = () => setHidden(false)
    const onLeave = () => setHidden(true)

    const addHover = () => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', () => setHovering(true))
        el.addEventListener('mouseleave', () => setHovering(false))
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    addHover()

    // Re-add hover listeners when DOM changes
    const observer = new MutationObserver(addHover)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      observer.disconnect()
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Outer ring */}
      <motion.div
        ref={cursorRef}
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'exclusion',
        }}
        animate={{
          width:   hovering ? 56 : clicking ? 28 : 40,
          height:  hovering ? 56 : clicking ? 28 : 40,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? '#00ebc1' : '#844bfe'}`,
          background: hovering ? 'rgba(0,235,193,0.08)' : 'transparent',
          transition: 'border-color 0.2s ease, background 0.2s ease',
        }} />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        style={{
          position: 'fixed',
          left: dotX,
          top: dotY,
          x: '-50%',
          y: '-50%',
          pointerEvents: 'none',
          zIndex: 99999,
        }}
        animate={{
          width:   clicking ? 6 : 5,
          height:  clicking ? 6 : 5,
          opacity: hidden ? 0 : 1,
          background: hovering ? '#00ebc1' : '#844bfe',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: hovering ? '#00ebc1' : '#844bfe',
          boxShadow: hovering
            ? '0 0 12px rgba(0,235,193,0.8)'
            : '0 0 10px rgba(132,75,254,0.8)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
        }} />
      </motion.div>
    </>
  )
}
