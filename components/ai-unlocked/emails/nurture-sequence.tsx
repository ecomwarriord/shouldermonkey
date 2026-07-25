import type { ReactElement } from 'react'
import { Text, Heading } from '@react-email/components'
import { NurtureShell } from './NurtureShell'

export interface NurtureStep {
  key: string
  day: number
  subject: (firstName: string) => string
  preview: string
  render: (p: { firstName: string; unsubUrl: string }) => ReactElement
}

const h = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#f0edff',
  margin: '0 0 16px',
  lineHeight: 1.3,
}

const p = {
  fontSize: '15px',
  color: 'rgba(240,237,255,0.75)',
  lineHeight: 1.65,
  margin: '0 0 14px',
}

const em = {
  ...p,
  color: '#c9b8ff',
  fontWeight: 600,
}

const promptBox = {
  fontSize: '13px',
  color: '#e8e0ff',
  lineHeight: 1.6,
  margin: '0 0 14px',
  padding: '14px 16px',
  backgroundColor: 'rgba(123,63,228,0.12)',
  border: '1px solid rgba(123,63,228,0.3)',
  borderRadius: '8px',
  fontFamily: 'Consolas, Menlo, monospace',
}

export const NURTURE_STEPS: NurtureStep[] = [
  {
    key: 'story',
    day: 2,
    subject: (n) => `The thing nobody tells you about AI, ${n}`,
    preview: 'It has nothing to do with being technical.',
    render: ({ firstName, unsubUrl }) => (
      <NurtureShell preview="It has nothing to do with being technical." unsubUrl={unsubUrl}>
        <Heading style={h}>Quick story for you, {firstName}.</Heading>
        <Text style={p}>
          Twelve months ago, Dee was not a programmer. No computer science degree.
          No team. No investors.
        </Text>
        <Text style={p}>
          Today he has six live products on the internet. A voice assistant.
          A tutoring app kids use every week. Ordering systems real businesses run on.
          All built by one person, working with AI.
        </Text>
        <Text style={p}>
          Here is the part nobody tells you: the people winning with AI right now
          are not the smartest people in the room. They are the ones who started
          earliest and practised the most.
        </Text>
        <Text style={em}>
          That is a game anyone can enter. Including you.
        </Text>
        <Text style={p}>
          So here is a question, and we actually read every reply: if you could
          build one thing with AI, what would it be? Hit reply and tell us in one
          sentence.
        </Text>
        <Text style={p}>Dee &amp; Abhinav</Text>
      </NurtureShell>
    ),
  },
  {
    key: 'quickwin',
    day: 5,
    subject: () => 'Try this tonight (takes 10 minutes)',
    preview: 'A real AI exercise, not theory. Parents, do it together.',
    render: ({ firstName, unsubUrl }) => (
      <NurtureShell preview="A real AI exercise, not theory. Parents, do it together." unsubUrl={unsubUrl}>
        <Heading style={h}>A 10-minute exercise, {firstName}.</Heading>
        <Text style={p}>
          Most people use AI like a search engine. One question, one answer, done.
          That is why they get average results.
        </Text>
        <Text style={p}>
          Tonight, open ChatGPT or Claude (both free) and paste this:
        </Text>
        <Text style={promptBox}>
          I am [your age] and interested in [something you love]. Interview me,
          one question at a time, to understand what I am good at. After 5
          questions, give me 3 ideas for something real I could build or start
          this month, with the exact first step for each.
        </Text>
        <Text style={p}>
          The difference is the interview. When AI asks you questions first, it
          stops being generic and starts being about you.
        </Text>
        <Text style={p}>
          Parents: do this together with your child. Ten minutes. You will both
          see what this is actually about.
        </Text>
        <Text style={em}>
          Reply with the best idea it gives you. We read every one.
        </Text>
        <Text style={p}>Dee &amp; Abhinav</Text>
      </NurtureShell>
    ),
  },
  {
    key: 'proof',
    day: 9,
    subject: () => '6 products. 12 months. Zero employees.',
    preview: 'What one person working with AI can actually ship.',
    render: ({ firstName, unsubUrl }) => (
      <NurtureShell preview="What one person working with AI can actually ship." unsubUrl={unsubUrl}>
        <Heading style={h}>Proof beats promises, {firstName}.</Heading>
        <Text style={p}>
          We said AI Unlocked is not theory. Here is what that means.
        </Text>
        <Text style={p}>
          In the last 12 months, Dee has shipped: a voice-controlled AI assistant,
          an AI tutoring platform, a food ordering site for a real Australian
          restaurant, a fitness app with an AI food scanner, and enterprise software
          used by actual businesses. No team. No funding. AI was the team.
        </Text>
        <Text style={p}>
          Ten years ago, each of those needed developers, designers and months of
          work. Now one focused person can do it. That shift is the whole story,
          and almost nobody your age (or your kids&apos; age) has been shown how.
        </Text>
        <Text style={em}>
          At the live webinar, you will watch it happen in real time. Something
          built from nothing, live, no edits.
        </Text>
        <Text style={p}>
          Tickets are not on sale yet. Waitlist members hear first. That is you.
        </Text>
        <Text style={p}>Dee &amp; Abhinav</Text>
      </NurtureShell>
    ),
  },
  {
    key: 'insight',
    day: 14,
    subject: () => 'School will not teach this one',
    preview: 'Not their fault. But it leaves a gap you can use.',
    render: ({ firstName, unsubUrl }) => (
      <NurtureShell preview="Not their fault. But it leaves a gap you can use." unsubUrl={unsubUrl}>
        <Heading style={h}>An uncomfortable truth, {firstName}.</Heading>
        <Text style={p}>
          Around 95% of Australian schools have no structured AI curriculum.
        </Text>
        <Text style={p}>
          That is not a criticism of teachers. Curriculums take years to change.
          AI changes every few weeks. The system simply cannot keep up.
        </Text>
        <Text style={p}>
          Most people look at that and see a problem. We see a window. When a
          skill is this valuable and schools are not teaching it yet, the people
          who learn it anyway get years of head start.
        </Text>
        <Text style={p}>
          The last time a window like this opened was the early internet. The
          teenagers who took it seriously back then did not wait for permission.
        </Text>
        <Text style={em}>
          The window is open right now. That is why AI Unlocked exists.
        </Text>
        <Text style={p}>
          One live session in August. 90 minutes. Real builds, real tools, and a
          roadmap you can follow the next day. Details very soon.
        </Text>
        <Text style={p}>Dee &amp; Abhinav</Text>
      </NurtureShell>
    ),
  },
  {
    key: 'invite',
    day: 21,
    subject: (n) => `${n}, you are first in line for August`,
    preview: 'Early bird opens to the waitlist before anyone else.',
    render: ({ firstName, unsubUrl }) => (
      <NurtureShell preview="Early bird opens to the waitlist before anyone else." unsubUrl={unsubUrl}>
        <Heading style={h}>Here is what happens next, {firstName}.</Heading>
        <Text style={p}>
          AI Unlocked goes live in August, Sydney time. 90 minutes with Dee and
          Abhinav. Live demos, not slides. You leave with tools you will use the
          same week.
        </Text>
        <Text style={p}>Because you are on the waitlist, you get:</Text>
        <Text style={p}>
          1. First access to tickets, 48 hours before the public.<br />
          2. Founding early bird pricing, the lowest it will ever be.<br />
          3. First pick of limited seats.
        </Text>
        <Text style={p}>
          Two small things to do now so you do not miss the drop:
        </Text>
        <Text style={p}>
          Add info@shouldermonkey.co to your contacts so the ticket email lands
          in your inbox, not spam. And if you know someone who should be in the
          room with you, forward them this email. They can join the waitlist at
          shouldermonkey.co/ai-unlocked.
        </Text>
        <Text style={em}>
          Want us to flag you for the first round? Reply with one word: KEEN.
        </Text>
        <Text style={p}>See you in August.<br />Dee &amp; Abhinav</Text>
      </NurtureShell>
    ),
  },
]
