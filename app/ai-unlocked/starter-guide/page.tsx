import type { Metadata } from 'next'
import { CursorFix } from '@/components/ai-unlocked/CursorFix'

export const metadata: Metadata = {
  title: 'Your 7-Day AI Starter Plan — AI Unlocked',
  description: '7 days. One thing to build each day. Zero experience needed.',
  robots: { index: false, follow: false },
}

const DAYS = [
  {
    day: 1,
    title: 'Find an idea worth building',
    tool: 'ChatGPT',
    toolUrl: 'https://chat.openai.com',
    timeEstimate: '20 minutes',
    color: '#10B981',
    intro: "You do not need a business idea before you start. AI will help you find one. All you need to know is what you enjoy or what annoys you.",
    steps: [
      {
        label: 'Open ChatGPT and type this. Fill in the one blank.',
        content: `"I'm [your age] years old. I want to make money online. Here are 3-5 things I spend my time on or care about: [e.g. gaming / making TikToks / looking after younger kids / cooking / sport / helping my friends with their Instagram].

For each one, suggest a simple business idea I could start this week using AI and my phone, with no money. For each idea tell me: who would pay me, how much, and exactly how I'd make my first $100."`,
      },
      {
        label: 'Pick one idea. Then type this — fill in the blank with the idea you liked.',
        content: `"I want to start: [paste the idea here]. Tell me the three biggest reasons this could fail, and for each problem, tell me how I would fix it."`,
      },
    ],
    whatGoodLooksLike: "A list of 3 problems with 3 fixes. If the fixes make sense and feel doable, your idea is worth continuing. If they feel impossible, pick a different idea from the first list.",
    stuck: 'If you cannot think of what to put in the first blank, write: gaming, helping friends, making videos, food, sport. That is enough to get started.',
  },
  {
    day: 2,
    title: 'Find out who would actually pay you',
    tool: 'Perplexity',
    toolUrl: 'https://perplexity.ai',
    timeEstimate: '20 minutes',
    color: '#7B3FE4',
    intro: "Before you build anything, you need to know one thing: is there someone who would actually pay for this? Today you find out in 20 minutes.",
    steps: [
      {
        label: 'Open Perplexity and type this. Fill in the blanks with your Day 1 idea.',
        content: `"I want to start a business that helps [type who your idea helps, e.g. 'students who need study help' or 'parents who need pet sitting']. Tell me: how many people in Australia have this problem, what they are currently doing to solve it, and how much they spend on it. Include sources."`,
      },
      {
        label: 'Read the answer. Then type this follow-up.',
        content: `"What do people complain about most with the current solutions? What would make someone switch to something new?"`,
      },
    ],
    whatGoodLooksLike: "A real number of people with this problem, what they already pay, and what frustrates them most. If the answer feels vague, type: \"Give me more specific numbers for Australia, for people aged 15-30.\"",
    stuck: "If Perplexity gives a short or unclear answer, it means your idea might be too vague. Go back to ChatGPT and ask: \"Make my idea more specific — narrow it down to one type of person in one situation.\"",
  },
  {
    day: 3,
    title: 'Write the one sentence that explains your business',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '20 minutes',
    color: '#FF3366',
    intro: "Every business that works can explain itself in one sentence. Not a paragraph. Not a list. One sentence that makes someone say \"I need that.\" Today you write yours.",
    steps: [
      {
        label: 'Open Claude and type this. Fill in the blanks.',
        content: `"My business helps [the type of person from Day 2, e.g. 'Year 10 students in Australia']. The problem they have is [what you found out in Day 2, e.g. 'they can't afford tutors but are stressed about exams']. What they want is [the result they actually want, e.g. 'to feel prepared and not panic before their tests'].

Write me 5 different one-sentence descriptions of my business. Each one should start with what the customer gets — not what I do. Write one for a teenager, one for their parent, one that sounds urgent, one that sounds exciting, and one that sounds simple and easy."`,
      },
    ],
    whatGoodLooksLike: "Five sentences that do NOT start with \"I\" or \"We.\" They should describe how the customer's life gets better. Read each one aloud — the one that does not sound weird when you say it is probably the winner.",
    stuck: "If they all start with \"I help\" or \"We provide\" — type: \"Rewrite these so every sentence starts from the customer's point of view. What does the customer experience, not what do I do?\"",
  },
  {
    day: 4,
    title: 'Give your business a personality',
    tool: 'Claude AI',
    toolUrl: 'https://claude.ai',
    timeEstimate: '20 minutes',
    color: '#FF3366',
    intro: "Your business sounds like something. It might be funny, serious, friendly, bold, calm, or energetic. Figuring this out now means every post and message you create from Day 5 will sound like it came from the same place.",
    steps: [
      {
        label: 'Open Claude and type this. Fill in the blanks.',
        content: `"I am starting a business called [name or working title]. My customers are [who they are, from Day 2]. Three things or people whose tone or style I like and want to sound similar to: [list three — could be a YouTuber, a brand, an app, a friend, anything].

Write me: (1) three words that describe how my business sounds, (2) five words or phrases my business uses a lot, (3) five words my business never uses, (4) two example sentences written exactly the way my business would write them."`,
      },
    ],
    whatGoodLooksLike: "Three short words that actually feel like you. Two example sentences that sound like something you'd actually say. Save this whole answer — you'll paste it into every prompt from Day 5 onwards.",
    stuck: "If you cannot think of three things whose tone you like, use these: a YouTuber you watch, a brand whose ads you do not skip, and one friend who texts in a way that always sounds right.",
  },
  {
    day: 5,
    title: 'Write and design your first post',
    tool: 'Claude AI + Canva',
    toolUrl: 'https://claude.ai',
    timeEstimate: '30 minutes',
    color: '#7B3FE4',
    intro: "Today you make something you can actually post. Claude writes the words. Canva makes the visual. By the end of tonight, your business exists in the world.",
    steps: [
      {
        label: 'Open Claude. Paste this prompt — fill in the blanks.',
        content: `"Write a social media post announcing my business for the first time. My business helps [from Day 2]. My business personality is: [paste your full Day 4 answer here].

The post should: (1) first line stops someone scrolling — make it a question or a bold statement, (2) two sentences explaining what I do and who it helps, (3) last line is a question that makes people want to comment. Make it short. No hashtags."`,
      },
      {
        label: 'Now go to canva.com. Do this:',
        content: `1. Click "Create a design"
2. Search "Instagram post" and choose a template
3. Click the magic wand or "Magic Design" button
4. Type what your business does in one sentence
5. Pick a design that matches the mood of your Day 4 words
6. Replace the template text with your Claude post
7. Download it`,
      },
    ],
    whatGoodLooksLike: "A post you are not embarrassed to show someone. It does not have to be perfect. It has to exist. Post it tonight.",
    stuck: "If the Claude post sounds boring or stiff, type: \"Rewrite this to sound like a 16-year-old who is genuinely excited about this idea, talking to their friends.\"",
  },
  {
    day: 6,
    title: 'Make a 60-second pitch in your own voice',
    tool: 'ElevenLabs',
    toolUrl: 'https://elevenlabs.io',
    timeEstimate: '30 minutes',
    color: '#F59E0B',
    intro: "A voice message explaining your business — in your own voice — that you can send in a DM, attach to an email, or use on social. Today you clone your voice once. After that you never have to record yourself again.",
    steps: [
      {
        label: 'First, write the script with Claude.',
        content: `"Write me a 60-second script for [my business name and what it does from Day 3]. My business personality is: [paste your Day 4 answer]. The script should sound like I am explaining this to a friend — not presenting it. Structure: one sentence on the problem, two sentences on what I do and who I help, one sentence on why this is better now than it was before, one sentence on what to do next."`,
      },
      {
        label: 'Then clone your voice.',
        content: `1. Go to elevenlabs.io — create a free account
2. Click "Voice Lab" then "Add a new voice"
3. Find the quietest spot you can — a cupboard works
4. Record yourself reading anything aloud for 30 seconds
5. Name the voice, save it
6. Go to Text to Speech, select your voice
7. Paste your Claude script
8. Click Generate — download the MP3`,
      },
    ],
    whatGoodLooksLike: "A 55-65 second audio clip that sounds like you talking normally. Send it to one person today and watch their reaction. If they ask \"wait, how did you make that?\" — it worked.",
    stuck: "If the script sounds too formal, type: \"Make this sound more casual — like I'm explaining it at the dinner table, not in a job interview.\"",
  },
  {
    day: 7,
    title: 'Make a video for your business',
    tool: 'Higgsfield',
    toolUrl: 'https://higgsfield.ai',
    timeEstimate: '30 minutes',
    color: '#EC4899',
    intro: "Cinematic video used to cost thousands and take weeks to produce. Today you make one with a sentence. This is what makes people stop and think your business looks like a real brand.",
    steps: [
      {
        label: 'Go to higgsfield.ai and create a free account. Then type this — adapt it to your business.',
        content: `"A [your age, e.g. 16]-year-old in [a place that fits your brand, e.g. a Sydney bedroom / a kitchen / a park], [doing something that relates to your business, e.g. looking at their laptop / cooking / studying], looking focused and confident, cinematic lighting, warm and authentic."

Example for a study business: "A 16-year-old in a Sydney bedroom, laptop open, studying and smiling slightly, organised desk, warm lamp light, cinematic, authentic."

Generate this 3-4 times with small changes. Pick the one that looks most like your brand.`,
      },
    ],
    whatGoodLooksLike: "A 5-10 second video that looks like it belongs in an ad. Show it to someone and ask: \"Does this look like a real business?\" If they say yes — it is working.",
    stuck: "If the video looks nothing like what you imagined, add more detail to your prompt: the colour of the walls, what time of day, what expression the person has. The more specific the prompt, the better the result.",
  },
]

export default function StarterGuidePage() {
  return (
    <div style={{ background: '#000', minHeight: '100vh', color: '#f0edff', fontFamily: 'var(--font-inter, system-ui, sans-serif)' }}>
      <CursorFix />

      {/* Header */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '60px 24px 40px' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7B3FE4', marginBottom: 12 }}>
          AI Unlocked · Starter Guide
        </p>
        <h1 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 16px', lineHeight: 1.1 }}>
          7 days. One thing to do each day.<br />
          <span style={{ color: '#FF3366' }}>By the end, you've built something real.</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
          No experience. No money. No idea needed before you start.
          Each day takes 20-30 minutes. All the tools are free.
          Every prompt is ready to copy — just fill in the gaps.
        </p>

        <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(123,63,228,0.06)', border: '1px solid rgba(123,63,228,0.2)', borderRadius: 10 }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            By Day 7 you will have: a tested business idea, research on who would pay you, a one-sentence description, a business personality, a social post live in the world, a voice pitch, and a video.
          </p>
        </div>
      </div>

      {/* Days */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {DAYS.map((day) => (
          <div key={day.day} style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `4px solid ${day.color}`,
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {/* Day header */}
            <div style={{ padding: '22px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: day.color }}>
                    Day {day.day} · {day.timeEstimate}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '5px 0 0', letterSpacing: '-0.01em' }}>
                    {day.title}
                  </h2>
                </div>
                <a href={day.toolUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: day.color, background: `${day.color}15`, border: `1px solid ${day.color}33`, padding: '6px 14px', borderRadius: 100, textDecoration: 'none' }}>
                  Open {day.tool} →
                </a>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 20px' }}>
                {day.intro}
              </p>
            </div>

            {/* Steps */}
            <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {day.steps.map((step, si) => (
                <div key={si}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', letterSpacing: '0.02em' }}>
                    {`Step ${si + 1}: ${step.label}`}
                  </p>
                  <div style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {step.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* What good looks like + stuck */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: day.color, marginBottom: 6 }}>
                  What a good result looks like
                </p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
                  {day.whatGoodLooksLike}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>
                  If you get stuck
                </p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.83rem', lineHeight: 1.6, margin: 0 }}>
                  {day.stuck}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{ marginTop: 8, padding: '28px', background: 'rgba(123,63,228,0.06)', border: '1px solid rgba(123,63,228,0.2)', borderRadius: 14, textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-syne, system-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '0 0 10px', letterSpacing: '-0.01em' }}>
            That is 7 real things you built in 7 days.
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.65, margin: '0 0 20px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
            The webinar in August shows you how to turn that foundation into your first income online. One night live. August 2026.
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
