import { Syne } from 'next/font/google'
import 'animate.css'

// Syne: bold display font available on Google Fonts — character-driven, works for 13+ audience
const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

export default function AIUnlockedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={syne.variable}>
      <link rel="stylesheet" href="/css/tuesday.min.css" />
      <link rel="stylesheet" href="/css/animation-library.css" />
      {children}
    </div>
  )
}
