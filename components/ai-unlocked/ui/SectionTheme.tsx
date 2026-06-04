'use client'

interface SectionThemeProps {
  theme: 'dark' | 'light' | 'promise'
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionTheme({ theme, children, className = '', id }: SectionThemeProps) {
  return (
    <div
      id={id}
      data-theme={theme === 'dark' ? undefined : theme}
      className={className}
      style={{
        background: theme === 'promise' ? '#000000' : theme === 'light' ? 'var(--ai-bg, #f8f6ff)' : 'var(--ai-bg, #030108)',
        color: theme === 'light' ? 'var(--ai-text, #0a0612)' : 'var(--ai-text, #f0edff)',
        transition: 'background 0.5s ease, color 0.4s ease',
      }}
    >
      {children}
    </div>
  )
}
