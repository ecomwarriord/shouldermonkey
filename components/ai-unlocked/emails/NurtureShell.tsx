import {
  Html, Head, Body, Container, Section, Text, Hr, Link, Preview, Font,
} from '@react-email/components'
import type { ReactNode } from 'react'

interface Props {
  preview: string
  unsubUrl: string
  children: ReactNode
}

export function NurtureShell({ preview, unsubUrl, children }: Props) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{ url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2', format: 'woff2' }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>AI UNLOCKED</Text>
            <Text style={tagline}>RackTheBrain × Shoulder Monkey</Text>
          </Section>

          <Section style={content}>{children}</Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              AI Unlocked · RackTheBrain × Shoulder Monkey · Sydney, Australia
            </Text>
            <Text style={footerDisclaimer}>
              Results depend on individual effort and application. Examples are
              illustrative, not guaranteed outcomes.
            </Text>
            <Text style={footerText}>
              <Link href={unsubUrl} style={footerLink}>Unsubscribe</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  margin: 0,
  padding: '20px 0',
  backgroundColor: '#030108',
  fontFamily: "Inter, -apple-system, 'Segoe UI', Arial, sans-serif",
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#0a0612',
  border: '1px solid rgba(123,63,228,0.2)',
  borderRadius: '16px',
  overflow: 'hidden' as const,
}

const header = {
  background: 'linear-gradient(135deg,#1a0836 0%,#0a0612 100%)',
  padding: '28px 40px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid rgba(123,63,228,0.15)',
}

const logoText = {
  fontSize: '22px',
  fontWeight: 800,
  letterSpacing: '0.12em',
  color: '#f0edff',
  margin: '0 0 4px',
}

const tagline = {
  fontSize: '10px',
  color: 'rgba(240,237,255,0.4)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: 0,
}

const content = {
  padding: '32px 40px',
}

const divider = {
  borderColor: 'rgba(123,63,228,0.1)',
  margin: 0,
}

const footer = {
  padding: '20px 40px',
  backgroundColor: 'rgba(0,0,0,0.3)',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '11px',
  color: 'rgba(240,237,255,0.25)',
  margin: '0 0 4px',
}

const footerDisclaimer = {
  fontSize: '10px',
  color: 'rgba(240,237,255,0.2)',
  margin: '0 0 4px',
}

const footerLink = {
  color: 'rgba(240,237,255,0.3)',
  textDecoration: 'underline',
}
