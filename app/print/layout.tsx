import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${jakarta.variable} ${inter.variable}`}>
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
      {children}
    </div>
  )
}
