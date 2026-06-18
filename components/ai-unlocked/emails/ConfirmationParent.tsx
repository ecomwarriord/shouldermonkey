import {
  Html, Head, Body, Container, Section, Text, Heading,
  Hr, Link, Preview, Font,
} from '@react-email/components'

interface Props {
  parentFirstName: string
  childFirstName: string
  childAge?: string
}

export function ConfirmationParent({ parentFirstName, childFirstName, childAge }: Props) {
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
      <Preview>
        {childFirstName} is on the AI Unlocked waitlist — here's what to expect, {parentFirstName}.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>AI UNLOCKED</Text>
            <Text style={tagline}>RackTheBrain × Shoulder Monkey</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroHeading}>
              {childFirstName} is on the list, {parentFirstName}.
            </Heading>
            <Text style={heroSubtext}>
              You've just done something genuinely useful. Here's everything you need to know.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* What it is */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>What is AI Unlocked?</Heading>
            <Text style={bodyText}>
              A 90-minute live webinar run by Dee (Shoulder Monkey) and Abhinav Verma (RackTheBrain)
              — two practitioners who build with AI every day. Not theory. Not a PowerPoint about the
              future. A live session where attendees build something real.
            </Text>
            <Text style={bodyText}>
              Abhinav has trained 1,000+ young people in Sydney through RackTheBrain. He holds a
              Cert IV in Training and Assessment. He's Tony Buzan-trained and has run national
              competitions in Memory, Rubik's Cube, and Speed Reading. He knows how young people learn.
            </Text>
            <Text style={bodyText}>
              Dee has built 6 live AI products in under 12 months — including ShoulderMonkey,
              a platform with 200+ active users. He's not teaching theory. He's teaching what he does.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Value prop for parent */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>Why this matters for {childFirstName}</Heading>

            <div style={valueRow}>
              <Text style={valueTick}>✓</Text>
              <Text style={valueText}>
                AI is already reshaping what employers look for. Students who can work with AI tools
                have a measurable advantage — not in the future, right now.
              </Text>
            </div>
            <div style={valueRow}>
              <Text style={valueTick}>✓</Text>
              <Text style={valueText}>
                This isn't screen time for entertainment. It's structured, skill-building work.
              </Text>
            </div>
            <div style={valueRow}>
              <Text style={valueTick}>✓</Text>
              <Text style={valueText}>
                The webinar is under 2 hours. It's designed to give {childFirstName} a complete
                experience — not a sample that goes nowhere.
              </Text>
            </div>
          </Section>

          <Hr style={divider} />

          {/* What's next */}
          <Section style={contentSection}>
            <Heading style={sectionHeading}>What happens next</Heading>
            <Text style={bodyText}>
              When the webinar date is confirmed, you'll be the first to know — before the general
              public. Waitlist members get priority access and the founding cohort rate.
            </Text>
            <Text style={bodyText}>
              You'll receive an email with all the details: date, time, what to prepare,
              and exactly what {childFirstName} will walk away with.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Questions */}
          <Section style={ctaSection}>
            <Text style={ctaText}>
              Questions? Hit reply — we actually read them.
            </Text>
            <Link href="https://shouldermonkey.co/ai-unlocked" style={ctaButton}>
              Learn more about AI Unlocked →
            </Link>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              AI Unlocked · RackTheBrain × Shoulder Monkey · Sydney, Australia
            </Text>
            <Text style={footerText}>
              You're receiving this because {childFirstName} registered for the AI Unlocked waitlist
              and you provided your consent as their parent or guardian.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

ConfirmationParent.PreviewProps = {
  parentFirstName: 'Alex',
  childFirstName: 'Jordan',
  childAge: '15',
} satisfies Props

export default ConfirmationParent

const body = {
  backgroundColor: '#f8f6ff',
  fontFamily: 'Inter, Arial, sans-serif',
  margin: '0',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
  border: '1px solid rgba(123,63,228,0.12)',
  borderRadius: '16px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 24px rgba(123,63,228,0.06)',
}

const header = {
  background: 'linear-gradient(135deg, #0a0612 0%, #1a0836 100%)',
  padding: '28px 40px 20px',
  textAlign: 'center' as const,
}

const logoText = {
  fontSize: '24px',
  fontWeight: '800',
  letterSpacing: '0.12em',
  color: '#f0edff',
  margin: '0 0 4px',
}

const tagline = {
  fontSize: '11px',
  color: 'rgba(240,237,255,0.5)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  margin: '0',
}

const heroSection = {
  padding: '40px 40px 28px',
  textAlign: 'center' as const,
  background: '#f8f6ff',
}

const heroHeading = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#0a0612',
  margin: '0 0 14px',
  lineHeight: '1.2',
}

const heroSubtext = {
  fontSize: '16px',
  color: 'rgba(10,6,18,0.6)',
  lineHeight: '1.6',
  margin: '0',
}

const divider = {
  borderColor: 'rgba(123,63,228,0.1)',
  margin: '0',
}

const contentSection = {
  padding: '32px 40px',
  background: '#ffffff',
}

const sectionHeading = {
  fontSize: '17px',
  fontWeight: '700',
  color: '#0a0612',
  margin: '0 0 16px',
}

const bodyText = {
  fontSize: '15px',
  color: 'rgba(10,6,18,0.7)',
  lineHeight: '1.7',
  margin: '0 0 14px',
}

const valueRow = {
  display: 'flex' as const,
  gap: '12px',
  marginBottom: '14px',
  alignItems: 'flex-start' as const,
}

const valueTick = {
  color: '#7B3FE4',
  fontWeight: '700',
  fontSize: '16px',
  margin: '0',
  flexShrink: 0,
  lineHeight: '1.7',
}

const valueText = {
  fontSize: '15px',
  color: 'rgba(10,6,18,0.7)',
  lineHeight: '1.7',
  margin: '0',
}

const ctaSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  background: '#f8f6ff',
}

const ctaText = {
  fontSize: '15px',
  color: 'rgba(10,6,18,0.6)',
  margin: '0 0 20px',
}

const ctaButton = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #4623d3, #7B3FE4)',
  color: '#ffffff',
  fontWeight: '700',
  fontSize: '14px',
  padding: '13px 28px',
  borderRadius: '10px',
  textDecoration: 'none',
}

const footer = {
  padding: '20px 40px',
  borderTop: '1px solid rgba(123,63,228,0.08)',
  background: '#f0edff',
}

const footerText = {
  fontSize: '11px',
  color: 'rgba(10,6,18,0.35)',
  textAlign: 'center' as const,
  margin: '0 0 4px',
  lineHeight: '1.5',
}
