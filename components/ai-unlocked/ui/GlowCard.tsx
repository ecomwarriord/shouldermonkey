'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  variant?: 'default' | 'dim' | 'bright'
}

export function GlowCard({ children, className = '', glowColor = '#844bfe', variant = 'default' }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8])
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8])

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function onMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const glowOpacity = variant === 'dim' ? 0.08 : variant === 'bright' ? 0.25 : 0.12
  const borderOpacity = variant === 'dim' ? 0.1 : variant === 'bright' ? 0.4 : 0.2

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative rounded-2xl p-6 ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `rgba(10,6,18,${variant === 'bright' ? 0.6 : 0.5})`,
          backdropFilter: 'blur(20px)',
          border: `1px solid rgba(${hexToRgb(glowColor)},${borderOpacity})`,
          animation: variant === 'bright' ? 'glow-pulse 3s ease-in-out infinite' : undefined,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '132,75,254'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
