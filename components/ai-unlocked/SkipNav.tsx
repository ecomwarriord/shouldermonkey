export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9998] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:text-sm"
      style={{ background: 'var(--ai-accent, #844bfe)', color: '#fff' }}
    >
      Skip to main content
    </a>
  )
}
