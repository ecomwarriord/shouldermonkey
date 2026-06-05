import type { Metadata } from 'next'
import { CursorFix } from '@/components/ai-unlocked/CursorFix'

export const metadata: Metadata = {
  title: 'Your 7-Day AI Starter Plan — AI Unlocked',
  description: 'A 7-day action plan to go from zero AI experience to having built something real. One tool per day. 30-45 minutes each.',
  robots: { index: false, follow: false },
}

const DAYS = [
  {
    day: 1,
    title: 'Validate your business idea',
    tool: 'ChatGPT',
    toolUrl: 'https://chat.openai.com',
    timeEstimate: '30 minutes',
    color: '#10B981',
    what: 'Before you build anything, you need to know if it is worth building. Today you use AI to stress-test your idea in 30 minutes — faster than any mentor, more brutal than any friend.',
    prompt: `"I have a business idea: [describe your idea in one sentence]. I am targeting [describe who you think your customer is]. Give me: (1) the three biggest reasons this will fail, (2) the one thing that would make it work, and (3) the most important question I should answer before spending a single dollar on it."`,
    deliverable: 'A reality-checked idea and the one question you need to answer before you go further.',
    tip: 'Be honest in your description. The more specific you are, the more useful the feedback.',
  },
  {
    day: 2,
    title: 'Research your market in 5 minutes',
    tool: 'Perplexity',
    toolUrl: 'https://perplexity.ai',
    timeEstimate: '30 minutes',
    color: '#7B3FE4',
    what: 'Perplexity searches the internet for you and cites every source. Use it to understand who already has the problem you are solving and how big that market actually is.',
    prompt: `"I want to understand the market for [your idea]. Tell me: (1) who specifically has this problem and how many of them there are, (2) what solutions already exist and why people are unhappy with them, (3) what they are currently paying to solve this. Include sources."`,
    deliverable: 'A one-paragraph market summary you can use to explain your idea to anyone.',
    tip: 'Ask follow-up questions. If the first answer feels vague, push: "Give me more specific numbers for Australia."',
  },
  {
    day: 3,
    title: 'Write your value proposition',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '45 minutes',
    color: '#FF3366',
    what: 'Your value proposition is the one sentence that tells someone why they should care. It is the most important sentence in your business. Today you write it with AI.',
    prompt: `"I am building [your idea]. My target customer is [who they are]. Their biggest frustration with current solutions is [what they hate]. Write me 5 different one-sentence value propositions that focus on the outcome they get, not the features I offer. Make each one distinct — different angles, different emotions."`,
    deliverable: 'Five value propositions to choose from. Pick the one that makes you think "yes, that is exactly it."',
    tip: 'Read each one out loud. The one that sounds most natural when you say it to a friend is usually the winner.',
  },
  {
    day: 4,
    title: 'Define your brand voice',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '30 minutes',
    color: '#FF3366',
    what: 'Your brand voice is how your business sounds — in every post, every email, every message. Getting this right early means everything you create sounds consistent, not random.',
    prompt: `"I am building a business called [name or working title]. My target customer is [who they are]. Three brands whose tone I admire are [list three — can be anything from any industry]. Write me a brand voice guide with: (1) three words that define my tone, (2) five words I should always use, (3) five words I should never use, (4) two example sentences written in my voice."`,
    deliverable: 'A one-page brand voice guide. Save this. You will paste it into every AI tool from now on.',
    tip: 'Paste your brand voice guide into future prompts with: "Write this in my brand voice: [paste the guide]."',
  },
  {
    day: 5,
    title: 'Create your first social post',
    tool: 'Canva AI',
    toolUrl: 'https://canva.com',
    timeEstimate: '45 minutes',
    color: '#7B3FE4',
    what: 'Today you make something you can actually post. Use Canva AI to design a graphic and write the caption in your brand voice. Your first piece of real content.',
    prompt: `First, use Claude to write the caption:
"Write a social media post for [Instagram/TikTok/LinkedIn] announcing [your idea] for the first time. Use my brand voice: [paste your Day 4 guide]. The post should: (1) hook them in the first line, (2) describe the problem you solve in two sentences, (3) end with a question that invites comments."

Then open Canva, use Magic Design, and create a visual that matches.`,
    deliverable: 'A designed social post ready to publish. Do not overthink it. Post it.',
    tip: 'The goal is not perfection. The goal is to have something real in the world. Ship it.',
  },
  {
    day: 6,
    title: 'Record your pitch in your own voice',
    tool: 'ElevenLabs',
    toolUrl: 'https://elevenlabs.io',
    timeEstimate: '45 minutes',
    color: '#F59E0B',
    what: 'A 60-second voice pitch is one of the most powerful tools you can have. Today you clone your voice and create a pitch you can attach to emails, DMs, or social posts — without recording yourself every time.',
    prompt: `First, write your script with Claude:
"Write a 60-second voice pitch script for [your business idea]. Use my brand voice: [paste your Day 4 guide]. Structure: (1) hook — one sentence that names the problem, (2) who you help and how, (3) why this matters now, (4) what to do next. Keep it conversational, not scripted-sounding."

Then go to ElevenLabs, clone your voice with a 30-second recording, paste the script, and generate the audio.`,
    deliverable: 'A 60-second MP3 pitch in your cloned voice. You never have to record this again — just regenerate anytime you update the script.',
    tip: 'Record your voice sample in a quiet room, speaking naturally. The more natural the sample, the better the clone.',
  },
  {
    day: 7,
    title: 'Make a 10-second brand video',
    tool: 'Higgsfield',
    toolUrl: 'https://higgsfield.ai',
    timeEstimate: '45 minutes',
    color: '#EC4899',
    what: 'Cinematic video used to cost thousands of dollars and take weeks. Today you make one in 45 minutes with a text prompt. This is the kind of thing that stops people mid-scroll.',
    prompt: `Write your video prompt for Higgsfield:
"[Describe your target customer in one sentence], holding [your product or representing your service], in [a setting that reflects your brand], looking confident and capable, cinematic lighting, 4K, authentic."

Example: "A 17-year-old in a Sydney bedroom, laptop open, building something online, determined expression, warm lighting, cinematic."`,
    deliverable: 'A 5-10 second video you can use as a social media ad, a website background, or a story.',
    tip: 'Generate 3-4 variations with slightly different prompts. Pick the one that makes you think "yes, that is my brand."',
  },
]

export default function StarterGuidePage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f0edff', fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      <CursorFix />

      {/* Header */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 48px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
          AI Unlocked · Starter Plan
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1 }}>
          7 days. 7 builds.<br />
          <span style={{ color: '#FF3366' }}>Zero experience needed.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
          This is not a list of tools. This is a plan. By Day 7 you will have a validated business idea,
          market research, a value proposition, a brand voice, a social post, a voice pitch, and a video.
          One tool per day. 30-45 minutes. All free to start.
        </p>

        <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {['Validated idea', 'Market research', 'Value proposition', 'Brand voice', 'Social post', 'Voice pitch', 'Brand video'].map((item) => (
            <span key={item} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: 'rgba(123,63,228,0.08)', border: '1px solid rgba(123,63,228,0.2)', padding: '4px 12px', borderRadius: 100 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Days */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {DAYS.map((day) => (
          <div key={day.day} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `4px solid ${day.color}`,
            borderRadius: 14,
            padding: '28px 28px 24px',
          }}>
            {/* Day header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: day.color }}>
                  Day {day.day} · {day.timeEstimate}
                </span>
                <h2 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '6px 0 0', letterSpacing: '-0.01em' }}>
                  {day.title}
                </h2>
              </div>
              <a href={day.toolUrl} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, fontSize: '0.82rem', fontWeight: 700, color: day.color, background: `${day.color}15`, border: `1px solid ${day.color}33`, padding: '6px 14px', borderRadius: 100, textDecoration: 'none' }}>
                Open {day.tool} →
              </a>
            </div>

            {/* What */}
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: 20 }}>
              {day.what}
            </p>

            {/* Prompt */}
            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                Your prompt
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                {day.prompt}
              </p>
            </div>

            {/* Deliverable + Tip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: `${day.color}0a`, border: `1px solid ${day.color}22`, borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: day.color, marginBottom: 6 }}>
                  What you end the day with
                </p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                  {day.deliverable}
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px 14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                  Tip
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.55, margin: 0 }}>
                  {day.tip}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 16, padding: '32px', background: 'rgba(123,63,228,0.06)', border: '1px solid rgba(123,63,228,0.2)', borderRadius: 14, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            After 7 days, you have 7 real things.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            The webinar in August shows you how to use these same tools to turn that foundation into
            your first income online. One night live. August 2026, AEST.
          </p>
          <a href="/ai-unlocked#waitlist-form"
            style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7B3FE4 0%, #FF3366 100%)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', padding: '12px 28px', borderRadius: 100, textDecoration: 'none' }}>
            Back to the Waitlist →
          </a>
        </div>
      </div>
    </div>
  )
}
