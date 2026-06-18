import {
  Html, Head, Body, Container, Section, Text, Heading,
  Hr, Preview,
} from '@react-email/components'

interface Props {
  registrantName: string
  registrantEmail: string
  registrantPhone: string
  role: string
  age?: string
  ageRange?: string
  parentName?: string
  parentEmail?: string
}

export function AbhiNotification({
  registrantName,
  registrantEmail,
  registrantPhone,
  role,
  age,
  ageRange,
  parentName,
  parentEmail,
}: Props) {
  const roleLabel = role === 'student' ? 'Student (13+)'
    : role === 'parent' ? 'Parent / Guardian'
    : role === 'educator' ? 'Educator / Professional'
    : role

  return (
    <Html>
      <Head />
      <Preview>New AI Unlocked signup: {registrantName} ({roleLabel})</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>AI UNLOCKED · NEW SIGNUP</Text>
          </Section>

          <Section style={content}>
            <Heading style={heading}>New waitlist registration</Heading>

            <table style={table}>
              <tbody>
                <tr>
                  <td style={labelCell}>Name</td>
                  <td style={valueCell}>{registrantName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Email</td>
                  <td style={valueCell}>{registrantEmail}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Phone</td>
                  <td style={valueCell}>{registrantPhone || '—'}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Role</td>
                  <td style={valueCell}>{roleLabel}</td>
                </tr>
                {age && (
                  <tr>
                    <td style={labelCell}>Age</td>
                    <td style={valueCell}>{age}</td>
                  </tr>
                )}
                {ageRange && (
                  <tr>
                    <td style={labelCell}>Age range</td>
                    <td style={valueCell}>{ageRange}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {parentName && (
              <>
                <Hr style={divider} />
                <Text style={sectionLabel}>Parent / Guardian (under 18 — consent provided)</Text>
                <table style={table}>
                  <tbody>
                    <tr>
                      <td style={labelCell}>Name</td>
                      <td style={valueCell}>{parentName}</td>
                    </tr>
                    {parentEmail && (
                      <tr>
                        <td style={labelCell}>Email</td>
                        <td style={valueCell}>{parentEmail}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            <Hr style={divider} />

            <Text style={footerNote}>
              This is an automated notification from AI Unlocked (shouldermonkey.co/ai-unlocked).
              All registrant details are also in GHL.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

AbhiNotification.PreviewProps = {
  registrantName: 'Jordan Smith',
  registrantEmail: 'jordan@example.com',
  registrantPhone: '+61 400 000 000',
  role: 'student',
  age: '16',
  ageRange: 'age-15-17',
  parentName: 'Alex Smith',
  parentEmail: 'alex@example.com',
} satisfies Props

export default AbhiNotification

const body = {
  backgroundColor: '#f4f4f5',
  fontFamily: 'Arial, sans-serif',
  margin: '0',
  padding: '20px 0',
}

const container = {
  backgroundColor: '#ffffff',
  maxWidth: '520px',
  margin: '0 auto',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  border: '1px solid #e4e4e7',
}

const header = {
  backgroundColor: '#0a0612',
  padding: '20px 32px',
}

const logoText = {
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  color: '#a673ff',
  margin: '0',
  textTransform: 'uppercase' as const,
}

const content = {
  padding: '28px 32px',
}

const heading = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#09090b',
  margin: '0 0 20px',
}

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const labelCell = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#71717a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top' as const,
  width: '120px',
}

const valueCell = {
  fontSize: '14px',
  color: '#18181b',
  padding: '8px 0',
  verticalAlign: 'top' as const,
}

const divider = {
  borderColor: '#e4e4e7',
  margin: '16px 0',
}

const sectionLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#7B3FE4',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  margin: '0 0 12px',
}

const footerNote = {
  fontSize: '12px',
  color: '#a1a1aa',
  lineHeight: '1.5',
  margin: '0',
}
